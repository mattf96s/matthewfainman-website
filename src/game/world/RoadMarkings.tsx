import { useMemo } from 'react'
import { Instance, Instances } from '@react-three/drei'

import {
  BLOCK_LENGTH,
  CAR_LANE_WIDTH,
  FIETSPAD_WIDTH,
  X_CAR_EAST,
  X_CAR_WEST,
  X_FIETSPAD,
} from './constants'

const Y = 0.013 // float a hair above the road, just over the zebra paint
const LINE_W = 0.14
const PAINT = '#d8d2c2' // worn road white
const DASH = 1.6
const GAP = 1.8

/** A continuous painted line running the length of the block along Z. */
function SolidLine({ x }: { x: number }) {
  return (
    <mesh position={[x, Y, 0]}>
      <boxGeometry args={[LINE_W, 0.02, BLOCK_LENGTH]} />
      <meshStandardMaterial color={PAINT} roughness={0.85} />
    </mesh>
  )
}

/** A dashed line down Z, drawn as a single instanced batch (one draw call). */
function DashedLine({ x }: { x: number }) {
  const zs = useMemo(() => {
    const step = DASH + GAP
    const n = Math.floor(BLOCK_LENGTH / step)
    const start = -((n - 1) * step) / 2
    return Array.from({ length: n }, (_, i) => start + i * step)
  }, [])

  return (
    <Instances limit={zs.length}>
      <boxGeometry args={[LINE_W, 0.02, DASH]} />
      <meshStandardMaterial color={PAINT} roughness={0.85} />
      {zs.map((z, i) => (
        <Instance key={i} position={[x, Y, z]} />
      ))}
    </Instances>
  )
}

/**
 * Lane paint over the carriageway: solid lines along the two outer kerb
 * edges, dashed lines framing the raised central tram island, and a dashed
 * edge marking the bike lane. Cheap flat geometry — five draw calls total.
 */
export function RoadMarkings() {
  return (
    <group>
      <SolidLine x={X_CAR_WEST - CAR_LANE_WIDTH / 2} />
      <SolidLine x={X_CAR_EAST + CAR_LANE_WIDTH / 2} />
      <DashedLine x={X_CAR_WEST + CAR_LANE_WIDTH / 2} />
      <DashedLine x={X_CAR_EAST - CAR_LANE_WIDTH / 2} />
      <DashedLine x={X_FIETSPAD + FIETSPAD_WIDTH / 2} />
    </group>
  )
}
