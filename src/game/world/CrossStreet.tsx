import { RigidBody } from '@react-three/rapier'

import {
  COLOR_ROAD,
  COLOR_SIDEWALK,
  CROSS_STREET_WIDTH,
  CROSS_STREET_X_HALF,
  SURFACE_THICKNESS,
} from './constants'

interface CrossStreetProps {
  z: number
}

const SIDEWALK_DEPTH = 1.5
const ROAD_DEPTH = CROSS_STREET_WIDTH - SIDEWALK_DEPTH * 2
const TOTAL_X = CROSS_STREET_X_HALF * 2

/**
 * A perpendicular E-W street: sidewalk strips on north and south of a
 * central road. Lays across the entire neighbourhood width.
 */
export function CrossStreet({ z }: CrossStreetProps) {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      {/* south sidewalk */}
      <mesh
        receiveShadow
        position={[0, -SURFACE_THICKNESS / 2, z - ROAD_DEPTH / 2 - SIDEWALK_DEPTH / 2]}
      >
        <boxGeometry args={[TOTAL_X, SURFACE_THICKNESS, SIDEWALK_DEPTH]} />
        <meshStandardMaterial color={COLOR_SIDEWALK} />
      </mesh>

      {/* road */}
      <mesh
        receiveShadow
        position={[0, -SURFACE_THICKNESS / 2, z]}
      >
        <boxGeometry args={[TOTAL_X, SURFACE_THICKNESS, ROAD_DEPTH]} />
        <meshStandardMaterial color={COLOR_ROAD} />
      </mesh>

      {/* north sidewalk */}
      <mesh
        receiveShadow
        position={[0, -SURFACE_THICKNESS / 2, z + ROAD_DEPTH / 2 + SIDEWALK_DEPTH / 2]}
      >
        <boxGeometry args={[TOTAL_X, SURFACE_THICKNESS, SIDEWALK_DEPTH]} />
        <meshStandardMaterial color={COLOR_SIDEWALK} />
      </mesh>
    </RigidBody>
  )
}
