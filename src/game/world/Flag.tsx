import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type FlagKind = 'nl' | 'amsterdam'

interface FlagProps {
  /** Where the bracket attaches to the wall, world space. */
  position: [number, number, number]
  /** Direction the pole sticks out (Y rotation). 0 → +X; π → -X. */
  rotationY?: number
  kind: FlagKind
  /** How far the pole sticks out from the wall. */
  poleLength?: number
}

const FLAG_W = 1.0
const FLAG_H = 1.7
const POLE_R = 0.045

function makeDutchTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 96
  c.height = 64
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#ae1c28'
  ctx.fillRect(0, 0, 96, 64 / 3)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 64 / 3, 96, 64 / 3)
  ctx.fillStyle = '#21468b'
  ctx.fillRect(0, (64 * 2) / 3, 96, 64 / 3)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeAmsterdamTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 96
  c.height = 64
  const ctx = c.getContext('2d')!

  // red-black-red bands (thin red top + bottom, thick black middle)
  const topH = 16
  const midH = 32
  ctx.fillStyle = '#cc1c2a'
  ctx.fillRect(0, 0, 96, topH)
  ctx.fillStyle = '#141414'
  ctx.fillRect(0, topH, 96, midH)
  ctx.fillStyle = '#cc1c2a'
  ctx.fillRect(0, topH + midH, 96, 64 - (topH + midH))

  // three white saltires (XXX) centred in the black band
  ctx.strokeStyle = '#ffffff'
  ctx.lineCap = 'round'
  ctx.lineWidth = 4
  const cy = topH + midH / 2
  const half = 7
  const xs = [25, 48, 71]
  for (const cx of xs) {
    ctx.beginPath()
    ctx.moveTo(cx - half, cy - half)
    ctx.lineTo(cx + half, cy + half)
    ctx.moveTo(cx - half, cy + half)
    ctx.lineTo(cx + half, cy - half)
    ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

let cachedDutch: THREE.CanvasTexture | null = null
let cachedAmsterdam: THREE.CanvasTexture | null = null
function getTexture(kind: FlagKind) {
  if (kind === 'nl') {
    if (!cachedDutch) cachedDutch = makeDutchTexture()
    return cachedDutch
  }
  if (!cachedAmsterdam) cachedAmsterdam = makeAmsterdamTexture()
  return cachedAmsterdam
}

/**
 * A wall-mounted flag: a small bracket on the building, a horizontal
 * pole sticking out, and a flag hanging vertically from the pole's far
 * end. Gently sways. `position` is the attachment point on the wall;
 * `rotationY` aims the pole away from the wall (0 → +X, π → -X, etc.)
 */
export function Flag({
  position,
  rotationY = 0,
  kind,
  poleLength = 1.4,
}: FlagProps) {
  const flag = useRef<THREE.Group>(null)
  const phase = useRef(Math.random() * Math.PI * 2)
  const texture = useMemo(() => getTexture(kind), [kind])

  useFrame((state) => {
    if (!flag.current) return
    const t = state.clock.elapsedTime * 1.3 + phase.current
    // small sway about the pole axis + a gentle billow
    flag.current.rotation.x = Math.sin(t) * 0.08
    flag.current.rotation.z = Math.sin(t * 0.7) * 0.04
  })

  // flag hangs from the far end of the pole, top edge near the pole
  const flagAnchorX = poleLength - 0.02

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* mounting bracket against the wall */}
      <mesh position={[0.06, 0, 0]}>
        <boxGeometry args={[0.12, 0.22, 0.22]} />
        <meshStandardMaterial color="#161616" roughness={0.7} />
      </mesh>

      {/* horizontal pole along local +X */}
      <mesh
       
        position={[poleLength / 2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[POLE_R, POLE_R, poleLength, 10]} />
        <meshStandardMaterial color="#dadada" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* finial — small gold ball at the far end */}
      <mesh position={[poleLength + 0.06, 0, 0]}>
        <sphereGeometry args={[0.08, 10, 8]} />
        <meshStandardMaterial color="#f4c84d" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* the cloth — hangs from the pole near its far end */}
      <group
        ref={flag}
        position={[flagAnchorX - FLAG_W / 2, -FLAG_H / 2 - 0.05, 0]}
      >
        <mesh>
          <planeGeometry args={[FLAG_W, FLAG_H, 6, 6]} />
          <meshStandardMaterial
            map={texture}
            side={THREE.DoubleSide}
            roughness={0.85}
          />
        </mesh>
      </group>
    </group>
  )
}
