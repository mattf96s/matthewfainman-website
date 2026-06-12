import { useCallback, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { broadcastMelee } from '../multiplayer/netBridge'
import {
  isSnapshotStale,
  remoteRendered,
  remoteSnapshots,
} from '../multiplayer/playroomState'
import {
  SWING_INTERVAL_MS,
  SWORD_COS_HALF_ARC,
  SWORD_DAMAGE,
  SWORD_RANGE,
} from '../multiplayer/shots'
import { isInMeleeArc } from '../lib/melee'
import * as sfx from '../lib/sfx'
import { emitHit } from '../ui/hitmarker'
import { useGameStore } from '../state/useGameStore'
import { cameraState, triggerCameraShake } from './cameraState'
import { PLAYER_RADIUS } from './constants'
import { mobileInput } from './mobileInput'
import { playerPosition } from './playerPosition'
import { SwordModel } from './SwordModel'

/** Targets more than this far above/below the player are out of swing
 * reach — generous on purpose, it only rules out someone on a bridge. */
const MELEE_Y_TOLERANCE = 2

/* Swing animation — an overhead vertical chop, not a stab. Pitch is
 * rotation about the local X axis: negative = blade raised, positive =
 * buried down-forward. The windup throws the blade up past vertical,
 * the chop accelerates it through ~160°, and the remainder of the swing
 * cooldown eases back to a slightly-raised idle. */
const SWING_ANIM_MS = 280
/** Fraction of the animation spent raising the blade overhead. */
const WINDUP_END = 0.25
const IDLE_PITCH = -0.35
const WINDUP_PITCH = -2.0
const FOLLOW_PITCH = 0.85
/** How far the whole sword lifts (m) at the top of the windup. */
const SWING_LIFT = 0.15

/**
 * Close-combat counterpart to the Gun, active while the store says
 * `weapon === 'sword'`. Shares the Gun's two input paths (pointer-locked
 * left mouse on desktop, the held FIRE button on mobile) but instead of
 * a hitscan ray it sweeps a frontal arc around the player and lands a
 * hit on EVERY remote player inside it — a crowd of friends bunched on
 * a bridge is exactly the moment a sword should shine.
 *
 * The swing is judged from the player's facing (camera yaw) on the XZ
 * plane, against the *rendered* avatar poses — players swing at what
 * they see, same rule as the gun's raycast.
 */
export function Sword() {
  const swordMesh = useRef<THREE.Group>(null)
  const lastSwing = useRef(0)
  /** When the current swing animation started; drives the chop pose. */
  const swingStartedAt = useRef(-Infinity)

  // Shared swing logic for both input paths. Respects the swing
  // cooldown, so holding the mobile FIRE button auto-repeats.
  const swing = useCallback(() => {
    const store = useGameStore.getState()
    if (store.weapon !== 'sword') return
    if (!store.started || store.paused || store.health <= 0) return
    if (!playerPosition.ready) return

    const now = performance.now()
    if (now - lastSwing.current < SWING_INTERVAL_MS) return
    lastSwing.current = now
    swingStartedAt.current = now

    // Facing on the XZ plane from camera yaw — melee deliberately
    // ignores pitch, you can't whiff a swing by looking at the ground.
    const yaw = cameraState.yaw
    const fx = -Math.sin(yaw)
    const fz = -Math.cos(yaw)
    // reach is measured centre-to-centre, so pad by the target capsule
    const range = SWORD_RANGE + PLAYER_RADIUS

    let landed = false
    for (const [id, snap] of remoteSnapshots) {
      // stale = their tab is backgrounded; the avatar is hidden, so it
      // must not be sliceable either
      if (snap.dead || isSnapshotStale(snap, now)) continue
      const pose = remoteRendered.get(id) ?? snap
      if (Math.abs(pose.y - playerPosition.y) > MELEE_Y_TOLERANCE) continue
      const hit = isInMeleeArc(
        pose.x - playerPosition.x,
        pose.z - playerPosition.z,
        fx,
        fz,
        range,
        SWORD_COS_HALF_ARC,
      )
      if (hit) {
        landed = true
        broadcastMelee(id, SWORD_DAMAGE)
      }
    }

    // Feedback: whoosh on every swing; thunk + hitmarker when it lands.
    sfx.play('swing')
    triggerCameraShake(70, 0.05)
    if (landed) {
      sfx.play('hitConfirm')
      emitHit()
    }
  }, [])

  // Desktop: left mouse swings, but only once pointer-locked (the click
  // that grabs the lock is consumed for locking, not for a swing).
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      if (!document.pointerLockElement) return
      swing()
    }
    window.addEventListener('mousedown', onMouseDown)
    return () => window.removeEventListener('mousedown', onMouseDown)
  }, [swing])

  // Position the sword on the local player's shoulder (same anchor as
  // the gun) and play the chop animation after each swing.
  useFrame(() => {
    // Mobile: auto-repeat while the on-screen FIRE button is held.
    if (mobileInput.firePressed) swing()

    const g = swordMesh.current
    if (!g) return

    if (!playerPosition.ready) {
      g.visible = false
      return
    }
    const store = useGameStore.getState()
    g.visible = store.health > 0 && store.weapon === 'sword'
    if (!g.visible) return

    const yaw = cameraState.yaw
    const sin = Math.sin(yaw)
    const cos = Math.cos(yaw)

    // Local space offset (right shoulder, slightly forward) rotated by yaw.
    const rx = 0.32
    const fz = PLAYER_RADIUS + 0.05
    const ox = rx * cos + fz * -sin
    const oz = rx * -sin + fz * -cos

    g.rotation.y = yaw + Math.PI

    // Overhead chop: ease the blade up past vertical, accelerate it
    // down through the arc, then recover to idle across the rest of the
    // swing cooldown. The grip also lifts during the windup so the
    // whole sword visibly rises before the strike.
    const sinceSwing = performance.now() - swingStartedAt.current
    let lift = 0
    if (sinceSwing < SWING_ANIM_MS) {
      const p = sinceSwing / SWING_ANIM_MS
      if (p < WINDUP_END) {
        const w = p / WINDUP_END
        // ease-out raise — fast off idle, settling at the top
        g.rotation.x = IDLE_PITCH + (WINDUP_PITCH - IDLE_PITCH) * w * (2 - w)
        lift = SWING_LIFT * w
      } else {
        const s = (p - WINDUP_END) / (1 - WINDUP_END)
        // ease-in chop — the blade accelerates as it falls
        g.rotation.x = WINDUP_PITCH + (FOLLOW_PITCH - WINDUP_PITCH) * s * s
        lift = SWING_LIFT * (1 - s)
      }
    } else if (sinceSwing < SWING_INTERVAL_MS) {
      const r = (sinceSwing - SWING_ANIM_MS) / (SWING_INTERVAL_MS - SWING_ANIM_MS)
      g.rotation.x = FOLLOW_PITCH + (IDLE_PITCH - FOLLOW_PITCH) * r
    } else {
      g.rotation.x = IDLE_PITCH
    }

    g.position.set(
      playerPosition.x + ox,
      playerPosition.y + 0.55 + lift,
      playerPosition.z + oz,
    )
  })

  return (
    <group ref={swordMesh} visible={false}>
      <SwordModel />
    </group>
  )
}
