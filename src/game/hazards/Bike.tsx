import { useEffect, useRef } from 'react'
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
  /** Initial position along Z (-Z = south end). */
  startZ: number
  /** Z extent — bike loops from -extent to +extent and wraps. */
  extent: number
  /** Metres per second. */
  speed: number
  /** Direction: 1 = north-bound (+Z), -1 = south-bound. */
  direction?: 1 | -1
}

const BIKE_BODY_HEIGHT = 1.1
const BIKE_BODY_LENGTH = 1.6
const BIKE_BODY_WIDTH = 0.5

// near-miss zone — proximity halo where a clean pass earns bonus
const NEAR_HALF_X = 1.2
const NEAR_HALF_Y = 1.2
const NEAR_HALF_Z = 1.4

export function Bike({
  x,
  startZ,
  extent,
  speed,
  direction = 1,
}: BikeProps) {
  const body = useRef<RapierRigidBody>(null)
  const z = useRef(startZ)
  const cooldown = useRef(0)
  const wasHitWhileNear = useRef(false)
  const playerInside = useRef(false)
  const loseLife = useGameStore((s) => s.loseLife)
  const addNearMiss = useGameStore((s) => s.addNearMiss)

  useEffect(() => {
    z.current = startZ
  }, [startZ])

  useFrame((_, delta) => {
    if (!body.current) return
    if (useGameStore.getState().gameOver) return
    z.current += direction * speed * delta
    const span = extent * 2
    if (z.current > extent) z.current -= span
    else if (z.current < -extent) z.current += span

    body.current.setNextKinematicTranslation({
      x,
      y: BIKE_BODY_HEIGHT / 2,
      z: z.current,
    })
  })

  const onHit = (e: IntersectionEnterPayload) => {
    if (e.other.rigidBodyObject?.name !== 'player') return
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
      position={[x, BIKE_BODY_HEIGHT / 2, startZ]}
      enabledRotations={[false, false, false]}
    >
      {/* hit zone — tight body collider */}
      <CuboidCollider
        args={[BIKE_BODY_WIDTH / 2, BIKE_BODY_HEIGHT / 2, BIKE_BODY_LENGTH / 2]}
        sensor
        onIntersectionEnter={onHit}
      />

      {/* near-miss halo */}
      <CuboidCollider
        args={[NEAR_HALF_X, NEAR_HALF_Y, NEAR_HALF_Z]}
        sensor
        onIntersectionEnter={onNearEnter}
        onIntersectionExit={onNearExit}
      />

      {/* frame */}
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

      <mesh
        castShadow
        position={[0, 0.4, BIKE_BODY_LENGTH / 2 - 0.25]}
      >
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
