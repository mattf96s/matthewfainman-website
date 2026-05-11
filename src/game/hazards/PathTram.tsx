import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  CuboidCollider,
  RigidBody,
  type IntersectionEnterPayload,
  type IntersectionExitPayload,
  type RapierRigidBody,
} from '@react-three/rapier'
import * as THREE from 'three'

import { triggerCameraShake } from '../cameraState'
import { useGameStore } from '../../state/useGameStore'

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
const TRAM_GVB_BLUE = '#0066b3'

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

  const endGame = useGameStore((s) => s.endGame)
  const addNearMiss = useGameStore((s) => s.addNearMiss)

  const total = totalPathLength(path)
  const quat = useRef(new THREE.Quaternion())

  useFrame((_, delta) => {
    if (!body.current) return
    if (useGameStore.getState().gameOver) return

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
  })

  const onHit = (e: IntersectionEnterPayload) => {
    if (e.other.rigidBodyObject?.name !== 'player') return
    wasHit.current = true
    triggerCameraShake(800, 0.7)
    endGame('tram')
  }

  const onNearEnter = (e: IntersectionEnterPayload) => {
    if (e.other.rigidBodyObject?.name !== 'player') return
    playerInside.current = true
    wasHit.current = false
  }

  const onNearExit = (e: IntersectionExitPayload) => {
    if (e.other.rigidBodyObject?.name !== 'player') return
    if (!playerInside.current) return
    playerInside.current = false
    if (!wasHit.current && !useGameStore.getState().gameOver) {
      addNearMiss()
      addNearMiss()
    }
    wasHit.current = false
  }

  const startPose = sampleAt(path, startOffset)

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[startPose.x, TRAM_HEIGHT / 2, startPose.z]}
    >
      <CuboidCollider
        args={[HIT_HALF_LATERAL, TRAM_HEIGHT / 2, TRAM_LENGTH / 2]}
        sensor
        onIntersectionEnter={onHit}
      />
      <CuboidCollider
        args={[TRAM_WIDTH / 2 + 1.2, TRAM_HEIGHT / 2, TRAM_LENGTH / 2 + 1.5]}
        sensor
        onIntersectionEnter={onNearEnter}
        onIntersectionExit={onNearExit}
      />

      <mesh castShadow receiveShadow>
        <boxGeometry args={[TRAM_WIDTH, TRAM_HEIGHT, TRAM_LENGTH]} />
        <meshStandardMaterial color={TRAM_GVB_BLUE} roughness={0.6} />
      </mesh>

      <PathTramWindows />

      {[-TRAM_LENGTH / 2 - 0.01, TRAM_LENGTH / 2 + 0.01].map((zEnd, i) => (
        <mesh key={zEnd} position={[0, 0.9, zEnd]}>
          <planeGeometry args={[TRAM_WIDTH * 0.7, 0.4]} />
          <meshStandardMaterial
            color={i === 0 ? '#fff4c2' : '#d63333'}
            emissive={i === 0 ? '#fff4c2' : '#d63333'}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </RigidBody>
  )
}

function PathTramWindows() {
  const winCount = 6
  const winW = (TRAM_LENGTH * 0.85) / winCount
  const winH = TRAM_HEIGHT * 0.32
  const gap =
    (TRAM_LENGTH * 0.85 - winW * winCount) / Math.max(winCount - 1, 1)
  const winsZ: number[] = []
  for (let i = 0; i < winCount; i++) {
    const start = (-TRAM_LENGTH * 0.85) / 2
    winsZ.push(start + winW / 2 + i * (winW + gap))
  }
  return (
    <group position={[0, 0.4, 0]}>
      {winsZ.map((zPos) =>
        [-1, 1].map((side) => (
          <mesh
            key={`${zPos}-${side}`}
            position={[(TRAM_WIDTH / 2 + 0.01) * side, 0, zPos]}
            rotation={[0, side > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
          >
            <planeGeometry args={[winW, winH]} />
            <meshStandardMaterial
              color="#1f3242"
              emissive="#2a4a5e"
              emissiveIntensity={0.2}
              roughness={0.2}
            />
          </mesh>
        )),
      )}
    </group>
  )
}
