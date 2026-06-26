import { test } from '@playwright/test'

/**
 * Not an assertion suite — a render harness. It drives the /dev/cars
 * showroom and saves stills of each procedural car model to
 * test-results/model-shots/ so the designs can be eyeballed (by a human
 * or by an agent reading the PNGs) and iterated on without the live game.
 *
 * Runs against the production build like the rest of the e2e suite, so
 * `pnpm build` first. Add models/views to SHOTS as needed.
 */
const SHOTS = [
  { model: 'tesla', view: 'front' },
  { model: 'tesla', view: 'side' },
  { model: 'tesla', view: 'rear' },
  { model: 'tesla', view: 'top' },
  { model: 'microcar', view: 'front' },
  { model: 'both', view: 'front' },
] as const

test.describe('model shots', () => {
  for (const { model, view } of SHOTS) {
    test(`${model} — ${view}`, async ({ page }) => {
      await page.goto(`/dev/cars?model=${model}&view=${view}&spin=0`)
      await page.waitForSelector('canvas')
      // static scene — give it a beat to build geometry + paint a frame
      await page.waitForTimeout(1200)
      await page
        .locator('canvas')
        .screenshot({ path: `test-results/model-shots/${model}-${view}.png` })
    })
  }
})
