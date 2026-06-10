import { RigidBody } from '@react-three/rapier'

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
}

/** Width and length of the parked-car footprint. Slightly smaller than
 * the moving cars so they feel tucked in alongside the canal. */
const CAR_W = 1.7
const CAR_L = 4.0
const CAR_H = 1.3

/** Distance from the road-facing curb at which the parked car's
 * centerline sits. Half a car width plus a tiny gap, so the body sits
 * just on the sidewalk-side of the curb edge. */
const CAR_INSET_FROM_CURB = CAR_W / 2 + 0.1

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
  { side: 'east', z: -44, color: '#7e858a', facing: 1 },
  { side: 'east', z: -30, color: '#3a3f44', facing: -1 },
  { side: 'east', z: -10, color: '#8c5a3a', facing: 1 },
  { side: 'east', z: 22, color: '#5a6c52', facing: -1 },
  { side: 'east', z: 38, color: '#9a8154', facing: 1 },
  { side: 'west', z: -36, color: '#c9b07a', facing: -1 },
  { side: 'west', z: -12, color: '#2c3a4a', facing: 1 },
  { side: 'west', z: 10, color: '#7a3d3d', facing: -1 },
  { side: 'west', z: 38, color: '#3f5a6a', facing: 1 },
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

function ParkedCar({ side, z, color, facing = 1 }: ParkedCarSpec) {
  const x = side === 'east' ? X_EAST_PARKED : X_WEST_PARKED
  // Orient so the driver-side (west side of the body in local space) faces
  // the canal. The canal is at -X for east-bank cars, +X for west-bank cars.
  // Cars are modelled with nose at +Z; +X side is passenger when nose is +Z.
  // East-bank: canal at -X relative to car centre → driver side (-X local)
  //   faces canal when nose is +Z → facing=1 ✓
  // West-bank: canal at +X relative to car centre → driver side faces canal
  //   when nose is -Z → facing=-1 ✓
  // Specs above honour this; we just spin by the requested facing.
  const yRot = facing === 1 ? 0 : Math.PI
  // Skew the heading by a tiny angle so the row doesn't look stamped.
  const wobble = ((Math.sin(z * 13.1) + 1) / 2 - 0.5) * 0.08

  return (
    <RigidBody
      type="fixed"
      colliders="cuboid"
      position={[x, CAR_H / 2 + 0.05, z]}
      rotation={[0, yRot + wobble, 0]}
    >
      <mesh receiveShadow>
        <boxGeometry args={[CAR_W, CAR_H * 0.55, CAR_L]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.25} />
      </mesh>

      <mesh position={[0, CAR_H * 0.4, -0.1]}>
        <boxGeometry args={[CAR_W * 0.92, CAR_H * 0.45, CAR_L * 0.55]} />
        <meshStandardMaterial color={color} roughness={0.65} metalness={0.2} />
      </mesh>

      {/* windshield */}
      <mesh position={[0, CAR_H * 0.4, CAR_L * 0.275 - 0.1]}>
        <planeGeometry args={[CAR_W * 0.85, CAR_H * 0.4]} />
        <meshStandardMaterial color="#1f2a35" roughness={0.25} metalness={0.5} />
      </mesh>
      {/* rear window */}
      <mesh
        position={[0, CAR_H * 0.4, -CAR_L * 0.275 - 0.1]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[CAR_W * 0.85, CAR_H * 0.4]} />
        <meshStandardMaterial color="#1f2a35" roughness={0.25} metalness={0.5} />
      </mesh>
      {/* side windows */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[(CAR_W / 2 + 0.001) * s, CAR_H * 0.4, -0.1]}
          rotation={[0, s > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          <planeGeometry args={[CAR_L * 0.4, CAR_H * 0.32]} />
          <meshStandardMaterial color="#1f2a35" roughness={0.25} metalness={0.5} />
        </mesh>
      ))}

      {/* wheels */}
      {[
        [-CAR_W / 2, CAR_L / 2 - 0.6],
        [CAR_W / 2, CAR_L / 2 - 0.6],
        [-CAR_W / 2, -CAR_L / 2 + 0.6],
        [CAR_W / 2, -CAR_L / 2 + 0.6],
      ].map(([wx, wz]) => (
        <mesh
          key={`${wx},${wz}`}
         
          position={[wx, -CAR_H * 0.25, wz]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.28, 0.28, 0.16, 10]} />
          <meshStandardMaterial color="#0e0e0e" roughness={0.85} />
        </mesh>
      ))}

      {/* headlights & tail-lights — keep emissive low so parked cars
        * don't read as live traffic */}
      {[-CAR_W * 0.3, CAR_W * 0.3].map((wx) => (
        <mesh key={`hl-${wx}`} position={[wx, 0, CAR_L / 2 + 0.01]}>
          <planeGeometry args={[0.3, 0.15]} />
          <meshStandardMaterial color="#d6cca2" roughness={0.5} />
        </mesh>
      ))}
      {[-CAR_W * 0.3, CAR_W * 0.3].map((wx) => (
        <mesh
          key={`tl-${wx}`}
          position={[wx, 0, -CAR_L / 2 - 0.01]}
          rotation={[0, Math.PI, 0]}
        >
          <planeGeometry args={[0.3, 0.15]} />
          <meshStandardMaterial color="#7a2a2a" roughness={0.5} />
        </mesh>
      ))}
    </RigidBody>
  )
}
