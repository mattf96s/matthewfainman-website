import { Flag } from './Flag'
import {
  CROSS_STREET_Z,
  X_HOUSE_FRONT,
  X_NEAR_SIDEWALK,
} from './constants'

/**
 * Two flagpoles near the centre of the block — one Dutch, one
 * Amsterdam — visible from most walking angles.
 */
export function Flags() {
  return (
    <>
      <Flag
        position={[X_NEAR_SIDEWALK + 1.4, 6]}
        kind="nl"
        rotationY={-Math.PI / 2}
      />
      <Flag
        position={[X_HOUSE_FRONT + 2, CROSS_STREET_Z + 4]}
        kind="amsterdam"
        rotationY={-Math.PI / 2}
        poleHeight={6}
      />
    </>
  )
}
