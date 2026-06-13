import { expect, test } from '@playwright/test'

import { gameUrl, randomRoom, waitForGameReady } from './helpers'

/**
 * Combat-loop coverage: weapon switching, the sword's melee path from
 * input → arc check → hit feedback, and passive health regen. All of it
 * drives the real game through the same entry points players use
 * (keyboard, the mobile FIRE flag) rather than poking internals — the
 * store is only used to arrange state and observe outcomes.
 */

test.describe('combat', () => {
  test('keyboard weapon switching: 1 / 2 select, typing is ignored', async ({
    page,
  }) => {
    await page.goto(gameUrl(randomRoom()))
    await waitForGameReady(page)

    const weapon = () =>
      page.evaluate(() => window.__testApi!.store.getState().weapon)

    expect(await weapon()).toBe('gun')

    await page.keyboard.press('2')
    expect(await weapon()).toBe('sword')

    await page.keyboard.press('1')
    expect(await weapon()).toBe('gun')

    // keys typed into the name editor must not switch weapons
    const input = page.getByPlaceholder('your name')
    await input.click()
    await input.press('2')
    expect(await weapon()).toBe('gun')
  })

  test('sword swing lands on a peer in front and shows the hitmarker', async ({
    page,
  }) => {
    await page.goto(gameUrl(randomRoom()))
    await waitForGameReady(page)

    // Plant a fake peer 1m dead ahead of wherever the player spawned
    // (inside the sword's ~1.3m reach) facing whichever way the camera
    // does, then hold FIRE with the sword out. The swing auto-repeats
    // while held, so the 200ms hitmarker keeps reappearing for the
    // visibility poll to catch.
    await page.evaluate(() => {
      const api = window.__testApi!
      const { x, y, z } = api.playerPosition
      const yaw = api.cameraState.yaw
      api.spawnPeer(
        'sword-target',
        x + -Math.sin(yaw) * 1.0,
        y,
        z + -Math.cos(yaw) * 1.0,
      )
      api.store.getState().setWeapon('sword')
      api.mobileInput.firePressed = true
    })

    await expect(page.getByText('✕')).toBeVisible({ timeout: 5_000 })

    await page.evaluate(() => {
      window.__testApi!.mobileInput.firePressed = false
      window.__testApi!.despawnPeer('sword-target')
    })
  })

  test('sword does not reach a peer beyond hugging distance', async ({
    page,
  }) => {
    await page.goto(gameUrl(randomRoom()))
    await waitForGameReady(page)

    // 2.2m dead ahead: inside the camera's view and the swing arc, but
    // well past the sword's ~1.3m reach. This is the "stab from across
    // the street" case — it must NOT connect, regardless of where the
    // camera is aimed.
    await page.evaluate(() => {
      const api = window.__testApi!
      const { x, y, z } = api.playerPosition
      const yaw = api.cameraState.yaw
      api.spawnPeer(
        'far-target',
        x + -Math.sin(yaw) * 2.2,
        y,
        z + -Math.cos(yaw) * 2.2,
      )
      api.store.getState().setWeapon('sword')
      api.mobileInput.firePressed = true
    })

    await page.waitForTimeout(1_500)
    await expect(page.getByText('✕')).not.toBeVisible()

    await page.evaluate(() => {
      window.__testApi!.mobileInput.firePressed = false
      window.__testApi!.despawnPeer('far-target')
    })
  })

  test('sword swing misses a peer behind the player', async ({ page }) => {
    await page.goto(gameUrl(randomRoom()))
    await waitForGameReady(page)

    await page.evaluate(() => {
      const api = window.__testApi!
      const { x, y, z } = api.playerPosition
      const yaw = api.cameraState.yaw
      // directly BEHIND the facing direction, inside sword range
      api.spawnPeer(
        'back-target',
        x + Math.sin(yaw) * 1.0,
        y,
        z + Math.cos(yaw) * 1.0,
      )
      api.store.getState().setWeapon('sword')
      api.mobileInput.firePressed = true
    })

    // several swing cooldowns' worth of holding FIRE — no hit feedback
    await page.waitForTimeout(1_500)
    await expect(page.getByText('✕')).not.toBeVisible()

    await page.evaluate(() => {
      window.__testApi!.mobileInput.firePressed = false
      window.__testApi!.despawnPeer('back-target')
    })
  })

  test('health regenerates after the post-damage delay, not before', async ({
    page,
  }) => {
    test.setTimeout(45_000)
    await page.goto(gameUrl(randomRoom()))
    await waitForGameReady(page)

    const health = () =>
      page.evaluate(() => window.__testApi!.store.getState().health)

    await page.evaluate(() => {
      window.__testApi!.store.getState().takeDamage(40, 'e2e')
    })
    expect(await health()).toBe(60)

    // inside the 5s regen delay nothing should come back
    await page.waitForTimeout(3_000)
    expect(await health()).toBe(60)

    // past the delay health climbs at ~3/s toward full
    await page.waitForFunction(
      () => window.__testApi!.store.getState().health > 70,
      undefined,
      { timeout: 15_000 },
    )

    // a fresh hit resets the climb: health drops and holds again
    await page.evaluate(() => {
      window.__testApi!.store.getState().takeDamage(30, 'e2e')
    })
    const afterHit = await health()
    await page.waitForTimeout(2_500)
    expect(await health()).toBe(afterHit)
  })
})
