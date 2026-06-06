import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, type RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

import { triggerCameraShake } from '../cameraState'
import { PLAYER_RADIUS } from '../constants'
import { triggerKnockback } from '../playerImpulse'
import { playerPosition } from '../playerPosition'
import { useGameStore } from '../../state/useGameStore'
import { TramBody } from './TramBody'

export interface PathSegment {
  /** "straight" — line from (x1,z1) to (x2,z2). */
  kind: 'straight'
  x1: number
  z1: number
  x2: number
  z2: number
}

export interface ArcSegment {
  /** Quarter-circle (or partial) arc, centred at (cx,cz). Angles in
   * radians, measured CCW from +X axis. */
  kind: 'arc'
  cx: number
  cz: number
  radius: number
  startAngle: number
  endAngle: number
}

export type TramPath = (PathSegment | ArcSegment)[]

interface PathTramProps {
  path: TramPath
  speed?: number
  /** End-of-path dwell, seconds. */
  endDwell?: number
  /** Initial offset along path, metres (lets two trams stagger). */
  startOffset?: number
  /** 1 forward, -1 reverse along the path. */
  startDirection?: 1 | -1
}

const TRAM_LENGTH = 14
const TRAM_WIDTH = 2.4
const TRAM_HEIGHT = 3.0
const HIT_HALF_LATERAL = 0.18
const NEAR_HALF_LATERAL = TRAM_WIDTH / 2 + 1.2
const NEAR_HALF_LONG = TRAM_LENGTH / 2 + 1.5

function segmentLength(seg: PathSegment | ArcSegment): number {
  if (seg.kind === 'straight') {
    return Math.hypot(seg.x2 - seg.x1, seg.z2 - seg.z1)
  }
  return Math.abs(seg.endAngle - seg.startAngle) * seg.radius
}

function totalPathLength(path: TramPath): number {
  return path.reduce((acc, seg) => acc + segmentLength(seg), 0)
}

interface PathPose {
  x: number
  z: number
  /** Yaw in radians — direction the tram is facing. */
  yaw: number
}

function sampleAt(path: TramPath, d: number): PathPose {
  let remaining = d
  for (const seg of path) {
    const len = segmentLength(seg)
    if (remaining > len) {
      remaining -= len
      continue
    }
    const t = len === 0 ? 0 : remaining / len
    if (seg.kind === 'straight') {
      const dx = seg.x2 - seg.x1
      const dz = seg.z2 - seg.z1
      // yaw = direction tram is facing (its long axis along motion).
      // atan2(dx, dz) puts yaw=0 → facing +Z, yaw=π/2 → facing +X.
      return {
        x: seg.x1 + dx * t,
        z: seg.z1 + dz * t,
        yaw: Math.atan2(dx, dz),
      }
    }
    const angle = seg.startAngle + (seg.endAngle - seg.startAngle) * t
    const x = seg.cx + seg.radius * Math.cos(angle)
    const z = seg.cz + seg.radius * Math.sin(angle)
    // tangent at this angle, oriented along travel direction
    const goingForward = seg.endAngle > seg.startAngle
    const tx = -Math.sin(angle) * (goingForward ? 1 : -1)
    const tz = Math.cos(angle) * (goingForward ? 1 : -1)
    return {
      x,
      z,
      yaw: Math.atan2(tx, tz),
    }
  }
  // beyond the end — clamp to last point
  const last = path[path.length - 1]!
  if (last.kind === 'straight') {
    return { x: last.x2, z: last.z2, yaw: Math.atan2(last.x2 - last.x1, last.z2 - last.z1) }
  }
  const a = last.endAngle
  const goingForward = last.endAngle > last.startAngle
  const x = last.cx + last.radius * Math.cos(a)
  const z = last.cz + last.radius * Math.sin(a)
  const tx = -Math.sin(a) * (goingForward ? 1 : -1)
  const tz = Math.cos(a) * (goingForward ? 1 : -1)
  return { x, z, yaw: Math.atan2(tx, tz) }
}

/**
 * A tram that follows an arbitrary path of straight + arc segments,
 * bouncing back and forth with a dwell at each end. Body rotates to
 * face direction of travel; on arc segments it sweeps smoothly.
 */
export function PathTram({
  path,
  speed = 8,
  endDwell = 10,
  startOffset = 0,
  startDirection = 1,
}: PathTramProps) {
  const body = useRef<RapierRigidBody>(null)
  const u = useRef(startOffset)
  const direction = useRef<1 | -1>(startDirection)
  const dwellRemaining = useRef(0)
  const playerInside = useRef(false)
  const wasHit = useRef(false)
  /** True while the player overlaps the hit box — gates damage to once
   * per entry, with a cooldown, instead of every frame. */
  const hitInside = useRef(false)
  const cooldown = useRef(0)

  const takeDamage = useGameStore((s) => s.takeDamage)
  const addNearMiss = useGameStore((s) => s.addNearMiss)

  const total = totalPathLength(path)
  const quat = useRef(new THREE.Quaternion())

  useFrame((_, delta) => {
    if (!body.current) return

    if (dwellRemaining.current > 0) {
      dwellRemaining.current -= delta
    } else {
      u.current += direction.current * speed * delta
      if (u.current >= total) {
        u.current = total
        direction.current = -1
        dwellRemaining.current = endDwell
      } else if (u.current <= 0) {
        u.current = 0
        direction.current = 1
        dwellRemaining.current = endDwell
      }
    }

    const pose = sampleAt(path, u.current)
    // reverse facing when going backward so the tram's nose points the
    // right way
    const facingYaw = direction.current === 1 ? pose.yaw : pose.yaw + Math.PI
    quat.current.setFromEuler(new THREE.Euler(0, facingYaw, 0))

    body.current.setNextKinematicTranslation({
      x: pose.x,
      y: TRAM_HEIGHT / 2,
      z: pose.z,
    })
    body.current.setNextKinematicRotation(quat.current)

    if (!playerPosition.ready) return

    // Player position transformed into the tram's local frame so we can
    // do an axis-aligned overlap check against the tram's hit / near
    // boxes (which are oriented along the tram's long axis).
    const dx = playerPosition.x - pose.x
    const dz = playerPosition.z - pose.z
    const cy = Math.cos(facingYaw)
    const sy = Math.sin(facingYaw)
    const localX = dx * cy - dz * sy
    const localZ = dx * sy + dz * cy
    const absX = Math.abs(localX)
    const absZ = Math.abs(localZ)

    const inHit =
      absX < HIT_HALF_LATERAL + PLAYER_RADIUS &&
      absZ < TRAM_LENGTH / 2 + PLAYER_RADIUS
    const now = performance.now()
    if (inHit) {
      if (!hitInside.current && now - cooldown.current >= 1500) {
        hitInside.current = true
        cooldown.current = now
        wasHit.current = true
        triggerCameraShake(800, 0.7)
        // shove the player off the tracks, away from the tram centre
        const pushLen = Math.hypot(dx, dz) || 1
        triggerKnockback(1000, (dx / pushLen) * 22, 7, (dz / pushLen) * 22)
        takeDamage(80, 'tram')
      }
    } else {
      hitInside.current = false
    }

    const inNear =
      absX < NEAR_HALF_LATERAL + PLAYER_RADIUS &&
      absZ < NEAR_HALF_LONG + PLAYER_RADIUS
    if (inNear && !playerInside.current) {
      playerInside.current = true
      wasHit.current = false
    } else if (!inNear && playerInside.current) {
      playerInside.current = false
      if (!wasHit.current) {
        addNearMiss()
        addNearMiss()
      }
      wasHit.current = false
    }
  })

  const startPose = sampleAt(path, startOffset)

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[startPose.x, TRAM_HEIGHT / 2, startPose.z]}
    >
      <TramBody
        length={TRAM_LENGTH}
        width={TRAM_WIDTH}
        height={TRAM_HEIGHT}
      />
    </RigidBody>
  )
}
