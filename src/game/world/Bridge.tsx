import { RigidBody } from '@react-three/rapier'

import {
  CANAL_WIDTH,
  COLOR_BRIDGE,
  FAR_SIDEWALK_WIDTH,
  NEAR_SIDEWALK_WIDTH,
  SURFACE_THICKNESS,
  X_CANAL,
} from './constants'

interface BridgeProps {
  z: number
  width?: number
}

/**
 * Spans the canal along X, overlapping the sidewalks on each side so
 * the player can step on without a gap.
 */
export function Bridge({ z, width = 4 }: BridgeProps) {
  const xExtent =
    CANAL_WIDTH + FAR_SIDEWALK_WIDTH / 2 + NEAR_SIDEWALK_WIDTH / 2

  const railHeight = 1.0
  const railThickness = 0.1

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh
        receiveShadow
        castShadow
        position={[X_CANAL, -SURFACE_THICKNESS / 2, z]}
      >
        <boxGeometry args={[xExtent, SURFACE_THICKNESS, width]} />
        <meshStandardMaterial color={COLOR_BRIDGE} />
      </mesh>

      {[-width / 2, width / 2].map((zOffset) => (
        <mesh
          key={zOffset}
          castShadow
          position={[X_CANAL, railHeight / 2, z + zOffset]}
        >
          <boxGeometry args={[xExtent, railHeight, railThickness]} />
          <meshStandardMaterial color="#5a4b3a" />
        </mesh>
      ))}
    </RigidBody>
  )
}
