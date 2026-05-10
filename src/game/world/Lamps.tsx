import { useMemo } from 'react'
import { Instance, Instances } from '@react-three/drei'

import {
  BLOCK_LENGTH,
  X_HOUSE_SIDEWALK,
  X_NEAR_SIDEWALK,
} from './constants'

const LAMP_SPACING = 12
const LAMP_HEIGHT = 4.5
const LAMP_BULB_OFFSET = 0.4

interface LampInstance {
  x: number
  z: number
}

/**
 * Two rows of instanced lamp posts — one on the canal-side sidewalk and
 * one on the house-side sidewalk. The Drei <Instances> wrapper keeps the
 * draw call count to two (one per material) regardless of count.
 */
export function Lamps() {
  const positions = useMemo<LampInstance[]>(() => {
    const out: LampInstance[] = []
    const count = Math.floor(BLOCK_LENGTH / LAMP_SPACING)
    const startZ = -((count - 1) * LAMP_SPACING) / 2
    for (let i = 0; i < count; i++) {
      const z = startZ + i * LAMP_SPACING
      out.push({ x: X_NEAR_SIDEWALK, z })
      out.push({ x: X_HOUSE_SIDEWALK, z })
    }
    return out
  }, [])

  return (
    <>
      {/* poles — thin tall cylinders */}
      <Instances limit={positions.length} castShadow>
        <cylinderGeometry args={[0.06, 0.06, LAMP_HEIGHT, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        {positions.map((p, i) => (
          <Instance key={i} position={[p.x, LAMP_HEIGHT / 2, p.z]} />
        ))}
      </Instances>

      {/* glowing bulbs */}
      <Instances limit={positions.length}>
        <sphereGeometry args={[0.18, 10, 8]} />
        <meshStandardMaterial
          color="#fff1c2"
          emissive="#ffd17a"
          emissiveIntensity={1.2}
        />
        {positions.map((p, i) => (
          <Instance
            key={i}
            position={[p.x, LAMP_HEIGHT + LAMP_BULB_OFFSET, p.z]}
          />
        ))}
      </Instances>
    </>
  )
}
