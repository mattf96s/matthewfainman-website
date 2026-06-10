import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'

import { PLAYER_RADIUS } from '../constants'
import { playerPosition } from '../playerPosition'
import { useGameStore } from '../../state/useGameStore'

interface PanadoProps {
  /** World-space XZ to spawn at. */
  x: number
  z: number
  /** Time in seconds before the bottle disappears if uncollected. */
  lifetime: number
  /** Health points restored on pickup. */
  heal: number
  /** Called when the bottle is either taken or has expired —
   * the parent uses this to schedule the next one. */
  onResolve: () => void
}

/** Hover height above the ground for the bottle's resting position. */
const HOVER_Y = 0.55
/** Bounce amplitude — small enough not to wander off the pickup line. */
const BOUNCE_AMP = 0.18
const BOUNCE_HZ = 1.6
const SPIN_RATE = 1.1
/** Pickup radius on XZ — generous, since this is a reward. */
const PICKUP_RADIUS = 0.7

/**
 * Label wrap: white ground with the red Panado wordmark band, drawn twice
 * around the circumference so the name always reads while the bottle
 * spins. Built once on first use and shared across respawns.
 */
let labelTexture: THREE.CanvasTexture | null = null
function getLabelTexture(): THREE.CanvasTexture {
  if (labelTexture) return labelTexture
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#f7f4ee'
  ctx.fillRect(0, 0, 512, 128)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (const x0 of [0, 256]) {
    ctx.fillStyle = '#cf2127'
    ctx.beginPath()
    ctx.roundRect(x0 + 16, 16, 224, 54, 27)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = 'italic 700 40px ui-sans-serif, system-ui, sans-serif'
    ctx.fillText('Panado', x0 + 128, 44)
    ctx.fillStyle = '#cf2127'
    ctx.font = '700 17px ui-sans-serif, system-ui, sans-serif'
    ctx.fillText('paracetamol 500 mg', x0 + 128, 95)
  }
  labelTexture = new THREE.CanvasTexture(canvas)
  labelTexture.colorSpace = THREE.SRGBColorSpace
  labelTexture.anisotropy = 4
  return labelTexture
}

/**
 * A bouncing, slowly spinning Panado bottle — headache relief after a
 * tram to the face. Animates entirely inside the R3F frame loop,
 * vanishes on contact or timeout, and reports either case via
 * `onResolve` to its manager.
 */
export function Panado({
  x,
  z,
  lifetime,
  heal: healAmount,
  onResolve,
}: PanadoProps) {
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
    const { paused, started, health, heal } = useGameStore.getState()
    if (!started || paused || health <= 0) return

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
      {/* White tablet tub. No shadow: too small to read and one shadow
        * caster × N pickups respawning is wasted work. */}
      <mesh>
        <cylinderGeometry args={[0.17, 0.17, 0.36, 20]} />
        <meshStandardMaterial color="#f6f3ec" roughness={0.35} />
      </mesh>
      {/* label wrap — slightly proud of the tub so it never z-fights */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.178, 0.178, 0.26, 20, 1, true]} />
        <meshStandardMaterial map={getLabelTexture()} roughness={0.45} />
      </mesh>
      {/* screw cap */}
      <mesh position={[0, 0.225, 0]}>
        <cylinderGeometry args={[0.142, 0.142, 0.09, 20]} />
        <meshStandardMaterial color="#fbfaf6" roughness={0.3} />
      </mesh>
      {/* a soft glow so it reads against the road from across the
        * street — meshBasicMaterial ignores lighting */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.26, 0.42, 24]} />
        <meshBasicMaterial
          color="#ffb4ae"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* A billboarded green "+" floating above the bottle so it reads
        * unmistakably as a health pickup from any angle / distance. */}
      <Billboard position={[0, 0.75, 0]}>
        <mesh>
          <boxGeometry args={[0.32, 0.1, 0.04]} />
          <meshBasicMaterial color="#3ad06a" />
        </mesh>
        <mesh>
          <boxGeometry args={[0.1, 0.32, 0.04]} />
          <meshBasicMaterial color="#3ad06a" />
        </mesh>
      </Billboard>
    </group>
  )
}
