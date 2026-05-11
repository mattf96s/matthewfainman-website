import { useMemo } from 'react'
import { Instance, Instances } from '@react-three/drei'

import {
  BLOCK_LENGTH,
  FAR_SIDEWALK_WIDTH,
  NEAR_SIDEWALK_WIDTH,
  X_FAR_SIDEWALK,
  X_NEAR_SIDEWALK,
} from './constants'

const BRICK_L = 0.42
const BRICK_W = 0.11
const BRICK_H = 0.04
/** Brick centre-to-brick centre step. Keeps bricks just clear of each
 * other at ±45°, leaving thin gaps for the warmer pavement underneath
 * to read as mortar. */
const STEP = 0.55
/** Lift bricks a hair above the pavement strip to avoid Z-fighting
 * with the underlying coloured surface (top of strip is at y = 0). */
const BRICK_LIFT = 0.005
/** Half the width of a brick's rotated bounding box (max corner offset
 * from centre at ±45°). Used to clip bricks whose corners would otherwise
 * overhang the strip onto the road / canal. */
const BRICK_HALF_EXTENT =
  ((BRICK_L + BRICK_W) / 2) * Math.SQRT1_2 + 0.02

const BRICK_COLORS = ['#8c4f30', '#9c5a36', '#a86436', '#7a4128'] as const

interface BrickInstance {
  x: number
  z: number
  rot: number
  colorIndex: number
}

interface KlinkerStripProps {
  /** Strip centre X. */
  x: number
  /** Strip width along X. */
  width: number
  /** Strip length along Z. Defaults to one block. */
  length?: number
}

/**
 * Renders a herringbone-style brick overlay across one canal-side
 * sidewalk strip. Two perpendicular brick orientations alternate in a
 * checkerboard to give the visual cadence of klinkers laid at 45°
 * without going past two draw calls per strip.
 */
function KlinkerStrip({ x, width, length = BLOCK_LENGTH }: KlinkerStripProps) {
  const bricks = useMemo<BrickInstance[]>(() => {
    const out: BrickInstance[] = []
    const cols = Math.ceil(width / STEP) + 2
    const rows = Math.ceil(length / STEP) + 2
    const baseX = x - ((cols - 1) * STEP) / 2
    const baseZ = -((rows - 1) * STEP) / 2
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const px = baseX + i * STEP
        const pz = baseZ + j * STEP
        // hide anything whose rotated footprint would overhang the strip
        // (onto the road or canal) — clip by the diagonal half-extent
        if (Math.abs(px - x) > width / 2 - BRICK_HALF_EXTENT) continue
        if (Math.abs(pz) > length / 2 - BRICK_HALF_EXTENT) continue
        const rot = ((i + j) & 1) === 0 ? Math.PI / 4 : -Math.PI / 4
        // Pseudo-random colour per brick — stable across renders since
        // it's derived from grid indices.
        const colorIndex = (i * 7 + j * 13 + ((i * j) & 3)) % BRICK_COLORS.length
        out.push({ x: px, z: pz, rot, colorIndex })
      }
    }
    return out
  }, [x, width, length])

  return (
    <>
      {BRICK_COLORS.map((c, ci) => {
        const subset = bricks.filter((b) => b.colorIndex === ci)
        if (subset.length === 0) return null
        return (
          <Instances key={ci} limit={subset.length} receiveShadow>
            <boxGeometry args={[BRICK_L, BRICK_H, BRICK_W]} />
            <meshStandardMaterial color={c} roughness={0.9} />
            {subset.map((b, k) => (
              <Instance
                key={k}
                position={[b.x, BRICK_LIFT + BRICK_H / 2, b.z]}
                rotation={[0, b.rot, 0]}
              />
            ))}
          </Instances>
        )
      })}
    </>
  )
}

/**
 * Herringbone klinker overlay across both canal-side sidewalks. The
 * underlying coloured strip stays in place and reads as mortar
 * between the bricks.
 */
export function KlinkerPavement() {
  return (
    <>
      <KlinkerStrip x={X_FAR_SIDEWALK} width={FAR_SIDEWALK_WIDTH} />
      <KlinkerStrip x={X_NEAR_SIDEWALK} width={NEAR_SIDEWALK_WIDTH} />
    </>
  )
}
