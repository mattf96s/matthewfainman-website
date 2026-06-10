import { useMemo } from 'react'
import { Instance, Instances } from '@react-three/drei'

import { X_HOUSE_SIDEWALK, X_NEAR_SIDEWALK } from './constants'

interface RackInstance {
  x: number
  z: number
  rotY: number
}

const STAPLE_RADIUS = 0.04
const STAPLE_HEIGHT = 0.7
const STAPLE_WIDTH = 0.7

/**
 * Inverted-U "staple" bike racks clustered in a few spots along the
 * sidewalks. Each rack consists of three staples in a short row.
 */
export function BikeRacks() {
  const positions = useMemo<RackInstance[]>(() => {
    const clusters: Array<[number, number, number]> = [
      [X_NEAR_SIDEWALK, -22, 0],
      [X_NEAR_SIDEWALK, 8, 0],
      [X_HOUSE_SIDEWALK, -14, 0],
      [X_HOUSE_SIDEWALK, 20, 0],
    ]
    const out: RackInstance[] = []
    for (const [x, z, rotY] of clusters) {
      for (let i = -1; i <= 1; i++) {
        out.push({ x, z: z + i * 0.9, rotY })
      }
    }
    return out
  }, [])

  return (
    <group>
      {/* horizontal bar (top of the U) */}
      <Instances limit={positions.length}>
        <cylinderGeometry args={[STAPLE_RADIUS, STAPLE_RADIUS, STAPLE_WIDTH, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.4} />
        {positions.map((p, i) => (
          <Instance
            key={i}
            position={[p.x, STAPLE_HEIGHT, p.z]}
            rotation={[0, 0, Math.PI / 2]}
          />
        ))}
      </Instances>

      {/* left leg */}
      <Instances limit={positions.length}>
        <cylinderGeometry args={[STAPLE_RADIUS, STAPLE_RADIUS, STAPLE_HEIGHT, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.4} />
        {positions.map((p, i) => (
          <Instance
            key={i}
            position={[p.x - STAPLE_WIDTH / 2, STAPLE_HEIGHT / 2, p.z]}
          />
        ))}
      </Instances>

      {/* right leg */}
      <Instances limit={positions.length}>
        <cylinderGeometry args={[STAPLE_RADIUS, STAPLE_RADIUS, STAPLE_HEIGHT, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.4} />
        {positions.map((p, i) => (
          <Instance
            key={i}
            position={[p.x + STAPLE_WIDTH / 2, STAPLE_HEIGHT / 2, p.z]}
          />
        ))}
      </Instances>
    </group>
  )
}
