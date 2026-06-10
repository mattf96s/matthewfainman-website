import { useCallback, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { broadcastShot } from '../multiplayer/netBridge'
import { remoteRendered, remoteSnapshots } from '../multiplayer/playroomState'
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
const MUZZLE = new THREE.Vector3()
const HIT = new THREE.Vector3()
const CAP = new THREE.Vector3()

/** Extra hit-capsule radius beyond the visual body. This is a meme toy,
 * not a competitive shooter — err well on the side of "that counted". */
const HIT_PADDING = 0.25

/**
 * CS-style shooting: ray from the camera through screen-centre. The gun
 * mesh hangs off the player's right shoulder so others see where we're
 * aiming.
 *
 * Two input paths share one `fire()`:
 *   - Desktop: left mouse, but only once pointer-locked.
 *   - Mobile: the on-screen FIRE button (held → auto-repeat).
 *
 * We pick the closest remote player whose full-body capsule the ray
 * intersects within GUN_RANGE — tested against the *rendered* avatar
 * (which lerps behind the network snapshot), because players aim at what
 * they see. No environment hits (cheaper; avoids tracers "landing"
 * mid-wall).
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

    // Find the closest remote-player hit. The snapshot y is the capsule
    // centre, so the test capsule spans the whole avatar — head to feet.
    let bestId: string | null = null
    let bestT = Infinity
    const hitRadius = PLAYER_RADIUS + HIT_PADDING
    for (const [id, snap] of remoteSnapshots) {
      if (snap.dead) continue
      const pose = remoteRendered.get(id) ?? snap
      const t = rayCapsuleT(
        ORIGIN,
        FORWARD,
        pose.x,
        pose.y,
        pose.z,
        PLAYER_HEIGHT / 2,
        hitRadius,
      )
      if (t !== null && t < bestT && t <= GUN_RANGE) {
        bestT = t
        bestId = id
      }
    }

    // Endpoint: hit point if we hit someone, else GUN_RANGE down the ray.
    const dist = bestId ? bestT : GUN_RANGE
    HIT.copy(FORWARD).multiplyScalar(dist).add(ORIGIN)

    // Visual tracer starts at the gun muzzle (right shoulder, nudged forward),
    // NOT the eye. Emitting from the eye put the muzzle flash inside the player
    // capsule and the beam dead-on the view axis — so both were invisible to
    // the shooter. The endpoint stays the crosshair hit point, so aim and hit
    // detection are unchanged; only where the streak is drawn from moves.
    const yaw = cameraState.yaw
    const sx = 0.32 * Math.cos(yaw) + (PLAYER_RADIUS + 0.05) * -Math.sin(yaw)
    const sz = 0.32 * -Math.sin(yaw) + (PLAYER_RADIUS + 0.05) * -Math.cos(yaw)
    MUZZLE.set(
      playerPosition.x + sx + FORWARD.x * 0.4,
      playerPosition.y + 0.55 + FORWARD.y * 0.4,
      playerPosition.z + sz + FORWARD.z * 0.4,
    )

    // Broadcast to the network + local Tracers.
    broadcastShot(MUZZLE.x, MUZZLE.y, MUZZLE.z, HIT.x, HIT.y, HIT.z, bestId, GUN_DAMAGE)

    // Feedback: kick + shot sound; brighter "ding" + hitmarker on a tag.
    triggerCameraShake(90, 0.08)
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
 * Returns the t along (origin + t*dir) where the ray first enters an
 * upright capsule — vertical segment cy±halfSeg at (cx, cz), radius `r` —
 * or null if it misses. `dir` must be unit length.
 *
 * A capsule's surface is the side of a cylinder plus two cap spheres, so
 * testing cylinder entry (with the entry height clamped to the segment)
 * plus both caps covers every way in.
 */
function rayCapsuleT(
  origin: THREE.Vector3,
  dir: THREE.Vector3,
  cx: number,
  cy: number,
  cz: number,
  halfSeg: number,
  r: number,
): number | null {
  // Side wall: the ray-circle problem on the XZ plane.
  const a = dir.x * dir.x + dir.z * dir.z
  if (a > 1e-8) {
    const ox = origin.x - cx
    const oz = origin.z - cz
    const b = ox * dir.x + oz * dir.z
    const c = ox * ox + oz * oz - r * r
    const disc = b * b - a * c
    if (disc >= 0) {
      const t = (-b - Math.sqrt(disc)) / a
      if (t >= 0) {
        const y = origin.y + dir.y * t
        if (y >= cy - halfSeg && y <= cy + halfSeg) return t
      }
    }
  }
  // Cap spheres (also handles near-vertical rays, where a ≈ 0).
  CAP.set(cx, cy + halfSeg, cz)
  const tTop = raySphereT(origin, dir, CAP, r)
  CAP.set(cx, cy - halfSeg, cz)
  const tBot = raySphereT(origin, dir, CAP, r)
  if (tTop !== null && tBot !== null) return Math.min(tTop, tBot)
  return tTop ?? tBot
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
