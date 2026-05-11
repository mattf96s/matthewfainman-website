import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  CuboidCollider,
  RigidBody,
  type IntersectionEnterPayload,
  type IntersectionExitPayload,
  type RapierRigidBody,
} from '@react-three/rapier'

import { triggerCameraShake } from '../cameraState'
import { useGameStore } from '../../state/useGameStore'

interface BikeProps {
  /** X-axis position (typically the fietspad centre). */
  x: number
  /** Z-extent: bike travels from -extent to +extent. */
  extent: number
  /** Cruise speed, m/s. */
  speed: number
  /** Initial delay before first appearance, seconds. */
  initialDelay?: number
  /** Min/max idle between trips, seconds. */
  minIdle?: number
  maxIdle?: number
  /** Min/max speed jitter applied to each trip. */
  speedJitter?: number
}

const BIKE_BODY_HEIGHT = 1.1
const BIKE_BODY_LENGTH = 1.6

/** Half-width of the on-track hit zone — only direct frontal impact
 * on the centreline counts. */
const HIT_HALF_X = 0.06

// near-miss zone — proximity halo where a clean pass earns bonus
const NEAR_HALF_X = 1.2
const NEAR_HALF_Y = 1.2
const NEAR_HALF_Z = 1.4

/** Y at which the bike is hidden when idle between trips. */
const PARKED_Y = -50

/**
 * A single cyclist that does trips along the fietspad with random
 * idle periods between them. Each idle picks a fresh direction and
 * a fresh speed within `speedJitter`, so a bunch of these together
 * produce naturally sporadic traffic with gaps and bursts.
 */
export function Bike({
  x,
  extent,
  speed,
  initialDelay = 0,
  minIdle = 4,
  maxIdle = 14,
  speedJitter = 1.5,
}: BikeProps) {
  const body = useRef<RapierRigidBody>(null)
  const z = useRef(0)
  const direction = useRef<1 | -1>(1)
  const tripSpeed = useRef(speed)
  const idleUntil = useRef(performance.now() + initialDelay * 1000)
  const active = useRef(false)

  const cooldown = useRef(0)
  const wasHitWhileNear = useRef(false)
  const playerInside = useRef(false)
  const loseLife = useGameStore((s) => s.loseLife)
  const addNearMiss = useGameStore((s) => s.addNearMiss)

  const startNewTrip = () => {
    direction.current = Math.random() < 0.5 ? 1 : -1
    z.current = direction.current === 1 ? -extent : extent
    tripSpeed.current =
      speed + (Math.random() * 2 - 1) * speedJitter
    active.current = true
  }

  const parkAndIdle = () => {
    active.current = false
    const idleMs = (minIdle + Math.random() * (maxIdle - minIdle)) * 1000
    idleUntil.current = performance.now() + idleMs
  }

  useFrame((_, delta) => {
    if (!body.current) return
    if (useGameStore.getState().gameOver) return

    const now = performance.now()

    if (!active.current) {
      // park well below ground so sensors can't catch the player
      body.current.setNextKinematicTranslation({
        x,
        y: PARKED_Y,
        z: 0,
      })
      if (now >= idleUntil.current) startNewTrip()
      return
    }

    z.current += direction.current * tripSpeed.current * delta
    const done =
      (direction.current === 1 && z.current > extent) ||
      (direction.current === -1 && z.current < -extent)

    if (done) {
      parkAndIdle()
      return
    }

    body.current.setNextKinematicTranslation({
      x,
      y: BIKE_BODY_HEIGHT / 2,
      z: z.current,
    })
  })

  const onHit = (e: IntersectionEnterPayload) => {
    if (e.other.rigidBodyObject?.name !== 'player') return
    if (!active.current) return
    if (useGameStore.getState().gameOver) return
    const now = performance.now()
    if (now - cooldown.current < 1500) return
    cooldown.current = now
    wasHitWhileNear.current = true
    triggerCameraShake(300, 0.25)
    loseLife('bike')
  }

  const onNearEnter = (e: IntersectionEnterPayload) => {
    if (e.other.rigidBodyObject?.name !== 'player') return
    if (!active.current) return
    playerInside.current = true
    wasHitWhileNear.current = false
  }

  const onNearExit = (e: IntersectionExitPayload) => {
    if (e.other.rigidBodyObject?.name !== 'player') return
    if (!playerInside.current) return
    playerInside.current = false
    if (!wasHitWhileNear.current && !useGameStore.getState().gameOver) {
      addNearMiss()
    }
    wasHitWhileNear.current = false
  }

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[x, PARKED_Y, 0]}
      enabledRotations={[false, false, false]}
    >
      <CuboidCollider
        args={[HIT_HALF_X, BIKE_BODY_HEIGHT / 2, BIKE_BODY_LENGTH / 2]}
        sensor
        onIntersectionEnter={onHit}
      />

      <CuboidCollider
        args={[NEAR_HALF_X, NEAR_HALF_Y, NEAR_HALF_Z]}
        sensor
        onIntersectionEnter={onNearEnter}
        onIntersectionExit={onNearExit}
      />

      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.5, BIKE_BODY_LENGTH * 0.7]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {[-BIKE_BODY_LENGTH / 2 + 0.25, BIKE_BODY_LENGTH / 2 - 0.25].map(
        (zOffset) => (
          <mesh
            key={zOffset}
            castShadow
            position={[0, -0.25, zOffset]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
            <meshStandardMaterial color="#222" roughness={0.7} />
          </mesh>
        ),
      )}

      <mesh castShadow position={[0, 0.4, BIKE_BODY_LENGTH / 2 - 0.25]}>
        <boxGeometry args={[0.6, 0.05, 0.05]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      <mesh castShadow position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.22, 0.55, 4, 8]} />
        <meshStandardMaterial color="#3b6e85" />
      </mesh>

      <mesh castShadow position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.18, 12, 8]} />
        <meshStandardMaterial color="#d8a37a" />
      </mesh>
    </RigidBody>
  )
}
