import { BikeRacks } from './BikeRacks'
import { Bins } from './Bins'
import { Bridge } from './Bridge'
import { Canal } from './Canal'
import { ClockTower } from './ClockTower'
import { CrossStreet } from './CrossStreet'
import { Flags } from './Flags'
import { HouseRow } from './HouseRow'
import { Lamps } from './Lamps'
import { ParkedBikes } from './ParkedBikes'
import type { ShopBrand } from './Shop'
import { Street } from './Street'
import { ZebraCrossing } from './ZebraCrossing'
import {
  CROSS_STREET_WIDTH,
  CROSS_STREET_Z,
  FAR_SIDEWALK_WIDTH,
  X_FAR_SIDEWALK,
  X_HOUSE_FRONT,
} from './constants'

const CENTER_BRIDGE = { z: 0, width: 4 }
const NORTH_BRIDGE = { z: CROSS_STREET_Z, width: CROSS_STREET_WIDTH }

const EAST_RED_LIGHT = new Set([2, 3])

// shops interspersed within the canal-house rows — keys are house indices
const EAST_SHOPS = new Map<number, ShopBrand>([
  [1, 'coffeeshop'],
  [4, 'doner'],
  [6, 'ah'],
  [9, 'nightshop'],
])
const WEST_SHOPS = new Map<number, ShopBrand>([
  [2, 'febo'],
  [7, 'action'],
])

/**
 * Composes a small Amsterdam neighbourhood: street strips, canal,
 * bridges, two rows of canal houses with shops interspersed, a
 * perpendicular cross-street, a landmark clock tower, a tram stop,
 * zebra crossings, parked bikes, bins, and decorative props.
 */
export function Block() {
  const westFacadeX = X_FAR_SIDEWALK - FAR_SIDEWALK_WIDTH / 2

  return (
    <group>
      <Street />
      <Canal bridges={[CENTER_BRIDGE, NORTH_BRIDGE]} />
      <Bridge z={CENTER_BRIDGE.z} width={CENTER_BRIDGE.width} />
      <Bridge z={NORTH_BRIDGE.z} width={NORTH_BRIDGE.width} />

      <CrossStreet z={CROSS_STREET_Z} />

      <HouseRow
        frontX={X_HOUSE_FRONT}
        facingY={-Math.PI / 2}
        seed={0}
        redLightIndices={EAST_RED_LIGHT}
        shopAtIndex={EAST_SHOPS}
      />
      <HouseRow
        frontX={westFacadeX}
        facingY={Math.PI / 2}
        seed={3}
        shopAtIndex={WEST_SHOPS}
      />

      {/* landmark — sits in the open quadrant north of the cross-street */}
      <ClockTower position={[X_HOUSE_FRONT + 4, 0, CROSS_STREET_Z + 12]} />

      {/* zebra crossings spaced along the road, clear of the bridges */}
      <ZebraCrossing z={-38} />
      <ZebraCrossing z={-20} />
      <ZebraCrossing z={15} />
      <ZebraCrossing z={28} />
      <ZebraCrossing z={42} />

      <ParkedBikes />
      <Lamps />
      <BikeRacks />
      <Bins />
      <Flags />
    </group>
  )
}
