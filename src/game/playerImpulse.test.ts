import { beforeEach, describe, expect, it } from 'vitest'

import {
  isKnockbackActive,
  playerImpulse,
  triggerKnockback,
} from './playerImpulse'

beforeEach(() => {
  // clear any knockback a prior test left active
  playerImpulse.startedAt = 0
  playerImpulse.endsAt = 0
  playerImpulse.durationMs = 0
  playerImpulse.vx = 0
  playerImpulse.vy = 0
  playerImpulse.vz = 0
})

describe('triggerKnockback', () => {
  it('sets the planar + vertical velocity and an end time in the future', () => {
    triggerKnockback(1000, 3, 7, 4)
    expect(playerImpulse.vx).toBe(3)
    expect(playerImpulse.vy).toBe(7)
    expect(playerImpulse.vz).toBe(4)
    expect(playerImpulse.endsAt).toBeGreaterThan(performance.now())
  })

  it('a stronger knockback overrides an active weaker one', () => {
    triggerKnockback(10_000, 1, 0, 0) // weak, long-lived
    triggerKnockback(10_000, 10, 0, 5) // greater planar magnitude
    expect(playerImpulse.vx).toBe(10)
    expect(playerImpulse.vz).toBe(5)
  })

  it('a weaker knockback does NOT interrupt an active stronger one', () => {
    triggerKnockback(10_000, 10, 0, 0) // strong, long-lived
    triggerKnockback(10_000, 1, 0, 0) // weaker — should be ignored
    expect(playerImpulse.vx).toBe(10)
  })

  it('any knockback replaces an expired one regardless of strength', () => {
    triggerKnockback(0, 10, 0, 0) // ends immediately
    triggerKnockback(1000, 1, 0, 0) // not blocked — prior one has lapsed
    expect(playerImpulse.vx).toBe(1)
  })
})

describe('isKnockbackActive', () => {
  it('is true before endsAt and false after', () => {
    triggerKnockback(100, 5, 0, 0)
    expect(isKnockbackActive(playerImpulse.endsAt - 1)).toBe(true)
    expect(isKnockbackActive(playerImpulse.endsAt + 1)).toBe(false)
  })
})
