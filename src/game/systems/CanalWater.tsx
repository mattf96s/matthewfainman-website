import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import { playerPosition } from '../playerPosition'
import {
  CANAL_LENGTH,
  CANAL_WIDTH,
  X_CANAL,
} from '../world/constants'
import { useGameStore } from '../../state/useGameStore'

/** Damage per second while the player is submerged. ~10s from full
 * health to drowning at MAX_HEALTH = 100. */
const DAMAGE_PER_SECOND = 10
/** Y below which the player is considered to be in the water — the
 * canal water surface sits at -CANAL_DEPTH = -1.2, sidewalk top at 0,
 * so anything below -0.2 means they've gone over the bank. */
const SUBMERGED_Y = -0.2

/**
 * Watches the player's position each frame and applies a slow trickle
 * of drowning damage while they're in the gracht. Damage accumulates
 * fractionally and only flushes whole hit-points so we don't spam the
 * store with every-frame updates.
 */
export function CanalWater() {
  const accumulator = useRef(0)

  useFrame((_, delta) => {
    const { paused, started, health, takeDamage } = useGameStore.getState()
    if (!started || paused || health <= 0) return
    if (!playerPosition.ready) return

    const inCanalX =
      Math.abs(playerPosition.x - X_CANAL) < CANAL_WIDTH / 2
    const inCanalZ = Math.abs(playerPosition.z) < CANAL_LENGTH / 2
    const submerged =
      inCanalX && inCanalZ && playerPosition.y < SUBMERGED_Y

    if (!submerged) {
      accumulator.current = 0
      return
    }

    accumulator.current += DAMAGE_PER_SECOND * delta
    if (accumulator.current >= 1) {
      const whole = Math.floor(accumulator.current)
      accumulator.current -= whole
      takeDamage(whole, 'water')
    }
  })

  return null
}
