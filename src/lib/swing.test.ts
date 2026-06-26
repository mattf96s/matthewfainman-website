import { describe, expect, it } from 'vitest'

import { swingPose, SWING_STRIKE_MS } from './swing'

/** The game's SWING_INTERVAL_MS; any value past the 300ms anim works here. */
const INTERVAL = 450

describe('swingPose', () => {
  it('rests near idle pitch at t=0 with no lift or lunge', () => {
    const p = swingPose(0, INTERVAL)
    expect(p.pitch).toBeCloseTo(-0.35)
    expect(p.lift).toBe(0)
    expect(p.lunge).toBe(0)
  })

  it('raises the blade during windup (lift > 0, pitch more negative)', () => {
    const p = swingPose(45, INTERVAL) // windup ends at 90ms
    expect(p.lift).toBeGreaterThan(0)
    expect(p.pitch).toBeLessThan(-0.35)
  })

  it('lunges forward around the strike frame', () => {
    expect(swingPose(SWING_STRIKE_MS, INTERVAL).lunge).toBeGreaterThan(0)
  })

  it('returns to idle once past the cooldown', () => {
    const p = swingPose(INTERVAL + 10, INTERVAL)
    expect(p.pitch).toBeCloseTo(-0.35)
    expect(p.lift).toBe(0)
    expect(p.lunge).toBe(0)
  })

  it('resolves the strike within the animation window', () => {
    expect(SWING_STRIKE_MS).toBeGreaterThan(0)
    expect(SWING_STRIKE_MS).toBeLessThan(300)
  })
})
