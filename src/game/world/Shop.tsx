import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

export type ShopBrand =
  | 'ah'
  | 'febo'
  | 'action'
  | 'coffeeshop'
  | 'doner'
  | 'nightshop'

interface BrandConfig {
  label: string
  wall: string
  facade: string
  signBg: string
  signGlow: string
  signText: string
  /** Font size multiplier — short names get a bigger size. */
  fontScale?: number
  /** Sign emissive strength. Defaults to a soft glow; bump for full neon. */
  signGlowIntensity?: number
  /** Shop-window glass tint + interior glow. Defaults to a cool daytime
   * pane; warm it for a cosy lit interior. */
  windowColor?: string
  windowGlow?: string
}

const SHOPS: Record<ShopBrand, BrandConfig> = {
  ah: {
    label: 'Albert Heijn',
    wall: '#eef0f3',
    facade: '#f5f6f7',
    signBg: '#0a4dff',
    signGlow: '#0a4dff',
    signText: '#ffffff',
    fontScale: 0.6,
  },
  febo: {
    label: 'FEBO',
    wall: '#f6d340',
    facade: '#ffd820',
    signBg: '#d61a2b',
    signGlow: '#ff2030',
    signText: '#ffffff',
    fontScale: 0.9,
  },
  action: {
    label: 'Action',
    wall: '#1a3da8',
    facade: '#1f4ac2',
    signBg: '#0e2877',
    signGlow: '#1d3fa8',
    signText: '#ffd200',
    fontScale: 0.8,
  },
  coffeeshop: {
    label: 'Coffeeshop',
    wall: '#1f2e1a',
    facade: '#28401f',
    signBg: '#0a160a',
    signGlow: '#39e600',
    signText: '#bff58d',
    fontScale: 0.55,
    signGlowIntensity: 1.15,
    windowColor: '#241a0e',
    windowGlow: '#d29a3c',
  },
  doner: {
    label: 'Döner',
    wall: '#6b3a1f',
    facade: '#8a4f2c',
    signBg: '#9a1e22',
    signGlow: '#ff5040',
    signText: '#ffd966',
    fontScale: 0.8,
  },
  nightshop: {
    label: 'Nightshop',
    wall: '#5d5d5a',
    facade: '#76766f',
    signBg: '#1a1a1a',
    signGlow: '#ffd95a',
    signText: '#ffe06a',
    fontScale: 0.6,
  },
}

interface ShopProps {
  position: [number, number, number]
  /** Y rotation. Default 0 makes the facade face +Z. */
  rotationY?: number
  brand: ShopBrand
  width?: number
  depth?: number
  height?: number
}

/**
 * A single-storey shop building with a branded facade. Facade is the
 * local +Z face — rotate via `rotationY` to face other directions.
 */
export function Shop({
  position,
  rotationY = 0,
  brand,
  width = 5.5,
  depth = 5,
  height = 4.2,
}: ShopProps) {
  const cfg = SHOPS[brand]
  const front = depth / 2 + 0.005
  const signH = 0.9
  const signY = height - signH / 2 - 0.15

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={position}
      rotation={[0, rotationY, 0]}
    >
      <CuboidCollider
        args={[width / 2, height / 2, depth / 2]}
        position={[0, height / 2, 0]}
      />

      {/* body */}
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={cfg.wall} roughness={0.85} />
      </mesh>

      {/* facade panel — slightly proud of the front wall */}
      <mesh position={[0, height / 2, front]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={cfg.facade} roughness={0.7} />
      </mesh>

      {/* sign banner */}
      <mesh position={[0, signY, front + 0.01]}>
        <planeGeometry args={[width * 0.92, signH]} />
        <meshStandardMaterial
          color={cfg.signBg}
          emissive={cfg.signGlow}
          emissiveIntensity={cfg.signGlowIntensity ?? 0.55}
          roughness={0.4}
        />
      </mesh>

      <Text
        position={[0, signY, front + 0.02]}
        fontSize={signH * (cfg.fontScale ?? 0.7)}
        color={cfg.signText}
        anchorX="center"
        anchorY="middle"
        maxWidth={width * 0.88}
        outlineWidth={0.01}
        outlineColor="#000"
      >
        {cfg.label}
      </Text>

      {/* door — dark rectangle low-centre */}
      <mesh position={[-width * 0.18, 1.1, front + 0.01]}>
        <planeGeometry args={[1.0, 2.2]} />
        <meshStandardMaterial
          color="#1a1612"
          emissive="#3a2e22"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* shop window — large pane to the right of the door */}
      <mesh position={[width * 0.22, 1.6, front + 0.01]}>
        <planeGeometry args={[width * 0.45, 2.1]} />
        <meshStandardMaterial
          color={cfg.windowColor ?? '#2a3946'}
          emissive={cfg.windowGlow ?? '#4a5b6a'}
          emissiveIntensity={0.35}
          roughness={0.2}
        />
      </mesh>

      {brand === 'coffeeshop' && (
        <CoffeeshopDetails width={width} height={height} front={front} />
      )}
    </RigidBody>
  )
}

// A stylised 7-leaflet cannabis leaf, normalised to roughly a 1-unit span
// and centred on its base. Cached once — every coffeeshop reuses it.
function buildLeafShape(): THREE.Shape {
  const s = new THREE.Shape()
  // tip angle (deg from +X) and length, ordered left → right so the
  // outline traces continuously across the top; symmetric about 90°
  const tips = [
    { a: 166, len: 0.18 },
    { a: 144, len: 0.3 },
    { a: 118, len: 0.42 },
    { a: 90, len: 0.52 },
    { a: 62, len: 0.42 },
    { a: 36, len: 0.3 },
    { a: 14, len: 0.18 },
  ]
  const notchR = 0.07
  const baseY = -0.12
  s.moveTo(0, baseY)
  for (let i = 0; i < tips.length; i++) {
    const { a, len } = tips[i]!
    const r = (a * Math.PI) / 180
    s.lineTo(Math.cos(r) * len, Math.sin(r) * len)
    const next = tips[i + 1]
    if (next) {
      const mid = (((a + next.a) / 2) * Math.PI) / 180
      s.lineTo(Math.cos(mid) * notchR, Math.sin(mid) * notchR)
    }
  }
  s.lineTo(0, baseY)
  s.closePath()
  return s
}

let cachedLeafGeometry: THREE.ShapeGeometry | null = null
function getLeafGeometry(): THREE.ShapeGeometry {
  if (!cachedLeafGeometry) cachedLeafGeometry = new THREE.ShapeGeometry(buildLeafShape())
  return cachedLeafGeometry
}

const LEAF_GREEN = '#2a4a18'
const LEAF_GREEN_EMIT = '#46e21a'

/** Coffeeshop-only flourishes layered over the generic shop facade: a
 * projecting neon blade sign with a leaf emblem, a rasta accent stripe,
 * and a leaf on the facade — the dense warm signage of a Wallen side
 * street, kept playful. */
function CoffeeshopDetails({
  width,
  height,
  front,
}: {
  width: number
  height: number
  front: number
}) {
  const leaf = useMemo(() => getLeafGeometry(), [])

  // projecting "blade" sign hung high on the left, sticking toward the
  // street so it reads from along the pavement
  const bladeOut = 1.1
  const bladeX = -width * 0.34
  const bladeY = height - 1.0

  return (
    <group>
      {/* rasta accent stripe just under the main sign */}
      {[
        { c: '#1f9e2a', y: 0 },
        { c: '#f2c014', y: 0.07 },
        { c: '#e2241a', y: 0.14 },
      ].map((band) => (
        <mesh
          key={band.c}
          position={[0, height - 0.95 - band.y, front + 0.012]}
        >
          <planeGeometry args={[width * 0.92, 0.07]} />
          <meshStandardMaterial
            color={band.c}
            emissive={band.c}
            emissiveIntensity={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* leaf emblem on the facade between sign and door */}
      <mesh
        geometry={leaf}
        position={[width * 0.04, height * 0.5, front + 0.015]}
        scale={[1.5, 1.5, 1]}
      >
        <meshStandardMaterial
          color={LEAF_GREEN}
          emissive={LEAF_GREEN_EMIT}
          emissiveIntensity={0.9}
          roughness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* projecting blade sign body */}
      <mesh position={[bladeX, bladeY, front + bladeOut / 2]}>
        <boxGeometry args={[0.08, 0.62, bladeOut]} />
        <meshStandardMaterial
          color="#06120a"
          emissive={LEAF_GREEN_EMIT}
          emissiveIntensity={0.55}
          roughness={0.4}
        />
      </mesh>
      {/* a leaf on each face of the blade so it reads from both directions */}
      {[1, -1].map((s) => (
        <mesh
          key={s}
          geometry={leaf}
          position={[bladeX + s * 0.05, bladeY, front + bladeOut / 2]}
          rotation={[0, (s * Math.PI) / 2, 0]}
          scale={[0.7, 0.7, 1]}
        >
          <meshStandardMaterial
            color={LEAF_GREEN}
            emissive={LEAF_GREEN_EMIT}
            emissiveIntensity={1.1}
            roughness={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
