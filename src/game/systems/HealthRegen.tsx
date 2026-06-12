import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import { regenTick } from '../../lib/healthRegen'
import { MAX_HEALTH, useGameStore } from '../../state/useGameStore'

/** rAF deltas balloon when the tab regains focus; clamp so a single
 * frame never regenerates more than a quarter-second's worth. */
const MAX_DELTA_S = 0.25

/**
 * Passive recovery: after REGEN_DELAY_S without taking damage, health
 * trickles back at REGEN_RATE_PER_S (math in src/lib/healthRegen.ts).
 * Panado pickups stay relevant as the instant top-up.
 *
 * Fractional regen accumulates in a ref and only whole hit-points are
 * flushed to the store — same pattern as CanalWater's drowning damage,
 * so the store (and the React HUD) sees at most a couple of updates per
 * second, never one per frame.
 */
export function HealthRegen() {
  const accumulator = useRef(0)
  const lastDamageAt = useRef(0)
  const prevHealth = useRef(MAX_HEALTH)

  useFrame((_, delta) => {
    const store = useGameStore.getState()
    const now = performance.now()

    // A drop in health = damage (heals only ever raise it): restart the
    // regen delay and throw away any partial point in flight.
    if (store.health < prevHealth.current) {
      lastDamageAt.current = now
      accumulator.current = 0
    }
    prevHealth.current = store.health

    if (!store.started || store.paused || store.health <= 0) return

    const sinceDamageS = (now - lastDamageAt.current) / 1000
    accumulator.current += regenTick(
      store.health,
      MAX_HEALTH,
      sinceDamageS,
      Math.min(delta, MAX_DELTA_S),
    )

    if (accumulator.current >= 1) {
      const whole = Math.floor(accumulator.current)
      accumulator.current -= whole
      // heals only ever raise health, so this can't trip next frame's
      // damage check — prevHealth catches up on the next read
      store.heal(whole, 'regen')
    }
  })

  return null
}
