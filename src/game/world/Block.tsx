import { BikeRacks } from './BikeRacks'
import { Bridge } from './Bridge'
import { Canal } from './Canal'
import { ClockTower } from './ClockTower'
import { CrossStreet } from './CrossStreet'
import { HouseRow } from './HouseRow'
import { Lamps } from './Lamps'
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

// a short De Wallen cluster — three consecutive houses on the east row,
// roughly south of the centre bridge so the player walks past it
const EAST_RED_LIGHT = new Set([2, 3, 4])

/**
 * Composes a small Amsterdam neighbourhood: street strips, canal, two
 * bridges, two rows of canal houses, a perpendicular cross-street at
 * the north end, a landmark clock tower, and decorative props.
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
      />
      <HouseRow frontX={westFacadeX} facingY={Math.PI / 2} seed={3} />

      {/* landmark — sits in the open quadrant north of the cross-street */}
      <ClockTower position={[X_HOUSE_FRONT + 4, 0, CROSS_STREET_Z + 12]} />

      {/* a few zebra crossings spaced along the road, clear of the bridges */}
      <ZebraCrossing z={-20} />
      <ZebraCrossing z={15} />
      <ZebraCrossing z={28} />

      <Lamps />
      <BikeRacks />
    </group>
  )
}
