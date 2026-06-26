import { Text } from '@react-three/drei'

import { MEDIAN_WIDTH, TRAM_STOP_Z, X_MEDIAN_WEST } from './constants'

/**
 * A centre-platform tram stop on the west median: a glass shelter with a
 * bench, a GVB line sign on a pole, and a yellow safety edge along the
 * rail side — the Amsterdam halte read. Decorative; it sits on the
 * already-collidable raised median, so no collider of its own.
 *
 * Local +X points east (toward the tram lane), so the shelter backs onto
 * the car lane and opens toward the tram; +Z is north.
 */
export function TramStop() {
  // median surface sits a touch proud of the road (see Street MEDIAN_LIFT)
  const half = MEDIAN_WIDTH / 2

  return (
    <group position={[X_MEDIAN_WEST, 0.12, TRAM_STOP_Z]}>
      {/* yellow tactile safety strip along the rail-side platform edge */}
      <mesh position={[half - 0.12, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.18, 8]} />
        <meshStandardMaterial color="#e8c33a" roughness={0.7} />
      </mesh>

      {/* shelter posts */}
      {[
        [-0.9, -1.9],
        [-0.1, -1.9],
        [-0.9, 1.9],
        [-0.1, 1.9],
      ].map(([px, pz]) => (
        <mesh key={`${px},${pz}`} position={[px, 1.1, pz]} castShadow>
          <boxGeometry args={[0.08, 2.2, 0.08]} />
          <meshStandardMaterial color="#2b2e30" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}

      {/* flat shelter roof */}
      <mesh position={[-0.5, 2.26, 0]} castShadow>
        <boxGeometry args={[1.15, 0.08, 4.3]} />
        <meshStandardMaterial color="#34383a" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* glass back wall (faces the tram) */}
      <mesh position={[-0.93, 1.16, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4.0, 1.9]} />
        <meshStandardMaterial
          color="#a9c2cf"
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.22}
        />
      </mesh>

      {/* bench: seat + backrest */}
      <mesh position={[-0.45, 0.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.08, 2.4]} />
        <meshStandardMaterial color="#5a5a54" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[-0.78, 0.78, 0]} castShadow>
        <boxGeometry args={[0.08, 0.46, 2.4]} />
        <meshStandardMaterial color="#5a5a54" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* line sign on a pole at the south end, facing along the street */}
      <mesh position={[0.6, 1.3, -2.7]} castShadow>
        <boxGeometry args={[0.07, 2.6, 0.07]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0.6, 2.32, -2.7]}>
        <boxGeometry args={[0.62, 0.62, 0.05]} />
        <meshStandardMaterial color="#13327a" roughness={0.5} />
      </mesh>
      {[1, -1].map((s) => (
        <Text
          key={s}
          position={[0.6, 2.32, -2.7 + s * 0.031]}
          rotation={[0, s === 1 ? 0 : Math.PI, 0]}
          fontSize={0.42}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          5
        </Text>
      ))}
    </group>
  )
}
