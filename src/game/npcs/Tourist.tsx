import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'

interface TouristProps {
  position: [number, number, number]
  shirt: string
  trousers?: string
  skin?: string
  hasBackpack?: boolean
  hasHat?: boolean
  /** Phase offset for the walking bob, radians. */
  phase?: number
}

/**
 * A single low-poly tourist — capsule body, sphere head, optional
 * accessories. Bobs lightly on Y to suggest walking.
 */
export function Tourist({
  position,
  shirt,
  trousers = '#262626',
  skin = '#d8a37a',
  hasBackpack = false,
  hasHat = false,
  phase = 0,
}: TouristProps) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime * 4 + phase
    group.current.position.y = position[1] + Math.abs(Math.sin(t)) * 0.06
  })

  return (
    <group ref={group} position={position}>
      {/* trousers */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.22, 0.55, 4, 8]} />
        <meshStandardMaterial color={trousers} roughness={0.8} />
      </mesh>
      {/* shirt */}
      <mesh castShadow position={[0, 1.1, 0]}>
        <capsuleGeometry args={[0.24, 0.45, 4, 8]} />
        <meshStandardMaterial color={shirt} roughness={0.85} />
      </mesh>
      {/* head */}
      <mesh castShadow position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.2, 12, 10]} />
        <meshStandardMaterial color={skin} roughness={0.7} />
      </mesh>

      {hasHat && (
        <mesh castShadow position={[0, 1.78, 0.04]}>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 12]} />
          <meshStandardMaterial color="#222" roughness={0.7} />
        </mesh>
      )}

      {hasBackpack && (
        <mesh castShadow position={[0, 1.05, -0.3]}>
          <boxGeometry args={[0.38, 0.45, 0.22]} />
          <meshStandardMaterial color="#3a2818" roughness={0.85} />
        </mesh>
      )}
    </group>
  )
}
