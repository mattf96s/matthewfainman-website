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
  // bridge floor slab overhangs onto the sidewalks slightly so there's
  // no visible gap when stepping on
  const slabExtent =
    CANAL_WIDTH + FAR_SIDEWALK_WIDTH / 2 + NEAR_SIDEWALK_WIDTH / 2
  // railings are shorter — only past the canal edges by a small lip,
  // so they don't reach into the streets/sidewalks
  const railExtent = CANAL_WIDTH + 0.4

  const railHeight = 1.0
  const railThickness = 0.1

  // Lift the slab a hair above the sidewalk strips so its top doesn't
  // share a Y plane with them (the slab overhangs the sidewalks, so
  // coplanar tops z-fight along the overhang).
  const SLAB_LIFT = 0.01

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh
        receiveShadow
        castShadow
        position={[X_CANAL, -SURFACE_THICKNESS / 2 + SLAB_LIFT, z]}
      >
        <boxGeometry args={[slabExtent, SURFACE_THICKNESS, width]} />
        <meshStandardMaterial color={COLOR_BRIDGE} />
      </mesh>

      {[-width / 2, width / 2].map((zOffset) => (
        <mesh
          key={zOffset}
          castShadow
          position={[X_CANAL, railHeight / 2 + SLAB_LIFT, z + zOffset]}
        >
          <boxGeometry args={[railExtent, railHeight, railThickness]} />
          <meshStandardMaterial color="#5a4b3a" />
        </mesh>
      ))}
    </RigidBody>
  )
}
