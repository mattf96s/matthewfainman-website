import { useMemo } from 'react'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

import { RedLightWindow } from './RedLightWindow'

interface CanalHouseProps {
  position: [number, number, number]
  width?: number
  depth?: number
  height?: number
  rotationY?: number
  brick: string
  /** Style the ground-floor windows as red-light district windows. */
  redLight?: boolean
}

/**
 * A narrow brick canal house with a triangular gable on top.
 * The base sits at y=0 (ground level); the gable rises above.
 * Front of the house is the +Z (local) face; pass rotationY=±π/2 to
 * rotate the facade to face the world east/west.
 */
export function CanalHouse({
  position,
  width = 5,
  depth = 8,
  height = 9,
  rotationY = 0,
  brick,
  redLight = false,
}: CanalHouseProps) {
  const gableGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    const halfW = width / 2
    const peakHeight = 2.4
    shape.moveTo(-halfW, 0)
    shape.lineTo(halfW, 0)
    shape.lineTo(0, peakHeight)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: false,
    })
  }, [width, depth])

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

      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={brick} roughness={0.9} />
      </mesh>

      <mesh
        castShadow
        geometry={gableGeometry}
        position={[0, height, -depth / 2]}
      >
        <meshStandardMaterial color={brick} roughness={0.9} />
      </mesh>

      <Windows
        width={width}
        depth={depth}
        height={height}
        redLight={redLight}
      />
    </RigidBody>
  )
}

interface WindowsProps {
  width: number
  depth: number
  height: number
  redLight: boolean
}

function Windows({ width, depth, height, redLight }: WindowsProps) {
  const cols = 2
  const rows = 3
  const winW = width * 0.22
  const winH = height * 0.16
  const marginX = width * 0.15
  const marginYTop = height * 0.14
  const marginYBottom = height * 0.18

  const colSpacing =
    (width - marginX * 2 - winW * cols) / Math.max(cols - 1, 1)
  const rowSpacing =
    (height - marginYTop - marginYBottom - winH * rows) /
    Math.max(rows - 1, 1)

  const zFront = depth / 2 + 0.01

  // ground-floor windows for red-light houses are taller and narrower
  // so each tile reads as a doorway-style cabin
  const redWinH = winH * 1.6
  const redWinW = winW * 0.96

  const tiles: React.ReactNode[] = []
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x =
        -width / 2 + marginX + winW / 2 + c * (winW + colSpacing)
      const y =
        marginYBottom + winH / 2 + r * (winH + rowSpacing)
      const isGround = r === 0
      const key = `${c}-${r}`
      if (redLight && isGround) {
        tiles.push(
          <RedLightWindow
            key={key}
            x={x}
            y={y - (redWinH - winH) / 2}
            width={redWinW}
            height={redWinH}
            zFront={zFront}
            withSilhouette={c === cols - 1}
          />,
        )
      } else {
        tiles.push(
          <mesh key={key} position={[x, y, zFront]}>
            <planeGeometry args={[winW, winH]} />
            <meshStandardMaterial
              color="#26343a"
              emissive="#3a4a52"
              emissiveIntensity={0.15}
              roughness={0.3}
            />
          </mesh>,
        )
      }
    }
  }

  return <group>{tiles}</group>
}
