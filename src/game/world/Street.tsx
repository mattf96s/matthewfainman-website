import { RigidBody } from '@react-three/rapier'

import {
  BLOCK_LENGTH,
  CAR_LANE_WIDTH,
  COLOR_FIETSPAD,
  COLOR_MEDIAN,
  COLOR_ROAD,
  COLOR_SIDEWALK,
  COLOR_TRAM_LANE,
  FAR_SIDEWALK_WIDTH,
  FIETSPAD_WIDTH,
  HOUSE_SIDEWALK_WIDTH,
  MEDIAN_WIDTH,
  NEAR_SIDEWALK_WIDTH,
  SURFACE_THICKNESS,
  TRAM_LANE_WIDTH,
  X_CAR_EAST,
  X_CAR_WEST,
  X_FAR_SIDEWALK,
  X_FIETSPAD,
  X_HOUSE_SIDEWALK,
  X_MEDIAN_EAST,
  X_MEDIAN_WEST,
  X_NEAR_SIDEWALK,
  X_TRAM_EAST,
  X_TRAM_WEST,
} from './constants'

interface StripProps {
  x: number
  width: number
  color: string
  /** Y offset — medians sit slightly higher (raised pavement). */
  yLift?: number
}

function Strip({ x, width, color, yLift = 0 }: StripProps) {
  return (
    <mesh
      receiveShadow
      position={[x, -SURFACE_THICKNESS / 2 + yLift, 0]}
    >
      <boxGeometry args={[width, SURFACE_THICKNESS, BLOCK_LENGTH]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

const MEDIAN_LIFT = 0.12

export function Street() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <Strip
        x={X_FAR_SIDEWALK}
        width={FAR_SIDEWALK_WIDTH}
        color={COLOR_SIDEWALK}
      />
      <Strip
        x={X_NEAR_SIDEWALK}
        width={NEAR_SIDEWALK_WIDTH}
        color={COLOR_SIDEWALK}
      />
      <Strip x={X_CAR_WEST} width={CAR_LANE_WIDTH} color={COLOR_ROAD} />
      <Strip
        x={X_MEDIAN_WEST}
        width={MEDIAN_WIDTH}
        color={COLOR_MEDIAN}
        yLift={MEDIAN_LIFT}
      />
      <Strip
        x={X_TRAM_WEST}
        width={TRAM_LANE_WIDTH}
        color={COLOR_TRAM_LANE}
      />
      <Strip
        x={X_TRAM_EAST}
        width={TRAM_LANE_WIDTH}
        color={COLOR_TRAM_LANE}
      />
      <Strip
        x={X_MEDIAN_EAST}
        width={MEDIAN_WIDTH}
        color={COLOR_MEDIAN}
        yLift={MEDIAN_LIFT}
      />
      <Strip x={X_CAR_EAST} width={CAR_LANE_WIDTH} color={COLOR_ROAD} />
      <Strip
        x={X_FIETSPAD}
        width={FIETSPAD_WIDTH}
        color={COLOR_FIETSPAD}
      />
      <Strip
        x={X_HOUSE_SIDEWALK}
        width={HOUSE_SIDEWALK_WIDTH}
        color={COLOR_SIDEWALK}
      />
    </RigidBody>
  )
}
