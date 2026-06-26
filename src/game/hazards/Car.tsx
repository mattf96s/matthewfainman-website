import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, type RapierRigidBody } from '@react-three/rapier'
import type { MeshStandardMaterial } from 'three'

import { triggerCameraShake } from '../cameraState'
import { CAR_DAMAGE, PLAYER_RADIUS } from '../constants'
import { triggerKnockback } from '../playerImpulse'
import { playerPosition } from '../playerPosition'
import { useGameStore } from '../../state/useGameStore'
import { BLOCK_LENGTH } from '../world/constants'

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
  extent = BLOCK_LENGTH / 2,
  color = '#5e8aa8',
}: CarProps) {
  const body = useRef<RapierRigidBody>(null)
  const z = useRef(startZ)
  const cooldown = useRef(0)
  const hitInside = useRef(false)
  const takeDamage = useGameStore((s) => s.takeDamage)

  // stop-and-go state — each car drifts its own speed and occasionally
  // halts, so traffic clumps and gaps unpredictably. Randomised start
  // phase keeps the cars from pulsing in unison.
  const curSpeed = useRef(speed * 0.6)
  const targetSpeed = useRef(speed)
  const phaseTime = useRef(Math.random() * 2.5)
  const tailMats = useRef<(MeshStandardMaterial | null)[]>([null, null])

  useFrame((_, delta) => {
    if (!body.current) return

    phaseTime.current -= delta
    if (phaseTime.current <= 0) {
      if (Math.random() < 0.16) {
        targetSpeed.current = 0 // brief halt: light, jam, hesitation
        phaseTime.current = 0.7 + Math.random() * 2.2
      } else {
        targetSpeed.current = speed * (0.45 + Math.random() * 0.95)
        phaseTime.current = 1.5 + Math.random() * 3.5
      }
    }
    const braking = targetSpeed.current < curSpeed.current - 0.15
    // brake harder than you accelerate
    const rate = braking ? 6 : 2.2
    curSpeed.current +=
      (targetSpeed.current - curSpeed.current) * Math.min(1, delta * rate)

    z.current += direction * curSpeed.current * delta
    const span = extent * 2
    if (z.current > extent) z.current -= span
    else if (z.current < -extent) z.current += span
    body.current.setNextKinematicTranslation({
      x,
      y: CAR_H / 2 + 0.05,
      z: z.current,
    })

    // tail lights flare while slowing or stopped
    const tail = braking || curSpeed.current < 0.5 ? 1.8 : 0.55
    for (const m of tailMats.current) if (m) m.emissiveIntensity = tail

    if (!playerPosition.ready) return

    // Manual AABB hit detection — Rapier sensor events don't fire
    // reliably for the kinematic-character-controlled player.
    const dx = Math.abs(playerPosition.x - x)
    const dz = Math.abs(playerPosition.z - z.current)
    const inHit =
      dx < HIT_HALF_X + PLAYER_RADIUS &&
      dz < CAR_L / 2 + PLAYER_RADIUS
    if (inHit) {
      const now = performance.now()
      if (!hitInside.current && now - cooldown.current >= 1500) {
        hitInside.current = true
        cooldown.current = now
        triggerCameraShake(500, 0.4)
        triggerKnockback(700, 0, 4, direction * 12)
        takeDamage(CAR_DAMAGE, 'car')
      }
    } else {
      hitInside.current = false
    }
  })

  // tram nose faces +Z when direction=1; flip the body so the headlights
  // point the right way when going -Z
  const yRot = direction === 1 ? 0 : Math.PI

  return (
    <RigidBody
      ref={body}
      name="car"
      type="kinematicPosition"
      colliders={false}
      position={[x, CAR_H / 2 + 0.05, startZ]}
      rotation={[0, yRot, 0]}
      enabledRotations={[false, false, false]}
    >
      {/* main body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[CAR_W, CAR_H * 0.55, CAR_L]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.3} />
      </mesh>

      {/* cabin / roof — smaller box on top, set back slightly */}
      <mesh position={[0, CAR_H * 0.4, -0.1]}>
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
      {/* tail lights (rear -Z) — emissive ramps up under braking */}
      {[-CAR_W * 0.3, CAR_W * 0.3].map((wx, i) => (
        <mesh
          key={`tail-${wx}`}
          position={[wx, 0, -CAR_L / 2 - 0.01]}
          rotation={[0, Math.PI, 0]}
        >
          <planeGeometry args={[0.35, 0.18]} />
          <meshStandardMaterial
            ref={(m) => {
              tailMats.current[i] = m
            }}
            color="#d63333"
            emissive="#d63333"
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </RigidBody>
  )
}
