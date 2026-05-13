import { useMemo } from 'react'
import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'

import {
  CANAL_DEPTH,
  CANAL_WIDTH,
  FAR_SIDEWALK_WIDTH,
  NEAR_SIDEWALK_WIDTH,
  SURFACE_THICKNESS,
  X_CANAL,
} from './constants'

interface BridgeProps {
  z: number
  width?: number
}

const COLOR_STONE = '#a99584'
const COLOR_DECK = '#9a8674'
const COLOR_CAP = '#bba593'
const COLOR_RAIL = '#2c3a32'
const COLOR_POST = '#1f2724'

const SLAB_LIFT = 0.01

/** Stone substructure profile dimensions. The arch is a shallow
 * segmental form — flat enough to read as Amsterdam and to keep the
 * peak just under the deck slab. */
const ARCH_HALF_X = CANAL_WIDTH / 2 - 0.45
const ABUTMENT_TOP_Y = -0.85
const ARCH_PEAK_Y = -SURFACE_THICKNESS - 0.05
const WALL_TOP_Y = -SURFACE_THICKNESS - 0.02
const WALL_BOTTOM_Y = -CANAL_DEPTH - 0.05
const SLAB_EXTENT =
  CANAL_WIDTH + FAR_SIDEWALK_WIDTH / 2 + NEAR_SIDEWALK_WIDTH / 2
const SLAB_HALF_X = SLAB_EXTENT / 2

/** Side-profile of the under-deck stone wall, with an arched opening
 * for the canal. Built once and shared across all bridges. */
function buildWallShape(): THREE.Shape {
  const s = new THREE.Shape()
  s.moveTo(-SLAB_HALF_X, WALL_TOP_Y)
  s.lineTo(SLAB_HALF_X, WALL_TOP_Y)
  s.lineTo(SLAB_HALF_X, WALL_BOTTOM_Y)
  s.lineTo(ARCH_HALF_X, WALL_BOTTOM_Y)
  s.lineTo(ARCH_HALF_X, ABUTMENT_TOP_Y)
  // Quadratic curve over the canal — control point above the deck so
  // the curve peaks at ARCH_PEAK_Y (mid-point of a quadratic Bezier
  // sits at (P0 + 2*P1 + P2) / 4, so control y = 2*peak - spring).
  const controlY = 2 * ARCH_PEAK_Y - ABUTMENT_TOP_Y
  s.quadraticCurveTo(0, controlY, -ARCH_HALF_X, ABUTMENT_TOP_Y)
  s.lineTo(-ARCH_HALF_X, WALL_BOTTOM_Y)
  s.lineTo(-SLAB_HALF_X, WALL_BOTTOM_Y)
  s.lineTo(-SLAB_HALF_X, WALL_TOP_Y)
  return s
}

const cachedWallShape = buildWallShape()

/**
 * A stone-arched canal bridge with iron railings: extruded segmental
 * arch underneath, flat stone deck, and an ornate balustrade with
 * finial-capped corner posts. Replaces the old plank-and-rail look.
 */
export function Bridge({ z, width = 4 }: BridgeProps) {
  const wallGeometry = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(cachedWallShape, {
      depth: width,
      bevelEnabled: false,
      curveSegments: 18,
    })
    g.translate(0, 0, -width / 2)
    return g
  }, [width])

  const railLength = CANAL_WIDTH + 0.4
  const railHeight = 1.0

  return (
    <group>
      {/* Stone arched substructure (visual only) */}
      <mesh
        geometry={wallGeometry}
        position={[X_CANAL, 0, z]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={COLOR_STONE} roughness={0.95} />
      </mesh>

      <RigidBody type="fixed" colliders={false}>
        {/* Walkable deck slab */}
        <mesh
          receiveShadow
          castShadow
          position={[X_CANAL, -SURFACE_THICKNESS / 2 + SLAB_LIFT, z]}
        >
          <boxGeometry args={[SLAB_EXTENT, SURFACE_THICKNESS, width]} />
          <meshStandardMaterial color={COLOR_DECK} roughness={0.85} />
        </mesh>

        {/* Lighter cap stones running along the top edge of each side
          * wall, just below the railing — reads as the typical
          * dressed-stone parapet on Amsterdam canal bridges */}
        {[-width / 2, width / 2].map((zo, i) => (
          <mesh
            key={`cap-${i}`}
            position={[X_CANAL, SLAB_LIFT + 0.045, z + zo]}
            receiveShadow
          >
            <boxGeometry args={[CANAL_WIDTH + 0.6, 0.09, 0.22]} />
            <meshStandardMaterial color={COLOR_CAP} roughness={0.85} />
          </mesh>
        ))}

        {/* Iron railings on both long sides */}
        <Railing
          z={z + width / 2}
          length={railLength}
          height={railHeight}
        />
        <Railing
          z={z - width / 2}
          length={railLength}
          height={railHeight}
        />

        {/* Walkable surface collider */}
        <CuboidCollider
          args={[SLAB_EXTENT / 2, SURFACE_THICKNESS / 2, width / 2]}
          position={[X_CANAL, -SURFACE_THICKNESS / 2 + SLAB_LIFT, z]}
        />

        {/* Invisible side walls — keep the player on the deck even
          * though the visual railing is mostly gaps */}
        {[-width / 2, width / 2].map((zo, i) => (
          <CuboidCollider
            key={`b-${i}`}
            args={[railLength / 2, railHeight / 2, 0.06]}
            position={[X_CANAL, railHeight / 2 + SLAB_LIFT, z + zo]}
          />
        ))}
      </RigidBody>
    </group>
  )
}

interface RailingProps {
  z: number
  length: number
  height: number
}

function Railing({ z, length, height }: RailingProps) {
  const balusters = useMemo(() => {
    const arr: number[] = []
    const spacing = 0.3
    const count = Math.max(2, Math.floor(length / spacing))
    for (let i = 0; i < count; i++) {
      arr.push(-length / 2 + (i + 0.5) * (length / count))
    }
    return arr
  }, [length])

  const baseY = SLAB_LIFT
  const topRailY = baseY + height
  const bottomRailY = baseY + 0.14

  return (
    <group position={[X_CANAL, 0, z]}>
      {/* top handrail — only the handrail casts a shadow; the thin
        * balusters and bottom rail are too narrow for the shadow map
        * to resolve and were costing >60 draw-calls per railing. */}
      <mesh
        position={[0, topRailY, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.045, 0.045, length, 10]} />
        <meshStandardMaterial
          color={COLOR_RAIL}
          roughness={0.5}
          metalness={0.45}
        />
      </mesh>

      {/* bottom rail */}
      <mesh
        position={[0, bottomRailY, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.025, 0.025, length, 8]} />
        <meshStandardMaterial
          color={COLOR_RAIL}
          roughness={0.55}
          metalness={0.45}
        />
      </mesh>

      {/* balusters */}
      {balusters.map((bx, i) => (
        <mesh
          key={`bal-${i}`}
          position={[bx, baseY + (height + 0.14) / 2, 0]}
        >
          <cylinderGeometry
            args={[0.018, 0.018, height - 0.14, 6]}
          />
          <meshStandardMaterial
            color={COLOR_RAIL}
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>
      ))}

      {/* end posts with finial caps */}
      {[-length / 2, length / 2].map((bx) => (
        <group key={`post-${bx}`} position={[bx, 0, 0]}>
          <mesh
            position={[0, baseY + (height + 0.18) / 2, 0]}
            castShadow
          >
            <cylinderGeometry
              args={[0.07, 0.07, height + 0.18, 8]}
            />
            <meshStandardMaterial
              color={COLOR_POST}
              roughness={0.5}
              metalness={0.5}
            />
          </mesh>
          <mesh
            position={[0, baseY + height + 0.26, 0]}
          >
            <sphereGeometry args={[0.085, 10, 8]} />
            <meshStandardMaterial
              color={COLOR_POST}
              roughness={0.45}
              metalness={0.55}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
