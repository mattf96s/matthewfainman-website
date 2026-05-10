import { BikeRacks } from './BikeRacks'
import { Bridge } from './Bridge'
import { Canal } from './Canal'
import { ClockTower } from './ClockTower'
import { HouseRow } from './HouseRow'
import { Lamps } from './Lamps'
import { Street } from './Street'
import {
  BLOCK_LENGTH,
  FAR_SIDEWALK_WIDTH,
  X_FAR_SIDEWALK,
  X_HOUSE_FRONT,
} from './constants'

/**
 * Composes a small Amsterdam neighbourhood: street strips, canal, a
 * bridge, two rows of canal houses (east + west), a landmark clock
 * tower at the north end, and decorative lamp posts + bike racks.
 */
export function Block() {
  const westFacadeX = X_FAR_SIDEWALK - FAR_SIDEWALK_WIDTH / 2

  return (
    <group>
      <Street />
      <Canal bridgeZ={0} bridgeWidth={4} />
      <Bridge z={0} width={4} />

      {/* east row — facade faces west (-X), toward the canal */}
      <HouseRow frontX={X_HOUSE_FRONT} facingY={-Math.PI / 2} seed={0} />

      {/* west row — facade faces east (+X), toward the canal */}
      <HouseRow frontX={westFacadeX} facingY={Math.PI / 2} seed={3} />

      {/* landmark — north end of the canal, just past the block edge */}
      <ClockTower position={[X_HOUSE_FRONT + 4, 0, BLOCK_LENGTH / 2 + 6]} />

      <Lamps />
      <BikeRacks />
    </group>
  )
}
