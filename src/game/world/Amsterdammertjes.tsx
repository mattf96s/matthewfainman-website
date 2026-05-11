import { useMemo } from 'react'
import { Instance, Instances } from '@react-three/drei'

import type { BridgeZone } from './Canal'
import { CANAL_LENGTH, CANAL_WIDTH, X_CANAL } from './constants'

interface AmsterdammertjesProps {
  /** Bridge zones to leave gaps for, so the row doesn't poke through
   * the bridge approach. */
  bridges?: BridgeZone[]
}

const POST_HEIGHT = 0.7
const POST_RADIUS = 0.075
const HEAD_RADIUS = 0.105
const SPACING = 1.9
/** How far the bollard sits back from the canal edge, on the sidewalk. */
const EDGE_OFFSET = 0.42
/** Extra clearance around each bridge so posts don't crowd the approach. */
const BRIDGE_BUFFER = 0.7
const POST_COLOR = '#3a2a1c'

interface PostInstance {
  x: number
  z: number
}

/**
 * Iconic Amsterdam canal-side bollards (Amsterdammertjes) — short
 * bronze-brown posts spaced along both gracht edges, with gaps where
 * the bridges meet the bank.
 */
export function Amsterdammertjes({ bridges = [] }: AmsterdammertjesProps) {
  const positions = useMemo<PostInstance[]>(() => {
    const out: PostInstance[] = []
    const xWest = X_CANAL - CANAL_WIDTH / 2 - EDGE_OFFSET
    const xEast = X_CANAL + CANAL_WIDTH / 2 + EDGE_OFFSET
    const count = Math.floor(CANAL_LENGTH / SPACING)
    const startZ = -((count - 1) * SPACING) / 2
    for (let i = 0; i < count; i++) {
      const z = startZ + i * SPACING
      const inBridge = bridges.some(
        (b) => Math.abs(z - b.z) < b.width / 2 + BRIDGE_BUFFER,
      )
      if (inBridge) continue
      out.push({ x: xWest, z })
      out.push({ x: xEast, z })
    }
    return out
  }, [bridges])

  if (positions.length === 0) return null

  return (
    <>
      <Instances limit={positions.length} castShadow receiveShadow>
        <cylinderGeometry args={[POST_RADIUS, POST_RADIUS, POST_HEIGHT, 10]} />
        <meshStandardMaterial
          color={POST_COLOR}
          roughness={0.55}
          metalness={0.35}
        />
        {positions.map((p, i) => (
          <Instance key={`p-${i}`} position={[p.x, POST_HEIGHT / 2, p.z]} />
        ))}
      </Instances>

      <Instances limit={positions.length} castShadow>
        <sphereGeometry args={[HEAD_RADIUS, 10, 8]} />
        <meshStandardMaterial
          color={POST_COLOR}
          roughness={0.45}
          metalness={0.45}
        />
        {positions.map((p, i) => (
          <Instance key={`h-${i}`} position={[p.x, POST_HEIGHT, p.z]} />
        ))}
      </Instances>
    </>
  )
}
