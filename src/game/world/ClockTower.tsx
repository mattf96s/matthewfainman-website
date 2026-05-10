import { useMemo } from 'react'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'

interface ClockTowerProps {
  position: [number, number, number]
}

const BASE_W = 6
const BASE_D = 6
const BASE_H = 12

const SPIRE_H = 14
const SPIRE_RADIUS = BASE_W / 2.4

const CLOCK_FACE_RADIUS = 1.4

/**
 * A stylised church tower — square brick base, tapered spire on top,
 * clock face on the south side. Inspired loosely by the Westerkerk.
 */
export function ClockTower({ position }: ClockTowerProps) {
  const spireGeometry = useMemo(() => new THREE.ConeGeometry(SPIRE_RADIUS, SPIRE_H, 8), [])

  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CuboidCollider args={[BASE_W / 2, BASE_H / 2, BASE_D / 2]} position={[0, BASE_H / 2, 0]} />

      <mesh castShadow receiveShadow position={[0, BASE_H / 2, 0]}>
        <boxGeometry args={[BASE_W, BASE_H, BASE_D]} />
        <meshStandardMaterial color="#7e5044" roughness={0.85} />
      </mesh>

      {/* belfry — slightly smaller box above base */}
      <mesh castShadow receiveShadow position={[0, BASE_H + 1.5, 0]}>
        <boxGeometry args={[BASE_W * 0.85, 3, BASE_D * 0.85]} />
        <meshStandardMaterial color="#956259" roughness={0.7} />
      </mesh>

      {/* belfry arches as four dark plane insets on each side */}
      {[
        { rotY: 0, dx: 0, dz: BASE_D * 0.85 / 2 + 0.01 },
        { rotY: Math.PI, dx: 0, dz: -(BASE_D * 0.85 / 2 + 0.01) },
        { rotY: Math.PI / 2, dx: BASE_W * 0.85 / 2 + 0.01, dz: 0 },
        { rotY: -Math.PI / 2, dx: -(BASE_W * 0.85 / 2 + 0.01), dz: 0 },
      ].map(({ rotY, dx, dz }, i) => (
        <mesh key={i} position={[dx, BASE_H + 1.5, dz]} rotation={[0, rotY, 0]}>
          <planeGeometry args={[2.2, 2.2]} />
          <meshStandardMaterial color="#221a18" />
        </mesh>
      ))}

      {/* spire */}
      <mesh
        castShadow
        geometry={spireGeometry}
        position={[0, BASE_H + 3 + SPIRE_H / 2, 0]}
      >
        <meshStandardMaterial color="#3a525a" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* finial cross */}
      <mesh castShadow position={[0, BASE_H + 3 + SPIRE_H + 0.4, 0]}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#d8c474" emissive="#7a6320" emissiveIntensity={0.4} />
      </mesh>
      <mesh castShadow position={[0, BASE_H + 3 + SPIRE_H + 0.6, 0]}>
        <boxGeometry args={[0.45, 0.1, 0.1]} />
        <meshStandardMaterial color="#d8c474" emissive="#7a6320" emissiveIntensity={0.4} />
      </mesh>

      {/* clock face on the south side */}
      <mesh position={[0, BASE_H * 0.65, BASE_D / 2 + 0.02]}>
        <circleGeometry args={[CLOCK_FACE_RADIUS, 24]} />
        <meshStandardMaterial color="#f1ebd3" emissive="#1a1408" emissiveIntensity={0.05} />
      </mesh>
      {/* clock hands */}
      <mesh
        position={[0, BASE_H * 0.65, BASE_D / 2 + 0.05]}
        rotation={[0, 0, Math.PI / 3]}
      >
        <boxGeometry args={[0.08, CLOCK_FACE_RADIUS * 0.75, 0.02]} />
        <meshStandardMaterial color="#2a1d10" />
      </mesh>
      <mesh
        position={[0, BASE_H * 0.65, BASE_D / 2 + 0.05]}
        rotation={[0, 0, -Math.PI / 6]}
      >
        <boxGeometry args={[0.06, CLOCK_FACE_RADIUS * 0.55, 0.02]} />
        <meshStandardMaterial color="#2a1d10" />
      </mesh>
    </RigidBody>
  )
}
