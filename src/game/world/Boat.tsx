import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'

import { CANAL_DEPTH } from './constants'

interface BoatProps {
  position: [number, number]
  rotationY?: number
  length?: number
  width?: number
  hullColor?: string
  deckColor?: string
  hasCabin?: boolean
}

/**
 * A simple long-tail canal boat — flat hull, deck, optional cabin.
 * Sits just at the water surface and bobs very slowly.
 */
export function Boat({
  position: [x, z],
  rotationY = 0,
  length = 6,
  width = 1.7,
  hullColor = '#2e2620',
  deckColor = '#8a7155',
  hasCabin = false,
}: BoatProps) {
  const group = useRef<THREE.Group>(null)
  const phase = useRef(Math.random() * Math.PI * 2)

  const waterY = -CANAL_DEPTH + 0.18

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime + phase.current
    group.current.position.y = waterY + Math.sin(t * 0.6) * 0.04
    group.current.rotation.z = Math.sin(t * 0.4) * 0.015
  })

  return (
    <group
      ref={group}
      position={[x, waterY, z]}
      rotation={[0, rotationY, 0]}
    >
      {/* hull */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[width, 0.45, length]} />
        <meshStandardMaterial color={hullColor} roughness={0.85} />
      </mesh>

      {/* deck */}
      <mesh position={[0, 0.27, 0]}>
        <boxGeometry args={[width * 0.92, 0.05, length * 0.96]} />
        <meshStandardMaterial color={deckColor} roughness={0.7} />
      </mesh>

      {/* prow taper — small wedge box at front */}
      <mesh castShadow position={[0, 0.05, length / 2 - 0.1]}>
        <boxGeometry args={[width * 0.6, 0.35, 0.5]} />
        <meshStandardMaterial color={hullColor} />
      </mesh>

      {hasCabin && (
        <mesh castShadow position={[0, 0.95, -length * 0.15]}>
          <boxGeometry args={[width * 0.85, 1.2, length * 0.5]} />
          <meshStandardMaterial color="#3a2e1f" roughness={0.7} />
        </mesh>
      )}
    </group>
  )
}
