import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

import { gameUrl, randomRoom, waitForGameReady } from './helpers'

/**
 * Perf budgets on the DETERMINISTIC renderer metrics. FPS on shared CI
 * runners is noise, but draw calls, triangles and geometry counts are
 * exact for a given scene — a PR that blows these up gets caught here.
 *
 * Budgets are a ratchet: set from measured values + headroom
 * (draw calls/tris/geometries measured 2026-06-10, desktop w/ shadows:
 * 708 draw calls, ~70k tris, ~1,400 geometries once the whole map has
 * been seen; per-frame callbacks measured 2026-06-26 at 91). Tighten
 * them as the scene gets optimised; never raise them casually.
 *
 * CPU, not just GPU. Draw calls and triangles bound the *render*; they
 * say nothing about main-thread cost. Two guards cover CPU without
 * leaning on noisy frame timings:
 *   - `frameCallbacks` — the number of `useFrame` loops that run every
 *     rendered frame. A deterministic proxy for per-frame JS work; a
 *     swarm of new loops is a CPU regression even if draw calls hold.
 *   - the idle-tab test below — asserts the render loop fully stops when
 *     the tab is hidden, so a backgrounded tab costs ~0 CPU instead of
 *     pinning a core (the "laptop runs hot with the tab just open" bug).
 *
 * Note on geometries: THREE registers a geometry the first time the
 * renderer *sees* it, so the count climbs as the camera tours the map
 * and then plateaus. Leak detection therefore uses a plateau check —
 * a second identical tour must add ~nothing — rather than raw growth.
 */
const DRAW_CALL_BUDGET = 800
const TRIANGLE_BUDGET = 120_000
const GEOMETRY_BUDGET = 1_600
const TEXTURE_BUDGET = 12
const FRAME_CALLBACK_BUDGET = 110

const geometries = (page: Page) =>
  page.evaluate(() => window.__testApi!.rendererInfo().geometries)

/** Drive the Page Visibility API the way a real tab switch would.
 * Playwright can't truly background a page, so override the getters and
 * fire the event the app listens for. */
async function setTabHidden(page: Page, hidden: boolean) {
  await page.evaluate((h) => {
    Object.defineProperty(document, 'hidden', { value: h, configurable: true })
    Object.defineProperty(document, 'visibilityState', {
      value: h ? 'hidden' : 'visible',
      configurable: true,
    })
    document.dispatchEvent(new Event('visibilitychange'))
  }, hidden)
}

/** Teleport the player through the random spawn pool, forcing the
 * camera (and renderer) to visit the whole map. */
async function respawnTour(page: Page, hops: number) {
  for (let i = 0; i < hops; i++) {
    await page.evaluate(() => {
      window.__testApi!.store.getState().respawn()
    })
    await page.waitForTimeout(150)
  }
  await page.waitForTimeout(500)
}

/** Wait until the geometry count holds still across consecutive samples.
 * Ambient NPCs/hazards keep registering geometry for the first ~10s as
 * they wander into the frustum; baselining before that background growth
 * settles reads as a fake leak in the plateau tests below. */
async function waitForGeometryPlateau(page: Page) {
  let prev = await geometries(page)
  for (let stable = 0, tries = 0; stable < 2 && tries < 15; tries++) {
    await page.waitForTimeout(700)
    const now = await geometries(page)
    stable = now === prev ? stable + 1 : 0
    prev = now
  }
}

test.describe('perf budget', () => {
  test('renderer stays within draw-call/triangle/memory budgets', async ({
    page,
  }) => {
    await page.goto(gameUrl(randomRoom()))
    await waitForGameReady(page)
    await page.waitForTimeout(2_000)

    // Per-frame budgets are sampled at the FIXED initial spawn view —
    // random spawn angles see different slices of the scene and would
    // make the numbers (and the budget) nondeterministic.
    let worst = { drawCalls: 0, triangles: 0, textures: 0 }
    for (let i = 0; i < 5; i++) {
      const info = await page.evaluate(() => window.__testApi!.rendererInfo())
      worst = {
        drawCalls: Math.max(worst.drawCalls, info.drawCalls),
        triangles: Math.max(worst.triangles, info.triangles),
        textures: Math.max(worst.textures, info.textures),
      }
      await page.waitForTimeout(200)
    }

    expect(worst.drawCalls, 'draw calls per frame').toBeLessThanOrEqual(
      DRAW_CALL_BUDGET,
    )
    expect(worst.triangles, 'triangles per frame').toBeLessThanOrEqual(
      TRIANGLE_BUDGET,
    )
    expect(worst.textures, 'live textures').toBeLessThanOrEqual(TEXTURE_BUDGET)

    // Per-frame CPU proxy: the count of active useFrame loops. Settle
    // first so every ambient NPC/hazard has registered its loop.
    const frameCallbacks = await page.evaluate(
      () => window.__testApi!.rendererInfo().frameCallbacks,
    )
    expect(frameCallbacks, 'per-frame useFrame callbacks').toBeLessThanOrEqual(
      FRAME_CALLBACK_BUDGET,
    )

    // The geometry cap is a whole-scene number: tour the map so every
    // camera-reachable geometry registers, then assert the total.
    await respawnTour(page, 10)
    const registered = await geometries(page)
    expect(registered, 'registered geometries').toBeLessThanOrEqual(
      GEOMETRY_BUDGET,
    )
  })

  test('render loop stops while the tab is hidden (idle CPU)', async ({
    page,
  }) => {
    await page.goto(gameUrl(randomRoom()))
    await waitForGameReady(page)
    await page.waitForTimeout(1_000)

    const frame = () =>
      page.evaluate(() => window.__testApi!.rendererInfo().frame)

    // While visible the monotonic render counter must keep climbing.
    const before = await frame()
    await page.waitForTimeout(500)
    expect(
      (await frame()) - before,
      'frames rendered while visible',
    ).toBeGreaterThan(5)

    // Fake a tab switch. The render loop should cancel its rAF entirely,
    // so the counter freezes — a hidden tab does zero rendering work.
    await setTabHidden(page, true)
    await page.waitForTimeout(500) // let the prop flip + loop cancel
    const idleStart = await frame()
    await page.waitForTimeout(1_500)
    expect(
      (await frame()) - idleStart,
      'frames rendered while hidden (should be ~0)',
    ).toBeLessThanOrEqual(2)

    // Returning to the tab must kick the cancelled loop back to life.
    await setTabHidden(page, false)
    const resumeStart = await frame()
    await page.waitForTimeout(500)
    expect(
      (await frame()) - resumeStart,
      'frames rendered after returning',
    ).toBeGreaterThan(5)
  })

  test('respawn churn plateaus — no per-respawn geometry leak', async ({
    page,
  }) => {
    test.setTimeout(60_000)
    await page.goto(gameUrl(randomRoom()))
    await waitForGameReady(page)
    await page.waitForTimeout(2_000)

    // first tour registers every part of the map the camera can see
    await respawnTour(page, 15)
    await waitForGeometryPlateau(page)
    const afterFirstTour = await geometries(page)

    // a second tour over the same spawn pool must add ~nothing; a real
    // per-respawn leak would keep growing linearly (~36/hop when this
    // test was written against a hypothetical regression)
    await respawnTour(page, 15)
    const afterSecondTour = await geometries(page)

    expect(
      afterSecondTour - afterFirstTour,
      'second-tour geometry growth',
    ).toBeLessThanOrEqual(25)
  })

  test('peer churn plateaus — despawned avatars free their geometry', async ({
    page,
  }) => {
    test.setTimeout(60_000)
    await page.goto(gameUrl(randomRoom()))
    await waitForGameReady(page)
    await page.waitForTimeout(2_000)

    // Settle the world before baselining — unsettled background growth
    // is what the old "avatars leak ~2.4 geometries" TODO actually
    // measured; avatar disposal, nametag included, is clean.
    await respawnTour(page, 10)
    await waitForGeometryPlateau(page)

    const churn = async () => {
      await page.evaluate(() => {
        const api = window.__testApi!
        for (let i = 0; i < 4; i++) {
          api.spawnPeer(`leak-${i}`, api.playerPosition.x + i, 1, api.playerPosition.z - 6)
        }
      })
      await page.waitForTimeout(300)
      await page.evaluate(() => {
        const api = window.__testApi!
        for (let i = 0; i < 4; i++) api.despawnPeer(`leak-${i}`)
      })
      await page.waitForTimeout(300)
    }

    // first round pays one-time costs (troika glyph cache etc.)
    await churn()
    const afterFirstRound = await geometries(page)

    for (let round = 0; round < 4; round++) await churn()
    const afterAllRounds = await geometries(page)

    expect(
      afterAllRounds - afterFirstRound,
      'geometry growth across repeated peer churn',
    ).toBeLessThanOrEqual(15)
  })
})
