import { RigidBody } from '@react-three/rapier'

import {
  CANAL_DEPTH,
  CANAL_LENGTH,
  CANAL_WIDTH,
  COLOR_CANAL,
  X_CANAL,
} from './constants'

export interface BridgeZone {
  /** Centre z of the bridge. */
  z: number
  /** Z-axis width of the bridge. */
  width: number
}

interface CanalProps {
  /** Bridges (kept for API compatibility; no longer used for kill sensors). */
  bridges?: BridgeZone[]
}

/**
 * Renders the canal water surface and a walkable floor at the canal
 * bottom. There's no kill trigger any more — falling in the gracht
 * just leaves the player wading in shallow water.
 */
export function Canal({ bridges: _bridges = [] }: CanalProps) {
  return (
    <group>
      <mesh
        receiveShadow
        position={[X_CANAL, -CANAL_DEPTH, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[CANAL_WIDTH, CANAL_LENGTH]} />
        <meshStandardMaterial
          color={COLOR_CANAL}
          metalness={0.1}
          roughness={0.4}
        />
      </mesh>

      {/* solid floor at canal bottom so the player can wade in */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[X_CANAL, -CANAL_DEPTH - 0.2, 0]}>
          <boxGeometry args={[CANAL_WIDTH, 0.4, CANAL_LENGTH]} />
          <meshStandardMaterial color="#26414a" />
        </mesh>
      </RigidBody>
    </group>
  )
}
