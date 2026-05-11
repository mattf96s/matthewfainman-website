import { useRef } from 'react'
import {
  CuboidCollider,
  RigidBody,
  type IntersectionEnterPayload,
} from '@react-three/rapier'

import { useGameStore } from '../../state/useGameStore'
import {
  CANAL_DEPTH,
  CANAL_LENGTH,
  CANAL_WIDTH,
  COLOR_CANAL,
  X_CANAL,
} from './constants'

export interface BridgeZone {
  /** Centre z of the bridge. */
  z: number
  /** Z-axis width of the bridge. */
  width: number
}

interface CanalProps {
  /** Bridges to leave gaps for in the fall-in sensor. */
  bridges?: BridgeZone[]
}

/**
 * Renders the canal water surface and a series of fall-in sensor
 * segments that skip the bridge zones (so crossing on a bridge doesn't
 * trigger a fall).
 */
export function Canal({ bridges = [] }: CanalProps) {
  const cooldown = useRef(0)

  const handleEnter = (e: IntersectionEnterPayload) => {
    if (e.other.rigidBodyObject?.name !== 'player') return
    if (useGameStore.getState().gameOver) return
    const now = performance.now()
    if (now - cooldown.current < 1500) return
    cooldown.current = now
    useGameStore.getState().endGame('canal')
  }

  // segment the sensor around the bridge zones
  const halfLen = CANAL_LENGTH / 2
  const sorted = [...bridges].sort((a, b) => a.z - b.z)
  const segments: Array<{ centre: number; len: number }> = []
  let cursor = -halfLen
  for (const b of sorted) {
    const bStart = b.z - b.width / 2
    const bEnd = b.z + b.width / 2
    if (bStart > cursor) {
      segments.push({
        centre: (cursor + bStart) / 2,
        len: bStart - cursor,
      })
    }
    cursor = Math.max(cursor, bEnd)
  }
  if (cursor < halfLen) {
    segments.push({
      centre: (cursor + halfLen) / 2,
      len: halfLen - cursor,
    })
  }

  return (
    <group>
      <mesh
        receiveShadow
        position={[X_CANAL, -CANAL_DEPTH, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[CANAL_WIDTH, CANAL_LENGTH]} />
        <meshStandardMaterial
          color={COLOR_CANAL}
          metalness={0.1}
          roughness={0.4}
        />
      </mesh>

      <RigidBody type="fixed" colliders={false} sensor>
        {segments.map((seg, i) => (
          <CuboidCollider
            key={i}
            args={[CANAL_WIDTH / 2, 1.5, seg.len / 2]}
            position={[X_CANAL, -0.5, seg.centre]}
            onIntersectionEnter={handleEnter}
          />
        ))}
      </RigidBody>
    </group>
  )
}
