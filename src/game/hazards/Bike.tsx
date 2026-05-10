import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  CuboidCollider,
  RigidBody,
  type IntersectionEnterPayload,
  type RapierRigidBody,
} from '@react-three/rapier'

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
  const loseLife = useGameStore((s) => s.loseLife)
  const gameOver = useGameStore((s) => s.gameOver)

  useEffect(() => {
    z.current = startZ
  }, [startZ])

  useFrame((_, delta) => {
    if (!body.current || gameOver) return
    z.current += direction * speed * delta
    // wrap around
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
    const now = performance.now()
    if (now - cooldown.current < 1500) return
    cooldown.current = now
    loseLife('bike')
  }

  // ROTATION is "facing direction" — body z-axis aligned with travel
  // No rotation needed since the bike's long axis is Z and direction is ±Z.

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[x, BIKE_BODY_HEIGHT / 2, startZ]}
      enabledRotations={[false, false, false]}
    >
      <CuboidCollider
        args={[BIKE_BODY_WIDTH / 2, BIKE_BODY_HEIGHT / 2, BIKE_BODY_LENGTH / 2]}
        sensor
        onIntersectionEnter={onHit}
      />

      {/* frame */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.5, BIKE_BODY_LENGTH * 0.7]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* wheels (cylinders rotated 90° around Y so axis is along X) */}
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

      {/* handlebars */}
      <mesh
        castShadow
        position={[0, 0.4, BIKE_BODY_LENGTH / 2 - 0.25]}
      >
        <boxGeometry args={[0.6, 0.05, 0.05]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* rider torso */}
      <mesh castShadow position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.22, 0.55, 4, 8]} />
        <meshStandardMaterial color="#3b6e85" />
      </mesh>

      {/* rider head */}
      <mesh castShadow position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.18, 12, 8]} />
        <meshStandardMaterial color="#d8a37a" />
      </mesh>
    </RigidBody>
  )
}
