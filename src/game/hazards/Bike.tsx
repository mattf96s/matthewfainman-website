import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, type RapierRigidBody } from '@react-three/rapier'

import { triggerCameraShake } from '../cameraState'
import { BIKE_DAMAGE, PLAYER_RADIUS } from '../constants'
import { triggerKnockback } from '../playerImpulse'
import { playerPosition } from '../playerPosition'
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

// near-miss zone — proximity halo on the XZ plane where a clean pass
// earns bonus
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
  const z = useRef(0)
  const direction = useRef<1 | -1>(1)
  const tripSpeed = useRef(speed)
  const idleUntil = useRef(performance.now() + initialDelay * 1000)
  const active = useRef(false)

  const cooldown = useRef(0)
  const wasHitWhileNear = useRef(false)
  const playerInside = useRef(false)
  const takeDamage = useGameStore((s) => s.takeDamage)
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

  /** True while the player capsule overlaps the bike's tight hit AABB.
   * Tracking this lets us fire `takeDamage` once per entry rather than
   * every frame — essentially what onIntersectionEnter would have done. */
  const hitInside = useRef(false)

  useFrame((_, delta) => {
    if (!body.current) return

    const now = performance.now()

    if (!active.current) {
      // park well below ground so the bike geometry isn't visible
      body.current.setNextKinematicTranslation({
        x,
        y: PARKED_Y,
        z: 0,
      })
      hitInside.current = false
      if (playerInside.current) {
        // emit deferred near-miss if the player walks past while idle
        playerInside.current = false
      }
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

    if (!playerPosition.ready) return

    // Manual AABB overlap on the XZ plane between the player capsule
    // (treated as a circle of radius PLAYER_RADIUS) and the bike's hit
    // / near-miss zones. Sensor events from Rapier don't fire reliably
    // for the kinematic-character-controlled player, so this is the
    // reliable path.
    const dx = Math.abs(playerPosition.x - x)
    const dz = Math.abs(playerPosition.z - z.current)

    const inHit =
      dx < HIT_HALF_X + PLAYER_RADIUS &&
      dz < BIKE_BODY_LENGTH / 2 + PLAYER_RADIUS
    if (inHit) {
      if (!hitInside.current && now - cooldown.current >= 1500) {
        hitInside.current = true
        cooldown.current = now
        wasHitWhileNear.current = true
        triggerCameraShake(300, 0.25)
        triggerKnockback(500, 0, 2, direction.current * 6)
        takeDamage(BIKE_DAMAGE, 'bike')
      }
    } else {
      hitInside.current = false
    }

    const inNear =
      dx < NEAR_HALF_X + PLAYER_RADIUS &&
      dz < NEAR_HALF_Z + PLAYER_RADIUS
    if (inNear && !playerInside.current) {
      playerInside.current = true
      wasHitWhileNear.current = false
    } else if (!inNear && playerInside.current) {
      playerInside.current = false
      if (!wasHitWhileNear.current) addNearMiss()
      wasHitWhileNear.current = false
    }
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
