import { expect, test } from '@playwright/test'

import { gameUrl, randomRoom, waitForGameReady } from './helpers'

test.describe('smoke', () => {
  test('game boots clean: canvas, HUD, no page errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))

    await page.goto(gameUrl(randomRoom()))
    await waitForGameReady(page)

    await expect(page.locator('canvas')).toBeVisible()
    // HUD basics
    await expect(page.getByText(/online/)).toBeVisible()
    await expect(page.getByText('SCORE')).toBeVisible()

    expect(errors).toEqual([])
  })

  test('desktop start screen: play prompt, name entry, corner socials', async ({
    page,
  }) => {
    await page.goto(gameUrl(randomRoom()))
    await waitForGameReady(page)

    // The lock-affordance prompt and a name field to fill before playing.
    await expect(page.getByText(/Click to aim/)).toBeVisible()
    await expect(page.getByPlaceholder('your name')).toBeVisible()

    // GitHub + LinkedIn links sit in the bottom-right corner.
    const github = page.getByRole('link', { name: 'GitHub' })
    const linkedin = page.getByRole('link', { name: 'LinkedIn' })
    await expect(github).toBeVisible()
    await expect(linkedin).toBeVisible()
    expect(await github.getAttribute('href')).toContain('github.com')
    expect(await linkedin.getAttribute('href')).toContain('linkedin.com')
  })

  test('player name persists across reloads via localStorage', async ({
    page,
  }) => {
    const room = randomRoom()
    await page.goto(gameUrl(room))
    await waitForGameReady(page)

    const input = page.getByPlaceholder('your name')
    await input.fill('e2e tester')
    await input.blur()

    await page.reload()
    await waitForGameReady(page)
    await expect(page.getByPlaceholder('your name')).toHaveValue('e2e tester')
  })

  test('a remote player renders and the presence count updates', async ({
    page,
  }) => {
    await page.goto(gameUrl(randomRoom()))
    await waitForGameReady(page)

    await page.evaluate(() => {
      const api = window.__testApi!
      api.spawnPeer('e2e-peer', api.playerPosition.x, 1, api.playerPosition.z - 8)
    })
    // presence pill counts peers + self
    await expect(page.getByText('2 online')).toBeVisible()
    // nametag is rendered by drei <Text> inside the canvas, so assert
    // via the peer store instead of the DOM
    const peers = await page.evaluate(() =>
      window.__testApi!.playerPosition.ready
        ? document.querySelectorAll('svg circle[r="2.1"]').length
        : -1,
    )
    expect(peers).toBeGreaterThanOrEqual(1)
  })

  test('two real clients meet in an isolated room', async ({ browser }) => {
    test.setTimeout(90_000)
    const room = randomRoom()
    const ctxA = await browser.newContext()
    const ctxB = await browser.newContext()
    const a = await ctxA.newPage()
    const b = await ctxB.newPage()

    await a.goto(gameUrl(room))
    await waitForGameReady(a)
    await b.goto(gameUrl(room))
    await waitForGameReady(b)

    await expect(a.getByText('2 online')).toBeVisible({ timeout: 45_000 })
    await expect(b.getByText('2 online')).toBeVisible({ timeout: 45_000 })

    await ctxA.close()
    await ctxB.close()
  })
})
