import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { PLAYER_RADIUS } from '../constants'
import { playerPosition } from '../playerPosition'
import { useGameStore } from '../../state/useGameStore'

interface StroopwafelProps {
  /** World-space XZ to spawn at. */
  x: number
  z: number
  /** Time in seconds before the stroopwafel disappears if uncollected. */
  lifetime: number
  /** Health points restored on pickup. */
  heal: number
  /** Called when the stroopwafel is either eaten or has expired —
   * the parent uses this to schedule the next one. */
  onResolve: () => void
}

/** Hover height above the ground for the disc's resting position. */
const HOVER_Y = 0.55
/** Bounce amplitude — small enough not to wander off the pickup line. */
const BOUNCE_AMP = 0.18
const BOUNCE_HZ = 1.6
const SPIN_RATE = 1.1
/** Pickup radius on XZ — generous, since this is a reward. */
const PICKUP_RADIUS = 0.7

/**
 * A bouncing, slowly spinning stroopwafel. Animates entirely inside
 * the R3F frame loop, vanishes on contact or timeout, and reports
 * either case via `onResolve` to its manager.
 */
export function Stroopwafel({
  x,
  z,
  lifetime,
  heal: healAmount,
  onResolve,
}: StroopwafelProps) {
  const group = useRef<THREE.Group>(null)
  const spawnedAt = useRef(performance.now())
  const resolved = useRef(false)

  const finish = () => {
    if (resolved.current) return
    resolved.current = true
    onResolve()
  }

  useFrame((state) => {
    if (!group.current || resolved.current) return
    const { gameOver, paused, started, heal } = useGameStore.getState()
    if (!started || paused || gameOver) return

    const now = performance.now()
    const aliveMs = now - spawnedAt.current
    if (aliveMs >= lifetime * 1000) {
      group.current.visible = false
      finish()
      return
    }

    const t = state.clock.elapsedTime
    group.current.position.x = x
    group.current.position.z = z
    group.current.position.y =
      HOVER_Y + Math.sin(t * BOUNCE_HZ * Math.PI) * BOUNCE_AMP
    group.current.rotation.y = t * SPIN_RATE

    if (!playerPosition.ready) return
    const dx = playerPosition.x - x
    const dz = playerPosition.z - z
    if (Math.hypot(dx, dz) < PICKUP_RADIUS + PLAYER_RADIUS) {
      heal(healAmount)
      group.current.visible = false
      finish()
    }
  })

  return (
    <group ref={group} position={[x, HOVER_Y, z]}>
      {/* The wafel disc — a short golden cylinder. Slim profile, edge-on
        * silhouette pops as it spins. No shadow: too small to read and
        * one shadow caster × N pickups respawning is wasted work. */}
      <mesh>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 24]} />
        <meshStandardMaterial
          color="#c98a3a"
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>
      {/* darker syrup band peeking out the side */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.22, 0.018, 6, 24]} />
        <meshStandardMaterial color="#5a2a14" roughness={0.7} />
      </mesh>
      {/* a soft glow so it reads against the road from across the
        * street — meshBasicMaterial ignores lighting */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.26, 0.42, 24]} />
        <meshBasicMaterial
          color="#ffd27a"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
