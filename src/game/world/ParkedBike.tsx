import { CuboidCollider, RigidBody } from '@react-three/rapier'

interface ParkedBikeProps {
  position: [number, number]
  rotationY?: number
  /** If true, the bike is tipped over on its side. */
  fallen?: boolean
  frameColor?: string
}

const LENGTH = 1.6
const WHEEL_R = 0.3
const FRAME_W = 0.1

/**
 * A static parked bicycle — no rider, no movement. Optionally tipped
 * over to look abandoned.
 */
export function ParkedBike({
  position: [x, z],
  rotationY = 0,
  fallen = false,
  frameColor = '#1a1a1a',
}: ParkedBikeProps) {
  // when fallen, rotate the whole bike onto its side
  const tilt: [number, number, number] = fallen
    ? [0, rotationY, Math.PI / 2]
    : [0, rotationY, 0]

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={[x, fallen ? WHEEL_R : 0, z]}
      rotation={tilt}
    >
      <CuboidCollider args={[0.4, 0.55, LENGTH / 2]} position={[0, 0.55, 0]} />

      {/* frame top bar */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[FRAME_W, 0.5, LENGTH * 0.7]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>

      {/* wheels */}
      {[-LENGTH / 2 + 0.25, LENGTH / 2 - 0.25].map((zOffset) => (
        <mesh
          key={zOffset}
         
          position={[0, WHEEL_R, zOffset]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.05, 16]} />
          <meshStandardMaterial color="#222" roughness={0.7} />
        </mesh>
      ))}

      {/* handlebars */}
      <mesh position={[0, 0.95, LENGTH / 2 - 0.25]}>
        <boxGeometry args={[0.6, 0.05, 0.05]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* saddle */}
      <mesh position={[0, 0.95, -LENGTH / 2 + 0.35]}>
        <boxGeometry args={[0.18, 0.06, 0.3]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
    </RigidBody>
  )
}
