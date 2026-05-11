import { Flag } from './Flag'
import {
  BLOCK_LENGTH,
  FAR_SIDEWALK_WIDTH,
  X_FAR_SIDEWALK,
  X_HOUSE_FRONT,
} from './constants'

const HOUSE_WIDTH = 5
const HOUSE_GAP = 0.4
const STRIDE = HOUSE_WIDTH + HOUSE_GAP
const HOUSE_COUNT = Math.floor(BLOCK_LENGTH / STRIDE)
const FIRST_Z = -((HOUSE_COUNT - 1) * STRIDE) / 2

const westFacadeX = X_FAR_SIDEWALK - FAR_SIDEWALK_WIDTH / 2

/** Z of a house slot (mirrors HouseRow's layout). */
function houseZ(i: number): number {
  return FIRST_Z + i * STRIDE
}

/**
 * Wall-mounted flags hanging off specific canal houses. The east-row
 * flag sticks out west (toward the canal); the west-row flag sticks
 * out east. Mounted near the top of the facade so they're visible
 * from the street.
 */
export function Flags() {
  return (
    <>
      {/* Amsterdam flag on an east-row house (slot 7) — pole extends west */}
      <Flag
        position={[X_HOUSE_FRONT - 0.02, 6.8, houseZ(7)]}
        rotationY={Math.PI}
        kind="amsterdam"
      />

      {/* Dutch flag on a west-row house (slot 4) — pole extends east */}
      <Flag
        position={[westFacadeX + 0.02, 6.8, houseZ(4)]}
        rotationY={0}
        kind="nl"
      />
    </>
  )
}
