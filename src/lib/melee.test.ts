import { describe, expect, it } from 'vitest'

import { isInMeleeArc } from './melee'

// Illustrative arc/range — isInMeleeArc is tuning-agnostic, so these are
// deliberately independent of the live SWORD_* constants in shots.ts.
const COS_HALF = Math.cos((50 * Math.PI) / 180)
const RANGE = 2.5

describe('isInMeleeArc', () => {
  it('hits a target straight ahead in range', () => {
    expect(isInMeleeArc(0, -2, 0, -1, RANGE, COS_HALF)).toBe(true)
  })

  it('misses a target behind the attacker', () => {
    expect(isInMeleeArc(0, 2, 0, -1, RANGE, COS_HALF)).toBe(false)
  })

  it('misses a target dead to the side', () => {
    expect(isInMeleeArc(2, 0, 0, -1, RANGE, COS_HALF)).toBe(false)
  })

  it('misses a target ahead but out of range', () => {
    expect(isInMeleeArc(0, -RANGE - 0.01, 0, -1, RANGE, COS_HALF)).toBe(false)
  })

  it('hits exactly at max range', () => {
    expect(isInMeleeArc(0, -RANGE, 0, -1, RANGE, COS_HALF)).toBe(true)
  })

  it('respects the arc boundary', () => {
    // 45° off-axis: inside a 50° half-arc, outside a 40° one
    const d = Math.SQRT1_2 * 2
    expect(isInMeleeArc(d, -d, 0, -1, RANGE, Math.cos((50 * Math.PI) / 180))).toBe(true)
    expect(isInMeleeArc(d, -d, 0, -1, RANGE, Math.cos((40 * Math.PI) / 180))).toBe(false)
  })

  it('always hits an overlapping target, regardless of facing', () => {
    expect(isInMeleeArc(0, 0, 0, -1, RANGE, COS_HALF)).toBe(true)
    expect(isInMeleeArc(1e-4, 1e-4, 0, -1, RANGE, COS_HALF)).toBe(true)
  })

  it('works for any facing direction', () => {
    // facing +x, target at +x
    expect(isInMeleeArc(1.5, 0, 1, 0, RANGE, COS_HALF)).toBe(true)
    expect(isInMeleeArc(-1.5, 0, 1, 0, RANGE, COS_HALF)).toBe(false)
  })
})
