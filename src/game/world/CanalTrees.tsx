import { useMemo } from 'react'
import { Instance, Instances } from '@react-three/drei'

import type { BridgeZone } from './Canal'
import {
  CANAL_LENGTH,
  CANAL_WIDTH,
  X_CANAL,
} from './constants'

interface CanalTreesProps {
  /** Bridge zones to skip so trees don't grow out of the bridge deck. */
  bridges?: BridgeZone[]
}

const SPACING = 11
/** Lateral offset from the canal edge — trees sit on the inner half of
 * the canal-side sidewalk, behind the bollard row, leaving the canal
 * edge clear for the view and the player's walking lane. */
const EDGE_OFFSET = 1.6
const BRIDGE_BUFFER = 2.5

const TRUNK_RADIUS = 0.13
const TRUNK_HEIGHT = 2.6
const TRUNK_COLOR = '#5b3f2c'

const CANOPY_RADIUS = 1.1
/** Center Y of the lower canopy puff. */
const CANOPY_Y_LOWER = TRUNK_HEIGHT + 0.4
/** Center Y of the upper canopy puff (slightly smaller, stacked). */
const CANOPY_Y_UPPER = TRUNK_HEIGHT + 1.3
const CANOPY_COLOR_LOWER = '#3f6a3a'
const CANOPY_COLOR_UPPER = '#4d7a48'

interface TreeInstance {
  x: number
  z: number
  /** Small per-tree variation so the canopy doesn't look stamped. */
  jitter: number
}

/**
 * Stylised low-poly trees lining both canal banks. Bigger lower canopy
 * with a smaller higher one gives a layered "iep" (elm) silhouette
 * without going past two draw calls per canopy layer.
 */
export function CanalTrees({ bridges = [] }: CanalTreesProps) {
  const trees = useMemo<TreeInstance[]>(() => {
    const out: TreeInstance[] = []
    const xWest = X_CANAL - CANAL_WIDTH / 2 - EDGE_OFFSET
    const xEast = X_CANAL + CANAL_WIDTH / 2 + EDGE_OFFSET
    const count = Math.floor(CANAL_LENGTH / SPACING)
    const startZ = -((count - 1) * SPACING) / 2
    for (let i = 0; i < count; i++) {
      // tiny stagger so west and east rows don't line up exactly
      const zW = startZ + i * SPACING
      const zE = startZ + i * SPACING + SPACING / 2
      const inBridgeW = bridges.some(
        (b) => Math.abs(zW - b.z) < b.width / 2 + BRIDGE_BUFFER,
      )
      const inBridgeE = bridges.some(
        (b) => Math.abs(zE - b.z) < b.width / 2 + BRIDGE_BUFFER,
      )
      if (!inBridgeW) out.push({ x: xWest, z: zW, jitter: (i * 0.37) % 1 })
      if (!inBridgeE) out.push({ x: xEast, z: zE, jitter: (i * 0.61) % 1 })
    }
    return out
  }, [bridges])

  if (trees.length === 0) return null

  return (
    <>
      <Instances limit={trees.length} castShadow receiveShadow>
        <cylinderGeometry
          args={[TRUNK_RADIUS * 0.85, TRUNK_RADIUS, TRUNK_HEIGHT, 8]}
        />
        <meshStandardMaterial color={TRUNK_COLOR} roughness={0.95} />
        {trees.map((t, i) => (
          <Instance key={`trunk-${i}`} position={[t.x, TRUNK_HEIGHT / 2, t.z]} />
        ))}
      </Instances>

      <Instances limit={trees.length} castShadow>
        <icosahedronGeometry args={[CANOPY_RADIUS, 1]} />
        <meshStandardMaterial color={CANOPY_COLOR_LOWER} roughness={0.85} flatShading />
        {trees.map((t, i) => {
          const scale = 0.9 + t.jitter * 0.25
          return (
            <Instance
              key={`c1-${i}`}
              position={[t.x, CANOPY_Y_LOWER, t.z]}
              scale={[scale, scale * 0.85, scale]}
            />
          )
        })}
      </Instances>

      <Instances limit={trees.length} castShadow>
        <icosahedronGeometry args={[CANOPY_RADIUS * 0.7, 1]} />
        <meshStandardMaterial color={CANOPY_COLOR_UPPER} roughness={0.85} flatShading />
        {trees.map((t, i) => {
          const dx = (t.jitter - 0.5) * 0.4
          const dz = ((t.jitter * 1.7) % 1 - 0.5) * 0.4
          return (
            <Instance
              key={`c2-${i}`}
              position={[t.x + dx, CANOPY_Y_UPPER, t.z + dz]}
            />
          )
        })}
      </Instances>
    </>
  )
}
