import { expect, test } from '@playwright/test'

import { gameUrl, randomRoom, waitForGameReady } from './helpers'

/**
 * The mobile HUD is deliberately sparser than desktop: no FPS readout, no
 * social credit sitting under the FIRE thumb, and the "online" pill stays
 * hidden until someone else is actually around — so a small screen isn't
 * overwhelming. These guard that declutter against a future regression
 * that quietly crams the phone HUD again.
 *
 * The suite's only Playwright project is Desktop Chrome, so this spins up
 * its own touch-emulated context (the same trick the two-client smoke
 * test uses for isolation).
 */
test.describe('mobile HUD', () => {
  test('phone HUD drops desktop clutter, keeps the thumb controls', async ({
    browser,
  }) => {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 740 },
      hasTouch: true,
      isMobile: true,
    })
    const page = await ctx.newPage()
    await page.goto(gameUrl(randomRoom()))
    await waitForGameReady(page)

    // Dev/portfolio chrome is stripped on phones.
    await expect(page.getByText(/fps/)).toHaveCount(0)
    await expect(page.getByText('Matthew Fainman')).toHaveCount(0)
    // Solo → no presence pill taking up the crowded top band.
    await expect(page.getByText(/online/)).toHaveCount(0)

    // The essential touch controls are all present.
    await expect(page.getByRole('button', { name: 'JUMP' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'FIRE' })).toBeVisible()
    await expect(
      page.getByRole('button', { name: /tap to swap/ }),
    ).toBeVisible()

    await ctx.close()
  })
})
