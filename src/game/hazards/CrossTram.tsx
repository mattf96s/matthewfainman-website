import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  CuboidCollider,
  RigidBody,
  type IntersectionEnterPayload,
  type IntersectionExitPayload,
  type RapierRigidBody,
} from '@react-three/rapier'

import { triggerCameraShake } from '../cameraState'
import { useGameStore } from '../../state/useGameStore'

const TRAM_LENGTH = 12
const TRAM_WIDTH = 2.2
const TRAM_HEIGHT = 2.8
const TRAM_SPEED = 7
const TRAM_DWELL_SECONDS = 12
const HIT_HALF_DEPTH = 0.55
const TRAM_GVB_BLUE = '#0066b3'

interface CrossTramProps {
  /** Fixed z position (centreline of the cross-street). */
  z: number
  /** Fixed x extent — tram bounces between -extent and +extent. */
  extent: number
}

/**
 * Same idea as Tram but oriented along the X axis and confined to a
 * cross-street. Long edge runs east-west.
 */
export function CrossTram({ z, extent }: CrossTramProps) {
  const body = useRef<RapierRigidBody>(null)
  const x = useRef(0)
  const direction = useRef<1 | -1>(1)
  const dwellRemaining = useRef(0)
  const playerInside = useRef(false)
  const wasHit = useRef(false)
  const endGame = useGameStore((s) => s.endGame)
  const addNearMiss = useGameStore((s) => s.addNearMiss)

  useFrame((_, delta) => {
    if (!body.current) return
    if (useGameStore.getState().gameOver) return

    if (dwellRemaining.current > 0) {
      dwellRemaining.current -= delta
    } else {
      x.current += direction.current * TRAM_SPEED * delta
      if (x.current >= extent) {
        x.current = extent
        direction.current = -1
        dwellRemaining.current = TRAM_DWELL_SECONDS
      } else if (x.current <= -extent) {
        x.current = -extent
        direction.current = 1
        dwellRemaining.current = TRAM_DWELL_SECONDS
      }
    }

    body.current.setNextKinematicTranslation({
      x: x.current,
      y: TRAM_HEIGHT / 2,
      z,
    })
  })

  const onHit = (e: IntersectionEnterPayload) => {
    if (e.other.rigidBodyObject?.name !== 'player') return
    wasHit.current = true
    triggerCameraShake(800, 0.7)
    endGame('tram')
  }

  const onNearEnter = (e: IntersectionEnterPayload) => {
    if (e.other.rigidBodyObject?.name !== 'player') return
    playerInside.current = true
    wasHit.current = false
  }

  const onNearExit = (e: IntersectionExitPayload) => {
    if (e.other.rigidBodyObject?.name !== 'player') return
    if (!playerInside.current) return
    playerInside.current = false
    if (!wasHit.current && !useGameStore.getState().gameOver) {
      addNearMiss()
      addNearMiss()
    }
    wasHit.current = false
  }

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[0, TRAM_HEIGHT / 2, z]}
      enabledRotations={[false, false, false]}
    >
      {/* hit zone — narrow along Z (the perpendicular-to-motion axis)
        * so only on-track contact counts. Tram's long axis is X. */}
      <CuboidCollider
        args={[TRAM_LENGTH / 2, TRAM_HEIGHT / 2, HIT_HALF_DEPTH]}
        sensor
        onIntersectionEnter={onHit}
      />
      <CuboidCollider
        args={[TRAM_LENGTH / 2 + 1.5, TRAM_HEIGHT / 2, TRAM_WIDTH / 2 + 1.5]}
        sensor
        onIntersectionEnter={onNearEnter}
        onIntersectionExit={onNearExit}
      />

      <mesh castShadow receiveShadow>
        <boxGeometry args={[TRAM_LENGTH, TRAM_HEIGHT, TRAM_WIDTH]} />
        <meshStandardMaterial color={TRAM_GVB_BLUE} roughness={0.6} />
      </mesh>

      {/* head/tail lights at the ends of the long X axis */}
      {[-TRAM_LENGTH / 2 - 0.01, TRAM_LENGTH / 2 + 0.01].map((xEnd, i) => (
        <mesh
          key={xEnd}
          position={[xEnd, 0.7, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[TRAM_WIDTH * 0.7, 0.35]} />
          <meshStandardMaterial
            color={i === 0 ? '#fff4c2' : '#d63333'}
            emissive={i === 0 ? '#fff4c2' : '#d63333'}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}

      <CrossTramWindows />
    </RigidBody>
  )
}

function CrossTramWindows() {
  const winCount = 5
  const winW = (TRAM_LENGTH * 0.85) / winCount
  const winH = TRAM_HEIGHT * 0.32
  const gap = (TRAM_LENGTH * 0.85 - winW * winCount) / Math.max(winCount - 1, 1)

  const winsX: number[] = []
  for (let i = 0; i < winCount; i++) {
    const start = -TRAM_LENGTH * 0.85 / 2
    winsX.push(start + winW / 2 + i * (winW + gap))
  }

  return (
    <group position={[0, 0.4, 0]}>
      {winsX.map((xPos) =>
        [-1, 1].map((side) => (
          <mesh
            key={`${xPos}-${side}`}
            position={[xPos, 0, (TRAM_WIDTH / 2 + 0.01) * side]}
            rotation={[0, side > 0 ? 0 : Math.PI, 0]}
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
