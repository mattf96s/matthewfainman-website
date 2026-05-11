import { CuboidCollider, RigidBody } from '@react-three/rapier'

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
  /** Bridges to leave gaps for in the bank walls (so the player can
   * cross). Other bank stretches are sealed off. */
  bridges?: BridgeZone[]
}

const BANK_WALL_HEIGHT = 1.8
const BANK_WALL_THICKNESS = 0.2

/**
 * Renders the canal water surface, a walkable floor at the canal
 * bottom (mainly for catching anything that does drop in), and a
 * pair of invisible bank walls along each side so the player can't
 * step off the gracht into the water. Walls are segmented around the
 * supplied bridges.
 */
export function Canal({ bridges = [] }: CanalProps) {
  const halfLen = CANAL_LENGTH / 2
  const sorted = [...bridges].sort((a, b) => a.z - b.z)

  // build wall segments along Z, skipping each bridge zone
  const segments: Array<{ centre: number; len: number }> = []
  let cursor = -halfLen
  for (const b of sorted) {
    const bStart = b.z - b.width / 2
    const bEnd = b.z + b.width / 2
    if (bStart > cursor) {
      segments.push({
        centre: (cursor + bStart) / 2,
        len: bStart - cursor,
      })
    }
    cursor = Math.max(cursor, bEnd)
  }
  if (cursor < halfLen) {
    segments.push({
      centre: (cursor + halfLen) / 2,
      len: halfLen - cursor,
    })
  }

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

      {/* solid floor at canal bottom (a safety net) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[X_CANAL, -CANAL_DEPTH - 0.2, 0]}>
          <boxGeometry args={[CANAL_WIDTH, 0.4, CANAL_LENGTH]} />
          <meshStandardMaterial color="#26414a" />
        </mesh>
      </RigidBody>

      {/* invisible bank walls — one per side, segmented around bridges */}
      <RigidBody type="fixed" colliders={false}>
        {segments.map((seg, i) => (
          <CuboidCollider
            key={`west-${i}`}
            args={[BANK_WALL_THICKNESS / 2, BANK_WALL_HEIGHT / 2, seg.len / 2]}
            position={[
              X_CANAL - CANAL_WIDTH / 2 - BANK_WALL_THICKNESS / 2,
              BANK_WALL_HEIGHT / 2,
              seg.centre,
            ]}
          />
        ))}
        {segments.map((seg, i) => (
          <CuboidCollider
            key={`east-${i}`}
            args={[BANK_WALL_THICKNESS / 2, BANK_WALL_HEIGHT / 2, seg.len / 2]}
            position={[
              X_CANAL + CANAL_WIDTH / 2 + BANK_WALL_THICKNESS / 2,
              BANK_WALL_HEIGHT / 2,
              seg.centre,
            ]}
          />
        ))}
      </RigidBody>

      {/* visible stone bank walls: face the water from sidewalk top down
        * to canal water. The top edge sits flush with the sidewalk. */}
      {segments.flatMap((seg, i) => [
        <BankFace
          key={`bank-w-${i}`}
          side="west"
          z={seg.centre}
          length={seg.len}
        />,
        <BankFace
          key={`bank-e-${i}`}
          side="east"
          z={seg.centre}
          length={seg.len}
        />,
      ])}
    </group>
  )
}

interface BankFaceProps {
  side: 'west' | 'east'
  z: number
  length: number
}

const BANK_FACE_THICKNESS = 0.3
const BANK_TOP_Y = 0.05 // a hair above sidewalk top, like a stone curb

function BankFace({ side, z, length }: BankFaceProps) {
  const edgeX =
    side === 'west' ? X_CANAL - CANAL_WIDTH / 2 : X_CANAL + CANAL_WIDTH / 2
  const x = edgeX + (side === 'west' ? -1 : 1) * (BANK_FACE_THICKNESS / 2 - 0.05)
  const totalH = CANAL_DEPTH + BANK_TOP_Y
  // centre y so the box spans from -CANAL_DEPTH to +BANK_TOP_Y
  const cy = (BANK_TOP_Y - CANAL_DEPTH) / 2
  return (
    <mesh receiveShadow castShadow position={[x, cy, z]}>
      <boxGeometry args={[BANK_FACE_THICKNESS, totalH, length]} />
      <meshStandardMaterial color="#605a52" roughness={0.95} />
    </mesh>
  )
}
