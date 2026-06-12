import { describe, expect, it } from 'vitest'

import { REGEN_DELAY_S, REGEN_RATE_PER_S, regenTick } from './healthRegen'

const MAX = 100

describe('regenTick', () => {
  it('does not regenerate while dead', () => {
    expect(regenTick(0, MAX, REGEN_DELAY_S + 10, 0.016)).toBe(0)
  })

  it('does not regenerate at full health', () => {
    expect(regenTick(MAX, MAX, REGEN_DELAY_S + 10, 0.016)).toBe(0)
  })

  it('does not regenerate inside the post-damage delay', () => {
    expect(regenTick(50, MAX, REGEN_DELAY_S - 0.5, 0.016)).toBe(0)
    expect(regenTick(50, MAX, 0.016, 0.016)).toBe(0)
  })

  it('heals at the configured rate once the delay has passed', () => {
    const delta = 0.5
    expect(regenTick(50, MAX, REGEN_DELAY_S + 2, delta)).toBeCloseTo(
      REGEN_RATE_PER_S * delta,
    )
  })

  it('pro-rates the frame in which the delay expires', () => {
    // delay ends 0.1s into a 0.25s frame → only 0.15s of regen
    const delta = 0.25
    const since = REGEN_DELAY_S + 0.15
    expect(regenTick(50, MAX, since, delta)).toBeCloseTo(
      REGEN_RATE_PER_S * 0.15,
    )
  })

  it('never overshoots max health', () => {
    expect(regenTick(MAX - 0.5, MAX, REGEN_DELAY_S + 10, 10)).toBeCloseTo(0.5)
  })

  it('accumulates to a full heal over time', () => {
    // simulate 60fps from 1hp: regen should walk health all the way up
    let health = 1
    let since = 0
    const delta = 1 / 60
    for (let i = 0; i < 60 * 60 && health < MAX; i++) {
      since += delta
      health += regenTick(health, MAX, since, delta)
    }
    expect(health).toBe(MAX)
  })
})
