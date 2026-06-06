import { useCallback, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { broadcastShot } from '../multiplayer/netBridge'
import { remoteSnapshots } from '../multiplayer/playroomState'
import { FIRE_INTERVAL_MS, GUN_DAMAGE, GUN_RANGE } from '../multiplayer/shots'
import * as sfx from '../lib/sfx'
import { emitHit } from '../ui/hitmarker'
import { useGameStore } from '../state/useGameStore'
import { cameraState, triggerCameraShake } from './cameraState'
import { PLAYER_HEIGHT, PLAYER_RADIUS } from './constants'
import { mobileInput } from './mobileInput'
import { playerPosition } from './playerPosition'

const FORWARD = new THREE.Vector3()
const ORIGIN = new THREE.Vector3()
const HIT = new THREE.Vector3()
const REMOTE_CENTRE = new THREE.Vector3()

/**
 * CS-style shooting: ray from the camera through screen-centre. The gun
 * mesh hangs off the player's right shoulder so others see where we're
 * aiming.
 *
 * Two input paths share one `fire()`:
 *   - Desktop: left mouse, but only once pointer-locked.
 *   - Mobile: the on-screen FIRE button (held → auto-repeat).
 *
 * We pick the closest remote player whose head/torso sphere the ray
 * intersects within GUN_RANGE. No environment hits (cheaper; avoids
 * tracers "landing" mid-wall).
 */
export function Gun() {
  const { camera } = useThree()
  const gunMesh = useRef<THREE.Group>(null)
  const lastFire = useRef(0)
  /** Pulse the gun forward briefly after each shot for a kick effect. */
  const recoilUntil = useRef(0)

  // Shared firing logic. Respects the fire-rate cooldown, so holding the
  // mobile FIRE button auto-repeats. Deliberately does NOT check pointer
  // lock (mobile has none) — the desktop handler adds that gate.
  const fire = useCallback(() => {
    const store = useGameStore.getState()
    if (!store.started || store.paused || store.health <= 0) return

    const now = performance.now()
    if (now - lastFire.current < FIRE_INTERVAL_MS) return
    lastFire.current = now
    recoilUntil.current = now + 80

    // Origin: a hand's-length in front of the player, eye-height.
    ORIGIN.set(
      playerPosition.x,
      playerPosition.y + PLAYER_HEIGHT * 0.6,
      playerPosition.z,
    )

    // Forward = camera forward (matches the on-screen crosshair).
    camera.getWorldDirection(FORWARD)

    // Find the closest remote-player hit.
    let bestId: string | null = null
    let bestT = Infinity
    const hitRadius = PLAYER_RADIUS + 0.15
    for (const [id, snap] of remoteSnapshots) {
      if (snap.dead) continue
      REMOTE_CENTRE.set(snap.x, snap.y + PLAYER_HEIGHT * 0.5, snap.z)
      const t = raySphereT(ORIGIN, FORWARD, REMOTE_CENTRE, hitRadius)
      if (t !== null && t < bestT && t <= GUN_RANGE) {
        bestT = t
        bestId = id
      }
    }

    // Endpoint: hit point if we hit someone, else GUN_RANGE down the ray.
    const dist = bestId ? bestT : GUN_RANGE
    HIT.copy(FORWARD).multiplyScalar(dist).add(ORIGIN)

    // Broadcast to the network + local Tracers.
    broadcastShot(ORIGIN.x, ORIGIN.y, ORIGIN.z, HIT.x, HIT.y, HIT.z, bestId, GUN_DAMAGE)

    // Feedback: kick + shot sound; brighter "ding" + hitmarker on a tag.
    triggerCameraShake(80, 0.04)
    sfx.play('shoot')
    if (bestId) {
      sfx.play('hitConfirm')
      emitHit()
    }
  }, [camera])

  // Desktop: left mouse fires, but only once pointer-locked (the click
  // that grabs the lock is consumed for locking, not for a shot).
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      if (!document.pointerLockElement) return
      fire()
    }
    window.addEventListener('mousedown', onMouseDown)
    return () => window.removeEventListener('mousedown', onMouseDown)
  }, [fire])

  // Position the gun mesh on the local player's shoulder, aimed at the
  // camera-forward direction (= where bullets will go).
  useFrame(() => {
    // Mobile: auto-repeat while the on-screen FIRE button is held.
    if (mobileInput.firePressed) fire()

    const g = gunMesh.current
    if (!g) return

    // Hide the gun until we know where the player is OR if we're dead.
    if (!playerPosition.ready) {
      g.visible = false
      return
    }
    const hp = useGameStore.getState().health
    g.visible = hp > 0

    const yaw = cameraState.yaw
    const sin = Math.sin(yaw)
    const cos = Math.cos(yaw)

    // Local space offset (right shoulder, slightly forward) rotated by yaw.
    const rx = 0.32
    const fz = PLAYER_RADIUS + 0.05
    let ox = rx * cos + fz * -sin
    let oz = rx * -sin + fz * -cos

    // Recoil — pull the gun back briefly.
    const now = performance.now()
    if (now < recoilUntil.current) {
      const k = (recoilUntil.current - now) / 80
      ox -= -sin * 0.08 * k
      oz -= -cos * 0.08 * k
    }

    g.position.set(
      playerPosition.x + ox,
      playerPosition.y + 0.55,
      playerPosition.z + oz,
    )
    g.rotation.y = yaw + Math.PI
  })

  return (
    <group ref={gunMesh} visible={false}>
      <mesh castShadow>
        <boxGeometry args={[0.12, 0.14, 0.55]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  )
}

/**
 * Returns the t along (origin + t*dir) where the ray first enters a
 * sphere centred at `c` with radius `r`, or null if it misses. `dir`
 * must be unit length.
 */
function raySphereT(
  origin: THREE.Vector3,
  dir: THREE.Vector3,
  c: THREE.Vector3,
  r: number,
): number | null {
  const ox = origin.x - c.x
  const oy = origin.y - c.y
  const oz = origin.z - c.z
  const b = ox * dir.x + oy * dir.y + oz * dir.z
  const cc = ox * ox + oy * oy + oz * oz - r * r
  const disc = b * b - cc
  if (disc < 0) return null
  const sq = Math.sqrt(disc)
  const t1 = -b - sq
  const t2 = -b + sq
  if (t1 >= 0) return t1
  if (t2 >= 0) return t2
  return null
}
