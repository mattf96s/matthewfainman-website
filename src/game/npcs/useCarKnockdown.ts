import { useRef } from 'react'
import {
  type IntersectionEnterPayload,
  type RapierRigidBody,
} from '@react-three/rapier'

/** A downed pedestrian lies face-down on the pavement. */
export const KNOCKDOWN_ROTATION_X = -Math.PI / 2
export const KNOCKDOWN_Y = 0.25
/** Sensor-box half-height; the collider sits at this Y so it spans the body. */
export const KNOCKDOWN_HALF_Y = 0.85

/**
 * Pedestrian-vs-car knockdown state, shared by ambient NPCs (tourists,
 * the statiegeld collector). Unlike player hazards — which use manual AABB
 * checks because kinematic-character-vs-sensor events are unreliable —
 * this is NPC-vs-car, so Rapier's intersection event fires fine.
 *
 * Wire `onHit` onto the NPC's sensor collider and `sensorBody` onto its
 * kinematic RigidBody; read `hit.current` each frame to flip to the
 * collapsed pose (`KNOCKDOWN_ROTATION_X` / `KNOCKDOWN_Y`).
 */
export function useCarKnockdown() {
  const hit = useRef(false)
  const sensorBody = useRef<RapierRigidBody>(null)
  const onHit = (e: IntersectionEnterPayload) => {
    if (hit.current) return
    if (e.other.rigidBodyObject?.name === 'car') hit.current = true
  }
  return { hit, sensorBody, onHit }
}
