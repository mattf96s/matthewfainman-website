import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'

import { CANAL_DEPTH } from './constants'

interface DuckProps {
  position: [number, number]
  /** Drift speed along the canal axis, m/s (very slow). */
  driftZ?: number
  /** Optional Z-range to wrap within. */
  range?: number
  bodyColor?: string
  headColor?: string
  beakColor?: string
  size?: number
}

/**
 * A small floating bird — duck, coot, or swan depending on colour.
 * Drifts slowly along Z and wraps when it leaves `range`.
 */
export function Duck({
  position: [x, z],
  driftZ = 0.25,
  range = 40,
  bodyColor = '#3d2e22',
  headColor = '#1a1612',
  beakColor = '#f1a23a',
  size = 1,
}: DuckProps) {
  const group = useRef<THREE.Group>(null)
  const zPos = useRef(z)
  const phase = useRef(Math.random() * Math.PI * 2)
  const waterY = -CANAL_DEPTH + 0.16

  useFrame((state, delta) => {
    if (!group.current) return
    zPos.current += driftZ * delta
    if (zPos.current > range) zPos.current = -range
    else if (zPos.current < -range) zPos.current = range

    group.current.position.x = x + Math.sin(state.clock.elapsedTime * 0.4 + phase.current) * 0.15
    group.current.position.y =
      waterY + Math.sin(state.clock.elapsedTime * 1.2 + phase.current) * 0.025
    group.current.position.z = zPos.current
    group.current.rotation.y = driftZ > 0 ? 0 : Math.PI
  })

  return (
    <group ref={group} position={[x, waterY, z]}>
      {/* body */}
      <mesh castShadow position={[0, 0.08 * size, 0]} scale={size}>
        <capsuleGeometry args={[0.12, 0.18, 4, 8]} />
        <meshStandardMaterial color={bodyColor} roughness={0.85} />
      </mesh>
      {/* neck/head */}
      <mesh
        castShadow
        position={[0, 0.18 * size, 0.18 * size]}
        scale={size}
      >
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshStandardMaterial color={headColor} roughness={0.7} />
      </mesh>
      {/* beak */}
      <mesh
        position={[0, 0.17 * size, 0.24 * size]}
        scale={size}
      >
        <boxGeometry args={[0.04, 0.025, 0.08]} />
        <meshStandardMaterial color={beakColor} />
      </mesh>
    </group>
  )
}
