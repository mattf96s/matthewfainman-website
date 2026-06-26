import { CuboidCollider, RigidBody } from '@react-three/rapier'

import { CarBody, CAR_DIMS, type CarShape } from '../hazards/CarBodies'
import {
  FAR_SIDEWALK_WIDTH,
  NEAR_SIDEWALK_WIDTH,
  X_FAR_SIDEWALK,
  X_NEAR_SIDEWALK,
} from './constants'

interface ParkedCarSpec {
  /** Side of the canal — controls which sidewalk and which way the
   * driver-side faces. */
  side: 'west' | 'east'
  /** Centre Z. */
  z: number
  /** Body colour. */
  color: string
  /** +1 nose points north (+Z), -1 nose points south. */
  facing?: 1 | -1
  /** Body model. Defaults to a Tesla. */
  shape?: CarShape
}

/** Distance from the road-facing curb at which the parked car's
 * centerline sits. Half a car width plus a tiny gap, so the body sits
 * just on the sidewalk-side of the curb edge. */
const CAR_INSET_FROM_CURB = CAR_DIMS.tesla.width / 2 + 0.1

/** East-bank parked car centre X. Sits on the road-facing half of the
 * canal-side sidewalk, leaving the canal edge (bollards + tree row)
 * clear for the player. */
const X_EAST_PARKED = X_NEAR_SIDEWALK + NEAR_SIDEWALK_WIDTH / 2 - CAR_INSET_FROM_CURB
/** West-bank parked car centre X. Sits on the canal-facing half of
 * the far sidewalk so the row reads from across the gracht — the far
 * bank is most often viewed across the water. Extra inset compared to
 * the east bank because the bollard row is between the car and the
 * canal curb on this side. */
const X_WEST_PARKED = X_FAR_SIDEWALK + FAR_SIDEWALK_WIDTH / 2 - CAR_INSET_FROM_CURB - 0.7

const CARS: ParkedCarSpec[] = [
  { side: 'east', z: -44, color: '#e9e9ec', facing: 1 },
  { side: 'east', z: -30, color: '#1b1d22', facing: -1 },
  { side: 'east', z: -10, color: '#8f9478', facing: 1, shape: 'microcar' },
  { side: 'east', z: 22, color: '#34383e', facing: -1 },
  { side: 'east', z: 38, color: '#9aa6ad', facing: 1 },
  { side: 'west', z: -36, color: '#2a3550', facing: -1 },
  { side: 'west', z: -12, color: '#e9e9ec', facing: 1 },
  { side: 'west', z: 10, color: '#b08a3a', facing: -1, shape: 'microcar' },
  { side: 'west', z: 38, color: '#7a2030', facing: 1 },
]

/**
 * A handful of static parked cars along both canal-side sidewalks.
 * The driver-side door faces the gracht. Solid colliders so the
 * player has to walk around them rather than through.
 */
export function ParkedCars() {
  return (
    <>
      {CARS.map((c, i) => (
        <ParkedCar key={i} {...c} />
      ))}
    </>
  )
}

function ParkedCar({ side, z, color, facing = 1, shape = 'tesla' }: ParkedCarSpec) {
  const x = side === 'east' ? X_EAST_PARKED : X_WEST_PARKED
  // Orient so the driver-side faces the canal. Cars are modelled nose at
  // +Z; canal is at -X for east-bank cars (facing=1) and +X for west-bank
  // cars (facing=-1). The specs above honour this; we just spin by it.
  const yRot = facing === 1 ? 0 : Math.PI
  // Skew the heading by a tiny angle so the row doesn't look stamped.
  const wobble = ((Math.sin(z * 13.1) + 1) / 2 - 0.5) * 0.08
  const dims = CAR_DIMS[shape]

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={[x, 0, z]}
      rotation={[0, yRot + wobble, 0]}
    >
      <CuboidCollider
        args={[dims.width / 2, dims.height / 2, dims.length / 2]}
        position={[0, dims.height / 2, 0]}
      />
      <CarBody shape={shape} color={color} registerTailMat={() => {}} />
    </RigidBody>
  )
}
