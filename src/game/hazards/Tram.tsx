import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  CuboidCollider,
  RigidBody,
  type IntersectionEnterPayload,
  type RapierRigidBody,
} from '@react-three/rapier'

import { useGameStore } from '../../state/useGameStore'
import { BLOCK_LENGTH, X_ROAD } from '../world/constants'

const TRAM_LENGTH = 14
const TRAM_WIDTH = 2.4
const TRAM_HEIGHT = 3.0
const TRAM_SPEED = 11
const TRAM_GVB_BLUE = '#0066b3'

interface TramProps {
  /** Initial Z and travel direction. */
  startZ?: number
  /** Maximum Z reach before reversing. */
  extent?: number
}

export function Tram({
  startZ = 0,
  extent = BLOCK_LENGTH / 2 - TRAM_LENGTH / 2 - 1,
}: TramProps) {
  const body = useRef<RapierRigidBody>(null)
  const z = useRef(startZ)
  const direction = useRef<1 | -1>(1)
  const endGame = useGameStore((s) => s.endGame)
  const gameOver = useGameStore((s) => s.gameOver)

  useFrame((_, delta) => {
    if (!body.current || gameOver) return
    z.current += direction.current * TRAM_SPEED * delta
    if (z.current > extent) {
      z.current = extent
      direction.current = -1
    } else if (z.current < -extent) {
      z.current = -extent
      direction.current = 1
    }

    body.current.setNextKinematicTranslation({
      x: X_ROAD,
      y: TRAM_HEIGHT / 2,
      z: z.current,
    })
  })

  const onHit = (e: IntersectionEnterPayload) => {
    if (e.other.rigidBodyObject?.name !== 'player') return
    endGame('tram')
  }

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[X_ROAD, TRAM_HEIGHT / 2, startZ]}
      enabledRotations={[false, false, false]}
    >
      <CuboidCollider
        args={[TRAM_WIDTH / 2, TRAM_HEIGHT / 2, TRAM_LENGTH / 2]}
        sensor
        onIntersectionEnter={onHit}
      />

      {/* body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[TRAM_WIDTH, TRAM_HEIGHT, TRAM_LENGTH]} />
        <meshStandardMaterial color={TRAM_GVB_BLUE} roughness={0.6} />
      </mesh>

      {/* windows along both sides */}
      <TramWindows />

      {/* head/tail lights */}
      {[-TRAM_LENGTH / 2 - 0.01, TRAM_LENGTH / 2 + 0.01].map((zEnd, i) => (
        <mesh key={zEnd} position={[0, 0.9, zEnd]}>
          <planeGeometry args={[TRAM_WIDTH * 0.7, 0.4]} />
          <meshStandardMaterial
            color={i === 0 ? '#fff4c2' : '#d63333'}
            emissive={i === 0 ? '#fff4c2' : '#d63333'}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </RigidBody>
  )
}

function TramWindows() {
  const winCount = 6
  const winW = (TRAM_LENGTH * 0.85) / winCount
  const winH = TRAM_HEIGHT * 0.32
  const gap = (TRAM_LENGTH * 0.85 - winW * winCount) / Math.max(winCount - 1, 1)

  const winsZ: number[] = []
  for (let i = 0; i < winCount; i++) {
    const start = -TRAM_LENGTH * 0.85 / 2
    winsZ.push(start + winW / 2 + i * (winW + gap))
  }

  return (
    <group position={[0, 0.4, 0]}>
      {winsZ.map((zPos) =>
        [-1, 1].map((side) => (
          <mesh
            key={`${zPos}-${side}`}
            position={[(TRAM_WIDTH / 2 + 0.01) * side, 0, zPos]}
            rotation={[0, side > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
          >
            <planeGeometry args={[winW, winH]} />
            <meshStandardMaterial
              color="#1f3242"
              emissive="#2a4a5e"
              emissiveIntensity={0.2}
              roughness={0.2}
            />
          </mesh>
        )),
      )}
    </group>
  )
}
