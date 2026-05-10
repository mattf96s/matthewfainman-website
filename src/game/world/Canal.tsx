import { useRef } from 'react'
import {
  CuboidCollider,
  RigidBody,
  type IntersectionEnterPayload,
} from '@react-three/rapier'

import {
  BLOCK_LENGTH,
  CANAL_DEPTH,
  CANAL_WIDTH,
  COLOR_CANAL,
  X_CANAL,
} from './constants'

interface CanalProps {
  /** z-centre of the bridge (a sensor gap is left around it). */
  bridgeZ?: number
  /** bridge z-width — sensor gap matches. */
  bridgeWidth?: number
}

export function Canal({ bridgeZ = 0, bridgeWidth = 4 }: CanalProps) {
  const cooldown = useRef(0)

  const handleEnter = (e: IntersectionEnterPayload) => {
    if (e.other.rigidBodyObject?.name !== 'player') return
    const now = performance.now()
    if (now - cooldown.current < 1500) return
    cooldown.current = now
    console.log('[canal] player fell in')
  }

  // sensor flanks the bridge so crossing the bridge does not trigger
  const halfBlock = BLOCK_LENGTH / 2
  const halfBridge = bridgeWidth / 2
  const southLen = bridgeZ - halfBridge - -halfBlock
  const northLen = halfBlock - (bridgeZ + halfBridge)
  const southCentre = (-halfBlock + (bridgeZ - halfBridge)) / 2
  const northCentre = (halfBlock + (bridgeZ + halfBridge)) / 2

  return (
    <group>
      <mesh
        receiveShadow
        position={[X_CANAL, -CANAL_DEPTH, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[CANAL_WIDTH, BLOCK_LENGTH]} />
        <meshStandardMaterial
          color={COLOR_CANAL}
          metalness={0.1}
          roughness={0.4}
        />
      </mesh>

      <RigidBody type="fixed" colliders={false} sensor>
        {southLen > 0 && (
          <CuboidCollider
            args={[CANAL_WIDTH / 2, 1.5, southLen / 2]}
            position={[X_CANAL, -0.5, southCentre]}
            onIntersectionEnter={handleEnter}
          />
        )}
        {northLen > 0 && (
          <CuboidCollider
            args={[CANAL_WIDTH / 2, 1.5, northLen / 2]}
            position={[X_CANAL, -0.5, northCentre]}
            onIntersectionEnter={handleEnter}
          />
        )}
      </RigidBody>
    </group>
  )
}
