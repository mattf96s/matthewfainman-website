import { CanalHouse, type GableShape } from './CanalHouse'
import { Shop, type ShopBrand } from './Shop'
import { BLOCK_LENGTH, HOUSE_BRICKS } from './constants'

// Deterministic gable mix along a row — weighted toward the plain point
// gable, with stepped and bell gables sprinkled in for Amsterdam character.
const GABLE_CYCLE: readonly GableShape[] = [
  'step',
  'point',
  'bell',
  'point',
  'bell',
  'step',
  'point',
]

interface HouseRowProps {
  /** X of the house front line (facade). */
  frontX: number
  /** Y rotation. Use 0 for facade facing +Z, ±π/2 for facing ±X, etc. */
  facingY: number
  /** Index seed so the two sides don't get identical heights. */
  seed?: number
  /** House indices (within this row) that should render as red-light houses. */
  redLightIndices?: ReadonlySet<number>
  /** Indices to render as shops (with brand) instead of canal houses. */
  shopAtIndex?: ReadonlyMap<number, ShopBrand>
}

const HOUSE_WIDTH = 5
const HOUSE_DEPTH = 8
const HOUSE_GAP = 0.4
const SHOP_DEPTH = 5
const SHOP_HEIGHT = 4.4

/**
 * A row of narrow canal houses along Z, centred on the block. `frontX`
 * is the X coordinate of the facade; the body extends behind by HOUSE_DEPTH.
 * Specific indices can be swapped for shops via `shopAtIndex`.
 */
export function HouseRow({
  frontX,
  facingY,
  seed = 0,
  redLightIndices,
  shopAtIndex,
}: HouseRowProps) {
  const count = Math.floor(BLOCK_LENGTH / (HOUSE_WIDTH + HOUSE_GAP))
  const stride = HOUSE_WIDTH + HOUSE_GAP
  const startZ = -((count - 1) * stride) / 2

  const sin = Math.sin(facingY)
  const houseBodyX = frontX - (HOUSE_DEPTH / 2) * sin
  const shopBodyX = frontX - (SHOP_DEPTH / 2) * sin

  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const z = startZ + i * stride
        const brand = shopAtIndex?.get(i)
        if (brand) {
          return (
            <Shop
              key={i}
              position={[shopBodyX, 0, z]}
              rotationY={facingY}
              brand={brand}
              width={HOUSE_WIDTH}
              depth={SHOP_DEPTH}
              height={SHOP_HEIGHT}
            />
          )
        }
        const brick = HOUSE_BRICKS[(i + seed) % HOUSE_BRICKS.length]!
        const heightJitter = 1.5 * Math.sin((i + seed) * 1.7)
        const redLight = redLightIndices?.has(i) ?? false
        const gable = GABLE_CYCLE[(i + seed) % GABLE_CYCLE.length]!
        return (
          <CanalHouse
            key={i}
            position={[houseBodyX, 0, z]}
            width={HOUSE_WIDTH}
            depth={HOUSE_DEPTH}
            height={9 + heightJitter}
            rotationY={facingY}
            brick={brick}
            gable={gable}
            redLight={redLight}
          />
        )
      })}
    </>
  )
}
