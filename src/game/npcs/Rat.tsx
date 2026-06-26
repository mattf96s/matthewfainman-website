import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { useSporadicTrip } from '../useSporadicTrip'

interface RatProps {
  /** X-axis position the rat scurries along. */
  x: number
  /** Z-extent: the rat runs from -extent to +extent (or reverse). */
  extent: number
  /** Cruise speed, m/s — rats are quick. */
  speed?: number
  /** Initial delay before first appearance, seconds. */
  initialDelay?: number
  /** Min/max idle between scurries, seconds. */
  minIdle?: number
  maxIdle?: number
}

/** Y at which the rat is hidden when idle between scurries. */
const PARKED_Y = -50

/**
 * A single rat that bursts out, dashes along the sidewalk, then
 * vanishes for a random idle. Cosmetic — no damage, no near-miss
 * bonus. The slight body bob and quick tail flick make it pop into
 * peripheral vision without screaming for attention.
 */
export function Rat({
  x,
  extent,
  speed = 5,
  initialDelay = 6,
  minIdle = 12,
  maxIdle = 28,
}: RatProps) {
  const group = useRef<THREE.Group>(null)
  const tail = useRef<THREE.Group>(null)
  const { trip, advance } = useSporadicTrip({
    extent,
    speed,
    speedJitter: 1.2,
    initialDelay,
    minIdle,
    maxIdle,
  })

  useFrame((state, delta) => {
    if (!group.current) return

    if (!advance(delta, performance.now())) {
      group.current.position.y = PARKED_Y
      return
    }

    group.current.position.x = x
    group.current.position.z = trip.z
    // tiny scuttle bob — rats hug the ground but their gait is jittery
    group.current.position.y =
      0.06 + Math.abs(Math.sin(state.clock.elapsedTime * 22)) * 0.025
    // face direction of travel — +Z is the rat's nose-forward
    group.current.rotation.y = trip.direction === 1 ? 0 : Math.PI
    if (tail.current) {
      tail.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 14) * 0.5
    }
  })

  return (
    <group ref={group} position={[x, PARKED_Y, 0]}>
      {/* body — too small to read in shadow */}
      <mesh position={[0, 0.06, 0]} rotation={[0, 0, 0]}>
        <capsuleGeometry args={[0.07, 0.18, 4, 8]} />
        <meshStandardMaterial color="#2a2622" roughness={0.9} />
      </mesh>
      {/* head */}
      <mesh position={[0, 0.08, 0.16]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color="#1f1d1a" roughness={0.85} />
      </mesh>
      {/* ears */}
      <mesh position={[0.045, 0.13, 0.15]}>
        <sphereGeometry args={[0.022, 6, 6]} />
        <meshStandardMaterial color="#1a1816" />
      </mesh>
      <mesh position={[-0.045, 0.13, 0.15]}>
        <sphereGeometry args={[0.022, 6, 6]} />
        <meshStandardMaterial color="#1a1816" />
      </mesh>
      {/* tail — pivoted at the base so the flick yaws cleanly */}
      <group ref={tail} position={[0, 0.06, -0.13]}>
        <mesh
          position={[0, 0, -0.11]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.012, 0.005, 0.22, 6]} />
          <meshStandardMaterial color="#c8a692" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}
