import { CanalHouse } from './CanalHouse'
import { BLOCK_LENGTH, HOUSE_BRICKS } from './constants'

interface HouseRowProps {
  /** X of the house front line (facade). */
  frontX: number
  /** Y rotation. Use 0 for facade facing +Z, ±π/2 for facing ±X, etc. */
  facingY: number
  /** Index seed so the two sides don't get identical heights. */
  seed?: number
  /** House indices (within this row) that should render as red-light houses. */
  redLightIndices?: ReadonlySet<number>
}

const HOUSE_WIDTH = 5
const HOUSE_DEPTH = 8
const HOUSE_GAP = 0.4

/**
 * A row of narrow canal houses along Z, centred on the block. `frontX`
 * is the X coordinate of the facade; the body extends behind by HOUSE_DEPTH.
 * `facingY` chooses which direction the front faces — pass -π/2 for a
 * facade facing west (-X), +π/2 for a facade facing east (+X).
 */
export function HouseRow({
  frontX,
  facingY,
  seed = 0,
  redLightIndices,
}: HouseRowProps) {
  const count = Math.floor(BLOCK_LENGTH / (HOUSE_WIDTH + HOUSE_GAP))
  const stride = HOUSE_WIDTH + HOUSE_GAP
  const startZ = -((count - 1) * stride) / 2

  // CanalHouse's local +Z is the facade. After rotating by facingY, the
  // facade ends up at world offset (HOUSE_DEPTH/2)·sin(facingY) from the
  // body centre — invert to find where the body should sit.
  const sin = Math.sin(facingY)
  const bodyX = frontX - (HOUSE_DEPTH / 2) * sin

  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const z = startZ + i * stride
        const brick = HOUSE_BRICKS[(i + seed) % HOUSE_BRICKS.length]!
        const heightJitter = 1.5 * Math.sin((i + seed) * 1.7)
        const redLight = redLightIndices?.has(i) ?? false
        return (
          <CanalHouse
            key={i}
            position={[bodyX, 0, z]}
            width={HOUSE_WIDTH}
            depth={HOUSE_DEPTH}
            height={9 + heightJitter}
            rotationY={facingY}
            brick={brick}
            redLight={redLight}
          />
        )
      })}
    </>
  )
}
