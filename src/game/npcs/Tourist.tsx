import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

import {
  KNOCKDOWN_HALF_Y,
  KNOCKDOWN_ROTATION_X,
  KNOCKDOWN_Y,
  useCarKnockdown,
} from './useCarKnockdown'

interface TouristProps {
  position: [number, number, number]
  shirt: string
  trousers?: string
  skin?: string
  hasBackpack?: boolean
  hasHat?: boolean
  /** Phase offset for the walking bob, radians. */
  phase?: number
}

const HIT_HALF_X = 0.3
const HIT_HALF_Z = 0.3

/**
 * A single low-poly tourist — capsule body, sphere head, optional
 * accessories. Bobs lightly on Y to suggest walking. Carries a
 * kinematic sensor so a passing car can knock them down.
 */
export function Tourist({
  position,
  shirt,
  trousers = '#262626',
  skin = '#d8a37a',
  hasBackpack = false,
  hasHat = false,
  phase = 0,
}: TouristProps) {
  const visual = useRef<THREE.Group>(null)
  // reusable so we don't allocate a Vector3 per frame
  const worldPos = useRef(new THREE.Vector3())
  const { hit, sensorBody, onHit } = useCarKnockdown()

  useFrame((state) => {
    if (!visual.current) return
    if (hit.current) {
      // collapse: lie face-down on the sidewalk
      visual.current.rotation.x = KNOCKDOWN_ROTATION_X
      visual.current.position.y = KNOCKDOWN_Y
    } else {
      const t = state.clock.elapsedTime * 4 + phase
      visual.current.position.y = position[1] + Math.abs(Math.sin(t)) * 0.06
    }
    // keep the sensor at the tourist's current world position regardless
    // of the moving parent group transform
    if (sensorBody.current) {
      visual.current.getWorldPosition(worldPos.current)
      sensorBody.current.setNextKinematicTranslation({
        x: worldPos.current.x,
        y: KNOCKDOWN_HALF_Y,
        z: worldPos.current.z,
      })
    }
  })

  return (
    <>
      <RigidBody
        ref={sensorBody}
        type="kinematicPosition"
        colliders={false}
        position={position}
      >
        <CuboidCollider
          args={[HIT_HALF_X, KNOCKDOWN_HALF_Y, HIT_HALF_Z]}
          sensor
          onIntersectionEnter={onHit}
        />
      </RigidBody>

      <group ref={visual} position={position}>
        {/* trousers */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <capsuleGeometry args={[0.22, 0.55, 4, 8]} />
          <meshStandardMaterial color={trousers} roughness={0.8} />
        </mesh>
        {/* shirt */}
        <mesh position={[0, 1.1, 0]}>
          <capsuleGeometry args={[0.24, 0.45, 4, 8]} />
          <meshStandardMaterial color={shirt} roughness={0.85} />
        </mesh>
        {/* head */}
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.2, 12, 10]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>

        {hasHat && (
          <mesh position={[0, 1.78, 0.04]}>
            <cylinderGeometry args={[0.22, 0.22, 0.12, 12]} />
            <meshStandardMaterial color="#222" roughness={0.7} />
          </mesh>
        )}

        {hasBackpack && (
          <mesh position={[0, 1.05, -0.3]}>
            <boxGeometry args={[0.38, 0.45, 0.22]} />
            <meshStandardMaterial color="#3a2818" roughness={0.85} />
          </mesh>
        )}
      </group>
    </>
  )
}
