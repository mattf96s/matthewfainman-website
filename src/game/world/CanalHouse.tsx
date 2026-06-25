import { useMemo } from 'react'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

import { RedLightWindow } from './RedLightWindow'

/** The three canal-house roofline silhouettes Amsterdam is known for:
 * a plain point gable (puntgevel), a stepped one (trapgevel) and a
 * bell-curved one (klokgevel). Picked per-house in HouseRow. */
export type GableShape = 'point' | 'step' | 'bell'

interface CanalHouseProps {
  position: [number, number, number]
  width?: number
  depth?: number
  height?: number
  rotationY?: number
  brick: string
  /** Roofline silhouette. Defaults to the plain point gable. */
  gable?: GableShape
  /** Style the ground-floor windows as red-light district windows. */
  redLight?: boolean
}

/** Builds the 2D gable profile (in the facade plane, y up from the eaves)
 * that gets extruded through the house depth into a roof prism. */
function makeGableShape(gable: GableShape, width: number): THREE.Shape {
  const shape = new THREE.Shape()
  const halfW = width / 2

  if (gable === 'step') {
    // symmetric staircase rising to a small flat crown (trapgevel)
    const steps = 3
    const stepW = 0.6
    const stepH = 0.8
    const left: [number, number][] = [[-halfW, 0]]
    let x = -halfW
    let y = 0
    for (let s = 0; s < steps; s++) {
      y += stepH
      left.push([x, y]) // riser up
      x += stepW
      left.push([x, y]) // tread in
    }
    // mirror the left edge across the centre to descend the right side
    const right = left.map(([px, py]): [number, number] => [-px, py]).reverse()
    const pts = [...left, ...right]
    shape.moveTo(pts[0]![0], pts[0]![1])
    for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i]![0], pts[i]![1])
    shape.closePath()
    return shape
  }

  if (gable === 'bell') {
    // ogee curves swelling out then sweeping to a rounded crown (klokgevel)
    const peak = 2.8
    const topW = 0.5
    shape.moveTo(-halfW, 0)
    shape.lineTo(-halfW, 0.6)
    shape.quadraticCurveTo(-halfW, 1.9, -topW, peak)
    shape.quadraticCurveTo(0, peak + 0.25, topW, peak)
    shape.quadraticCurveTo(halfW, 1.9, halfW, 0.6)
    shape.lineTo(halfW, 0)
    shape.closePath()
    return shape
  }

  // point (puntgevel): a plain triangle
  shape.moveTo(-halfW, 0)
  shape.lineTo(halfW, 0)
  shape.lineTo(0, 2.4)
  shape.closePath()
  return shape
}

/**
 * A narrow brick canal house with a gabled roofline on top — point,
 * stepped or bell, per the `gable` prop. The base sits at y=0 (ground
 * level); the gable rises above. Front of the house is the +Z (local)
 * face; pass rotationY=±π/2 to rotate the facade to face east/west.
 */
export function CanalHouse({
  position,
  width = 5,
  depth = 8,
  height = 9,
  rotationY = 0,
  brick,
  gable = 'point',
  redLight = false,
}: CanalHouseProps) {
  const gableGeometry = useMemo(() => {
    const shape = makeGableShape(gable, width)
    return new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: false,
    })
  }, [width, depth, gable])

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
