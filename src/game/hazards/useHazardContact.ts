import { useRef } from 'react'

import { PLAYER_RADIUS } from '../constants'
import { useGameStore } from '../../state/useGameStore'

/** Once a hit lands, the hazard can't hit again for this long. */
const HIT_COOLDOWN_MS = 1500

interface HazardContactOptions {
  /** Half-extents of the on-impact hit box (player radius added inside). */
  hitHalfX: number
  hitHalfZ: number
  /** Half-extents of the wider near-miss halo. Omit for hazards (cars)
   * that award no near-miss bonus. */
  nearHalfX?: number
  nearHalfZ?: number
  /** Near-misses awarded on a clean pass (trams count double). Default 1. */
  nearMissValue?: number
  /** Fired once per entry into the hit box: shake / knockback / damage.
   * Tuning differs per hazard, so it lives at the call site. */
  onHit: () => void
}

/**
 * Shared hazard-vs-player contact logic, identical across bikes, cars and
 * both trams: a once-per-entry hit gate (with cooldown) plus a near-miss
 * enter/exit edge detector. Hazards differ only in their box sizes and
 * what `onHit` does — the gating and near-miss bookkeeping are the same,
 * so they live here.
 *
 * `update` is called each frame with the player's offset from the hazard
 * centre (`absX`/`absZ` already absolute — axis-aligned for straight
 * hazards, or rotated into the hazard's local frame for oriented ones
 * like PathTram). `reset` clears the contact state without awarding a
 * near-miss — for when a hazard despawns mid-pass (e.g. a bike parking).
 */
export function useHazardContact({
  hitHalfX,
  hitHalfZ,
  nearHalfX,
  nearHalfZ,
  nearMissValue = 1,
  onHit,
}: HazardContactOptions) {
  const cooldown = useRef(0)
  const hitInside = useRef(false)
  const playerInside = useRef(false)
  const wasHit = useRef(false)
  const addNearMiss = useGameStore((s) => s.addNearMiss)

  const update = (absX: number, absZ: number, now: number) => {
    const inHit =
      absX < hitHalfX + PLAYER_RADIUS && absZ < hitHalfZ + PLAYER_RADIUS
    if (inHit) {
      if (!hitInside.current && now - cooldown.current >= HIT_COOLDOWN_MS) {
        hitInside.current = true
        cooldown.current = now
        wasHit.current = true
        onHit()
      }
    } else {
      hitInside.current = false
    }

    if (nearHalfX === undefined || nearHalfZ === undefined) return

    const inNear =
      absX < nearHalfX + PLAYER_RADIUS && absZ < nearHalfZ + PLAYER_RADIUS
    if (inNear && !playerInside.current) {
      playerInside.current = true
      wasHit.current = false
    } else if (!inNear && playerInside.current) {
      playerInside.current = false
      if (!wasHit.current) {
        for (let i = 0; i < nearMissValue; i++) addNearMiss()
      }
      wasHit.current = false
    }
  }

  const reset = () => {
    hitInside.current = false
    playerInside.current = false
  }

  return { update, reset }
}
