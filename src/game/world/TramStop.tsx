import { Text } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'

interface TramStopProps {
  position: [number, number, number]
  rotationY?: number
}

const SHELTER_W = 4
const SHELTER_D = 1.6
const SHELTER_H = 2.6
const POST_R = 0.06
const ROOF_THICKNESS = 0.08
const BENCH_H = 0.45

/**
 * A simple bus-shelter-style tram stop: roof on four posts, a bench
 * inside, and a glass back panel. A small "Tram" sign sits on a post
 * on the open (road) side.
 */
export function TramStop({ position, rotationY = 0 }: TramStopProps) {
  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={position}
      rotation={[0, rotationY, 0]}
    >
      <CuboidCollider
        args={[SHELTER_W / 2, SHELTER_H / 2, SHELTER_D / 2]}
        position={[0, SHELTER_H / 2, 0]}
      />

      {/* four corner posts */}
      {[
        [-SHELTER_W / 2, -SHELTER_D / 2],
        [SHELTER_W / 2, -SHELTER_D / 2],
        [-SHELTER_W / 2, SHELTER_D / 2],
        [SHELTER_W / 2, SHELTER_D / 2],
      ].map(([dx, dz]) => (
        <mesh
          key={`${dx},${dz}`}
          castShadow
          position={[dx, SHELTER_H / 2, dz]}
        >
          <cylinderGeometry args={[POST_R, POST_R, SHELTER_H, 8]} />
          <meshStandardMaterial color="#262626" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}

      {/* roof */}
      <mesh
        castShadow
        receiveShadow
        position={[0, SHELTER_H + ROOF_THICKNESS / 2, 0]}
      >
        <boxGeometry args={[SHELTER_W + 0.2, ROOF_THICKNESS, SHELTER_D + 0.2]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {/* glass back panel — translucent dark */}
      <mesh position={[0, SHELTER_H / 2, -SHELTER_D / 2]}>
        <planeGeometry args={[SHELTER_W, SHELTER_H - 0.1]} />
        <meshStandardMaterial
          color="#3a4a55"
          transparent
          opacity={0.45}
          roughness={0.1}
        />
      </mesh>

      {/* bench */}
      <mesh castShadow position={[0, BENCH_H, -SHELTER_D / 2 + 0.25]}>
        <boxGeometry args={[SHELTER_W * 0.85, 0.08, 0.4]} />
        <meshStandardMaterial color="#3b2a1f" roughness={0.85} />
      </mesh>
      {/* bench legs */}
      {[-SHELTER_W * 0.35, SHELTER_W * 0.35].map((dx) => (
        <mesh
          key={dx}
          castShadow
          position={[dx, BENCH_H / 2, -SHELTER_D / 2 + 0.25]}
        >
          <boxGeometry args={[0.08, BENCH_H, 0.32]} />
          <meshStandardMaterial color="#202020" />
        </mesh>
      ))}

      {/* sign — a rectangle hanging from the front-right post */}
      <mesh
        castShadow
        position={[SHELTER_W / 2 - 0.05, SHELTER_H * 0.85, SHELTER_D / 2 + 0.04]}
      >
        <boxGeometry args={[0.9, 0.45, 0.05]} />
        <meshStandardMaterial
          color="#003c8a"
          emissive="#0a4dff"
          emissiveIntensity={0.3}
        />
      </mesh>
      <Text
        position={[
          SHELTER_W / 2 - 0.05,
          SHELTER_H * 0.85,
          SHELTER_D / 2 + 0.075,
        ]}
        fontSize={0.22}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#001a3a"
      >
        TRAM
      </Text>
    </RigidBody>
  )
}
