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
import { swingPose, SWING_STRIKE_MS } from '../lib/swing'
import { emitHit } from '../ui/hitmarker'
import { useGameStore } from '../state/useGameStore'
import { cameraState, triggerCameraShake } from './cameraState'
import { PLAYER_RADIUS } from './constants'
import { mobileInput } from './mobileInput'
import { playerPosition } from './playerPosition'
import { shoulderOffset, SHOULDER_Y } from './shoulderAnchor'
import { SwordModel } from './SwordModel'

/** Targets more than this far above/below the player are out of swing
 * reach — generous on purpose, it only rules out someone on a bridge. */
const MELEE_Y_TOLERANCE = 2

/** Reused shoulder-offset scratch to avoid per-frame allocation. */
const SHOULDER = { x: 0, z: 0 }

/**
 * Close-combat counterpart to the Gun, active while the store says
 * `weapon === 'sword'`. Shares the Gun's two input paths (pointer-locked
 * left mouse on desktop, the held FIRE button on mobile), but instead of
 * a hitscan ray it sweeps a short frontal arc right around the player and
 * lands a hit on EVERY remote player inside it — a crowd of friends
 * bunched on a bridge is exactly the moment a sword should shine.
 *
 * Reach is true hugging distance (~1.3m edge-to-edge), so the blade
 * always visibly reaches whoever it hits. The swing is judged on the XZ
 * plane from the player's facing (camera yaw, ignoring pitch — the same
 * direction the avatar's nose points), against the *rendered* avatar
 * poses, since players swing at what they see.
 */
export function Sword() {
  const swordMesh = useRef<THREE.Group>(null)
  const lastSwing = useRef(0)
  /** When the current swing animation started; drives the chop pose. */
  const swingStartedAt = useRef(-Infinity)
  /** True between starting a swing and the blade reaching the strike
   * frame, where the hit is resolved. Cleared once resolved so each
   * swing connects exactly once. */
  const hitPending = useRef(false)

  // Start a swing: arms the strike (resolved mid-animation) and plays the
  // windup whoosh. Respects the cooldown, so holding the mobile FIRE
  // button auto-repeats. The actual hit detection happens in `resolveHit`
  // at the strike frame, NOT here — that's what keeps damage in lockstep
  // with the visible blade.
  const swing = useCallback(() => {
    const store = useGameStore.getState()
    if (store.weapon !== 'sword') return
    if (!store.started || store.paused || store.health <= 0) return
    if (!playerPosition.ready) return

    const now = performance.now()
    if (now - lastSwing.current < SWING_INTERVAL_MS) return
    lastSwing.current = now
    swingStartedAt.current = now
    hitPending.current = true

    sfx.play('swing')
    triggerCameraShake(60, 0.04)
  }, [])

  // Resolve a swing at its strike frame: sweep the frontal arc and hit
  // everyone inside it. Read facing/positions HERE (not at input time) so
  // a turn during the windup redirects the blow to where it's pointing.
  const resolveHit = () => {
    hitPending.current = false
    const now = performance.now()

    // Facing on the XZ plane from camera yaw — the same direction the
    // avatar's nose points; pitch is ignored so you can't whiff by
    // looking at the ground.
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

    // thunk + hitmarker the instant the blade connects
    if (landed) {
      sfx.play('hitConfirm')
      triggerCameraShake(90, 0.07)
      emitHit()
    }
  }

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
  // the gun), play the chop, and resolve the hit as the blade lands.
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

    const sinceSwing = performance.now() - swingStartedAt.current

    // Land the blow once the blade has swept down to the strike frame.
    if (hitPending.current && sinceSwing >= SWING_STRIKE_MS) {
      resolveHit()
    }

    const yaw = cameraState.yaw
    shoulderOffset(yaw, SHOULDER)
    // Camera-forward in world space — the direction the lunge pushes the blade.
    const fwdX = -Math.sin(yaw)
    const fwdZ = -Math.cos(yaw)

    g.rotation.y = yaw + Math.PI

    const pose = swingPose(sinceSwing, SWING_INTERVAL_MS)
    g.rotation.x = pose.pitch
    g.position.set(
      playerPosition.x + SHOULDER.x + fwdX * pose.lunge,
      playerPosition.y + SHOULDER_Y + pose.lift,
      playerPosition.z + SHOULDER.z + fwdZ * pose.lunge,
    )
  })

  return (
    <group ref={swordMesh} visible={false}>
      <SwordModel />
    </group>
  )
}
