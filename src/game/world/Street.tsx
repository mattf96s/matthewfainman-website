import { RigidBody } from '@react-three/rapier'

import {
  BLOCK_LENGTH,
  COLOR_FIETSPAD,
  COLOR_ROAD,
  COLOR_SIDEWALK,
  FAR_SIDEWALK_WIDTH,
  FIETSPAD_WIDTH,
  HOUSE_SIDEWALK_WIDTH,
  NEAR_SIDEWALK_WIDTH,
  ROAD_WIDTH,
  SURFACE_THICKNESS,
  X_FAR_SIDEWALK,
  X_FIETSPAD,
  X_HOUSE_SIDEWALK,
  X_NEAR_SIDEWALK,
  X_ROAD,
} from './constants'

interface StripProps {
  x: number
  width: number
  color: string
}

function Strip({ x, width, color }: StripProps) {
  return (
    <mesh
      receiveShadow
      position={[x, -SURFACE_THICKNESS / 2, 0]}
    >
      <boxGeometry args={[width, SURFACE_THICKNESS, BLOCK_LENGTH]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

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
      <Strip x={X_ROAD} width={ROAD_WIDTH} color={COLOR_ROAD} />
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
