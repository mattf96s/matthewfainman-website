import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  CuboidCollider,
  RigidBody,
  type IntersectionEnterPayload,
  type RapierRigidBody,
} from '@react-three/rapier'

import { triggerCameraShake } from '../cameraState'
import { useGameStore } from '../../state/useGameStore'

interface CarProps {
  /** X position of the lane centreline. */
  x: number
  /** Initial Z. */
  startZ?: number
  /** Travel direction along Z. */
  direction?: 1 | -1
  /** Cruise speed, m/s. */
  speed?: number
  /** Z extent — wraps from -extent to +extent. */
  extent?: number
  /** Body colour. */
  color?: string
}

const CAR_W = 1.8
const CAR_L = 4.4
const CAR_H = 1.4
const HIT_HALF_X = 0.18

/**
 * A simple low-poly car that drives a fixed lane, wrapping at the
 * block ends. Hits the player only on direct frontal impact.
 */
export function Car({
  x,
  startZ = 0,
  direction = 1,
  speed = 7,
  extent = 30,
  color = '#5e8aa8',
}: CarProps) {
  const body = useRef<RapierRigidBody>(null)
  const z = useRef(startZ)
  const cooldown = useRef(0)
  const endGame = useGameStore((s) => s.endGame)

  useFrame((_, delta) => {
    if (!body.current) return
    if (useGameStore.getState().gameOver) return
    z.current += direction * speed * delta
    const span = extent * 2
    if (z.current > extent) z.current -= span
    else if (z.current < -extent) z.current += span
    body.current.setNextKinematicTranslation({
      x,
      y: CAR_H / 2 + 0.05,
      z: z.current,
    })
  })

  const onHit = (e: IntersectionEnterPayload) => {
    if (e.other.rigidBodyObject?.name !== 'player') return
    if (useGameStore.getState().gameOver) return
    const now = performance.now()
    if (now - cooldown.current < 1500) return
    cooldown.current = now
    triggerCameraShake(500, 0.4)
    endGame('car')
  }

  // tram nose faces +Z when direction=1; flip the body so the headlights
  // point the right way when going -Z
  const yRot = direction === 1 ? 0 : Math.PI

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[x, CAR_H / 2 + 0.05, startZ]}
      rotation={[0, yRot, 0]}
      enabledRotations={[false, false, false]}
    >
      <CuboidCollider
        args={[HIT_HALF_X, CAR_H / 2, CAR_L / 2]}
        sensor
        onIntersectionEnter={onHit}
      />

      {/* main body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[CAR_W, CAR_H * 0.55, CAR_L]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.3} />
      </mesh>

      {/* cabin / roof — smaller box on top, set back slightly */}
      <mesh castShadow position={[0, CAR_H * 0.4, -0.1]}>
        <boxGeometry args={[CAR_W * 0.92, CAR_H * 0.45, CAR_L * 0.55]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.25} />
      </mesh>

      {/* windshield */}
      <mesh position={[0, CAR_H * 0.4, CAR_L * 0.275 - 0.1]}>
        <planeGeometry args={[CAR_W * 0.85, CAR_H * 0.4]} />
        <meshStandardMaterial color="#1f2a35" roughness={0.2} metalness={0.5} />
      </mesh>
      {/* rear window */}
      <mesh
        position={[0, CAR_H * 0.4, -CAR_L * 0.275 - 0.1]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[CAR_W * 0.85, CAR_H * 0.4]} />
        <meshStandardMaterial color="#1f2a35" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* side windows */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[(CAR_W / 2 + 0.001) * side, CAR_H * 0.4, -0.1]}
          rotation={[0, side > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          <planeGeometry args={[CAR_L * 0.4, CAR_H * 0.32]} />
          <meshStandardMaterial color="#1f2a35" roughness={0.2} metalness={0.5} />
        </mesh>
      ))}

      {/* wheels */}
      {[
        [-CAR_W / 2, CAR_L / 2 - 0.6],
        [CAR_W / 2, CAR_L / 2 - 0.6],
        [-CAR_W / 2, -CAR_L / 2 + 0.6],
        [CAR_W / 2, -CAR_L / 2 + 0.6],
      ].map(([wx, wz]) => (
        <mesh
          key={`${wx},${wz}`}
          castShadow
          position={[wx, -CAR_H * 0.25, wz]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.3, 0.3, 0.18, 12]} />
          <meshStandardMaterial color="#0e0e0e" roughness={0.85} />
        </mesh>
      ))}

      {/* headlights (front +Z) */}
      {[-CAR_W * 0.3, CAR_W * 0.3].map((wx) => (
        <mesh key={wx} position={[wx, 0, CAR_L / 2 + 0.01]}>
          <planeGeometry args={[0.35, 0.18]} />
          <meshStandardMaterial
            color="#fff4c2"
            emissive="#fff4c2"
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
      {/* tail lights (rear -Z) */}
      {[-CAR_W * 0.3, CAR_W * 0.3].map((wx) => (
        <mesh
          key={`tail-${wx}`}
          position={[wx, 0, -CAR_L / 2 - 0.01]}
          rotation={[0, Math.PI, 0]}
        >
          <planeGeometry args={[0.35, 0.18]} />
          <meshStandardMaterial
            color="#d63333"
            emissive="#d63333"
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </RigidBody>
  )
}
