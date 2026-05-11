import { Shop, type ShopBrand } from './Shop'
import { CROSS_STREET_WIDTH, CROSS_STREET_Z } from './constants'

const SHOP_DEPTH = 5
const SHOP_WIDTH = 5.5
const SHOP_GAP = 0.6

/** Brands shown along the cross-street's north side, west → east. */
const PARADE: ShopBrand[] = [
  'doner',
  'ah',
  'febo',
  'coffeeshop',
  'action',
  'nightshop',
]

/**
 * Six branded shops lined up along the north sidewalk of the cross-
 * street, all facing south (toward the road). Centred on x=0 so the
 * row spans the cross-street's full visible X extent.
 */
export function Shops() {
  // shop centre Z sits SHOP_DEPTH/2 north of the north sidewalk's outer edge
  const z =
    CROSS_STREET_Z + CROSS_STREET_WIDTH / 2 + SHOP_DEPTH / 2 + 0.2

  const stride = SHOP_WIDTH + SHOP_GAP
  const startX = -((PARADE.length - 1) * stride) / 2

  return (
    <>
      {PARADE.map((brand, i) => (
        <Shop
          key={brand}
          brand={brand}
          position={[startX + i * stride, 0, z]}
          rotationY={Math.PI}
          width={SHOP_WIDTH}
          depth={SHOP_DEPTH}
        />
      ))}
    </>
  )
}
