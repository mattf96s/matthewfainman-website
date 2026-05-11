import { Text } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'

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
          emissiveIntensity={0.55}
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
          color="#2a3946"
          emissive="#4a5b6a"
          emissiveIntensity={0.35}
          roughness={0.2}
        />
      </mesh>
    </RigidBody>
  )
}
