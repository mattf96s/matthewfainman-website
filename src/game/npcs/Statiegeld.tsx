import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'

import { BIN_POSITIONS } from '../world/Bins'

interface Waypoint {
  x: number
  z: number
}

/** Stops at each bin in turn — driven from the same source of truth
 * as the bin placements themselves. Offsets a touch on the X axis so
 * the collector stands beside the bin, not inside it. */
const STAND_OFFSET = 0.8
const WAYPOINTS: Waypoint[] = BIN_POSITIONS.map(([x, z], i) => ({
  // alternate which side of the bin the collector approaches from
  x: x + (i % 2 === 0 ? -STAND_OFFSET : STAND_OFFSET),
  z,
}))

const WALK_SPEED = 0.6
const PAUSE_MIN = 4
const PAUSE_MAX = 9
const HEAD_SCAN_RANGE = 0.35 // radians the head pans while paused

/**
 * A statiegeld collector — a hunched figure with a large dark bag,
 * walking slowly between bike-rack clusters, pausing at each to
 * "check" for empty bottles.
 */
export function Statiegeld() {
  const group = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const pos = useRef({ x: WAYPOINTS[0]!.x, z: WAYPOINTS[0]!.z })
  const targetIdx = useRef(1)
  const pauseUntil = useRef(0)

  useFrame((state, delta) => {
    if (!group.current) return
    const now = performance.now()
    const target = WAYPOINTS[targetIdx.current]!

    if (now < pauseUntil.current) {
      // pause and pan the head left/right
      if (head.current) {
        head.current.rotation.y =
          Math.sin(state.clock.elapsedTime * 0.8) * HEAD_SCAN_RANGE
      }
    } else {
      const dx = target.x - pos.current.x
      const dz = target.z - pos.current.z
      const dist = Math.hypot(dx, dz)
      if (dist < 0.2) {
        // arrived — pause to "search"
        pauseUntil.current =
          now + (PAUSE_MIN + Math.random() * (PAUSE_MAX - PAUSE_MIN)) * 1000
        targetIdx.current = (targetIdx.current + 1) % WAYPOINTS.length
      } else {
        const step = WALK_SPEED * delta
        pos.current.x += (dx / dist) * step
        pos.current.z += (dz / dist) * step
        group.current.rotation.y = Math.atan2(dx, dz)
        if (head.current) head.current.rotation.y = 0
      }
    }

    group.current.position.x = pos.current.x
    group.current.position.z = pos.current.z
    // slight up-and-down bob while walking, stillness while paused
    const moving = now >= pauseUntil.current
    group.current.position.y = moving
      ? Math.abs(Math.sin(state.clock.elapsedTime * 6)) * 0.04
      : 0
  })

  return (
    <group ref={group}>
      {/* trousers */}
      <mesh castShadow position={[0, 0.45, 0]}>
        <capsuleGeometry args={[0.22, 0.5, 4, 8]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.85} />
      </mesh>

      {/* coat — slightly stooped (rotated forward) */}
      <group position={[0, 1.0, 0.1]} rotation={[0.18, 0, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.27, 0.5, 4, 8]} />
          <meshStandardMaterial color="#3a3328" roughness={0.9} />
        </mesh>
      </group>

      {/* head */}
      <group ref={head} position={[0, 1.55, 0.18]}>
        <mesh castShadow>
          <sphereGeometry args={[0.2, 12, 10]} />
          <meshStandardMaterial color="#b9876a" roughness={0.75} />
        </mesh>
        {/* beanie */}
        <mesh castShadow position={[0, 0.12, -0.02]}>
          <cylinderGeometry args={[0.21, 0.21, 0.18, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      </group>

      {/* black bin-bag — slung over shoulder */}
      <mesh castShadow position={[0.34, 1.0, -0.05]} rotation={[0, 0, 0.2]}>
        <sphereGeometry args={[0.32, 12, 10]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
      </mesh>

      {/* shopping-bag handle hint */}
      <mesh position={[0.35, 1.35, -0.05]}>
        <torusGeometry args={[0.1, 0.015, 6, 16]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
    </group>
  )
}
