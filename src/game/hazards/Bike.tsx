import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, type RapierRigidBody } from '@react-three/rapier'

import { triggerCameraShake } from '../cameraState'
import { BIKE_DAMAGE } from '../constants'
import { triggerKnockback } from '../playerImpulse'
import { playerPosition } from '../playerPosition'
import { useSporadicTrip } from '../useSporadicTrip'
import { useGameStore } from '../../state/useGameStore'
import { useHazardContact } from './useHazardContact'

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

/** Near-miss halo on the XZ plane where a clean pass earns bonus. */
const NEAR_HALF_X = 1.2
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
  const takeDamage = useGameStore((s) => s.takeDamage)
  const { trip, advance } = useSporadicTrip({
    extent,
    speed,
    speedJitter,
    initialDelay,
    minIdle,
    maxIdle,
  })

  const contact = useHazardContact({
    hitHalfX: HIT_HALF_X,
    hitHalfZ: BIKE_BODY_LENGTH / 2,
    nearHalfX: NEAR_HALF_X,
    nearHalfZ: NEAR_HALF_Z,
    onHit: () => {
      triggerCameraShake(300, 0.25)
      triggerKnockback(500, 0, 2, trip.direction * 6)
      takeDamage(BIKE_DAMAGE, 'bike')
    },
  })

  useFrame((_, delta) => {
    if (!body.current) return
    const now = performance.now()

    if (!advance(delta, now)) {
      // idle (or just finished a trip) — park well below ground
      body.current.setNextKinematicTranslation({ x, y: PARKED_Y, z: 0 })
      contact.reset()
      return
    }

    body.current.setNextKinematicTranslation({
      x,
      y: BIKE_BODY_HEIGHT / 2,
      z: trip.z,
    })

    if (!playerPosition.ready) return
    contact.update(
      Math.abs(playerPosition.x - x),
      Math.abs(playerPosition.z - trip.z),
      now,
    )
  })

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[x, PARKED_Y, 0]}
      enabledRotations={[false, false, false]}
    >
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.5, BIKE_BODY_LENGTH * 0.7]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {[-BIKE_BODY_LENGTH / 2 + 0.25, BIKE_BODY_LENGTH / 2 - 0.25].map(
        (zOffset) => (
          <mesh
            key={zOffset}
            position={[0, -0.25, zOffset]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
            <meshStandardMaterial color="#222" roughness={0.7} />
          </mesh>
        ),
      )}

      <mesh position={[0, 0.4, BIKE_BODY_LENGTH / 2 - 0.25]}>
        <boxGeometry args={[0.6, 0.05, 0.05]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      <mesh castShadow position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.22, 0.55, 4, 8]} />
        <meshStandardMaterial color="#3b6e85" />
      </mesh>

      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.18, 12, 8]} />
        <meshStandardMaterial color="#d8a37a" />
      </mesh>
    </RigidBody>
  )
}
