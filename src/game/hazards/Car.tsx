import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, type RapierRigidBody } from '@react-three/rapier'
import type { MeshStandardMaterial } from 'three'

import { triggerCameraShake } from '../cameraState'
import { CAR_DAMAGE } from '../constants'
import { triggerKnockback } from '../playerImpulse'
import { playerPosition } from '../playerPosition'
import { useGameStore } from '../../state/useGameStore'
import { BLOCK_LENGTH } from '../world/constants'
import { CarBody, CAR_DIMS, type CarShape } from './CarBodies'
import { useHazardContact } from './useHazardContact'

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
  /** Body model. Defaults to the (most common) Tesla sedan. */
  shape?: CarShape
}

/** Half-width of the on-lane hit zone — only a direct frontal impact on
 * the centreline counts. */
const HIT_HALF_X = 0.18

/**
 * A low-poly car (Tesla sedan or microcar) that drives a fixed lane,
 * wrapping at the block ends. Hits the player only on direct frontal
 * impact.
 */
export function Car({
  x,
  startZ = 0,
  direction = 1,
  speed = 7,
  extent = BLOCK_LENGTH / 2,
  color = '#5e8aa8',
  shape = 'tesla',
}: CarProps) {
  const dims = CAR_DIMS[shape]
  const body = useRef<RapierRigidBody>(null)
  const z = useRef(startZ)
  const takeDamage = useGameStore((s) => s.takeDamage)

  const contact = useHazardContact({
    hitHalfX: HIT_HALF_X,
    hitHalfZ: dims.length / 2,
    onHit: () => {
      triggerCameraShake(500, 0.4)
      triggerKnockback(700, 0, 4, direction * 12)
      takeDamage(CAR_DAMAGE, 'car')
    },
  })

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
    body.current.setNextKinematicTranslation({ x, y: 0, z: z.current })

    // tail lights flare while slowing or stopped
    const tail = braking || curSpeed.current < 0.5 ? 1.8 : 0.55
    for (const m of tailMats.current) if (m) m.emissiveIntensity = tail

    if (!playerPosition.ready) return
    contact.update(
      Math.abs(playerPosition.x - x),
      Math.abs(playerPosition.z - z.current),
      performance.now(),
    )
  })

  // body is modelled nose-forward (+Z); flip it when the lane runs -Z
  const yRot = direction === 1 ? 0 : Math.PI

  return (
    <RigidBody
      ref={body}
      name="car"
      type="kinematicPosition"
      colliders={false}
      position={[x, 0, startZ]}
      rotation={[0, yRot, 0]}
      enabledRotations={[false, false, false]}
    >
      <CarBody
        shape={shape}
        color={color}
        registerTailMat={(i, m) => {
          tailMats.current[i] = m
        }}
      />
    </RigidBody>
  )
}
