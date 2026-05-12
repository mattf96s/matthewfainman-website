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
  /** Bridges to leave gaps for in the bank visual stones. */
  bridges?: BridgeZone[]
}

/**
 * Renders the canal water surface, a walkable floor at the canal
 * bottom (the player can land on it after stepping off the curb), and
 * the visible stone bank faces. No invisible bank-edge colliders —
 * tumbling into the gracht is a real risk now; see `CanalWater` for
 * the slow-drown damage that follows.
 */
export function Canal({ bridges = [] }: CanalProps) {
  const halfLen = CANAL_LENGTH / 2
  const sorted = [...bridges].sort((a, b) => a.z - b.z)

  // build bank-face segments along Z, skipping each bridge zone
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
        <planeGeometry
          args={[CANAL_WIDTH - 2 * BANK_FACE_THICKNESS, CANAL_LENGTH]}
        />
        <meshStandardMaterial
          color={COLOR_CANAL}
          metalness={0.1}
          roughness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* solid floor at canal bottom — once you tumble in, you stand
        * here (waist-deep). Sits a hair below the water plane so its
        * top doesn't share a Y with the water (would z-fight). */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[X_CANAL, -CANAL_DEPTH - 0.3, 0]}>
          <boxGeometry args={[CANAL_WIDTH, 0.4, CANAL_LENGTH]} />
          <meshStandardMaterial color="#26414a" />
        </mesh>
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
/** Extend the wall below canal water so its bottom doesn't share a Y
 * plane with the water surface (avoids Z-fighting). */
const BANK_BELOW_WATER = 0.4

function BankFace({ side, z, length }: BankFaceProps) {
  const edgeX =
    side === 'west' ? X_CANAL - CANAL_WIDTH / 2 : X_CANAL + CANAL_WIDTH / 2
  // sit the wall fully inside the canal area (no overlap with the
  // sidewalk strip); its outer face is flush with the canal edge.
  const x =
    edgeX + (side === 'west' ? 1 : -1) * (BANK_FACE_THICKNESS / 2)
  const totalH = CANAL_DEPTH + BANK_TOP_Y + BANK_BELOW_WATER
  const cy = (BANK_TOP_Y - CANAL_DEPTH - BANK_BELOW_WATER) / 2
  return (
    <mesh receiveShadow castShadow position={[x, cy, z]}>
      <boxGeometry args={[BANK_FACE_THICKNESS, totalH, length]} />
      <meshStandardMaterial color="#605a52" roughness={0.95} />
    </mesh>
  )
}
