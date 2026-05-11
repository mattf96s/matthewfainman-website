import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type FlagKind = 'nl' | 'amsterdam'

interface FlagProps {
  position: [number, number]
  kind: FlagKind
  /** Pole height; flag hangs near the top. */
  poleHeight?: number
  /** Direction the flag flies out from the pole. */
  rotationY?: number
}

const FLAG_W = 1.6
const FLAG_H = 1.0
const POLE_R = 0.05

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

  // red-black-red horizontal stripes (the red bands top + bottom are thinner)
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
 * A flagpole with a flag hanging at the top. Flag plane gently
 * waves on Y by oscillating its rotation.
 */
export function Flag({
  position: [x, z],
  kind,
  poleHeight = 5,
  rotationY = 0,
}: FlagProps) {
  const flag = useRef<THREE.Group>(null)
  const phase = useRef(Math.random() * Math.PI * 2)
  const texture = useMemo(() => getTexture(kind), [kind])

  useFrame((state) => {
    if (!flag.current) return
    const t = state.clock.elapsedTime * 1.5 + phase.current
    flag.current.rotation.y = Math.sin(t) * 0.1
    flag.current.rotation.z = Math.sin(t * 0.7) * 0.04
  })

  const flagHangY = poleHeight - 0.1

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      {/* pole */}
      <mesh castShadow position={[0, poleHeight / 2, 0]}>
        <cylinderGeometry args={[POLE_R, POLE_R, poleHeight, 8]} />
        <meshStandardMaterial color="#dadada" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* finial */}
      <mesh castShadow position={[0, poleHeight + 0.06, 0]}>
        <sphereGeometry args={[0.08, 10, 8]} />
        <meshStandardMaterial color="#f4c84d" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* flag — positioned so its top-left attaches near the pole top */}
      <group ref={flag} position={[FLAG_W / 2 + POLE_R, flagHangY - FLAG_H / 2, 0]}>
        <mesh castShadow>
          <planeGeometry args={[FLAG_W, FLAG_H, 8, 1]} />
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
