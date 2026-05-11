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
import { BLOCK_LENGTH } from '../world/constants'
import { TramBody } from './TramBody'

const TRAM_LENGTH = 14
const TRAM_WIDTH = 2.4
const TRAM_HEIGHT = 3.0
const TRAM_SPEED = 8
const TRAM_DWELL_SECONDS = 10
/** Half-width of the on-track hit zone — only direct frontal impact on
 * the rails counts. Effectively the centreline strip. */
const HIT_HALF_WIDTH = 0.18

interface TramProps {
  /** X position of the tram's centreline (lane centre). */
  x: number
  /** Initial Z. */
  startZ?: number
  /** Initial travel direction. */
  startDirection?: 1 | -1
  /** Maximum Z reach before reversing. */
  extent?: number
}

export function Tram({
  x,
  startZ = 0,
  startDirection = 1,
  extent = BLOCK_LENGTH / 2 - TRAM_LENGTH / 2 - 1,
}: TramProps) {
  const body = useRef<RapierRigidBody>(null)
  const z = useRef(startZ)
  const direction = useRef<1 | -1>(startDirection)
  const dwellRemaining = useRef(0)
  const playerInside = useRef(false)
  const wasHit = useRef(false)
  const endGame = useGameStore((s) => s.endGame)
  const addNearMiss = useGameStore((s) => s.addNearMiss)
  const gameOver = useGameStore((s) => s.gameOver)

  useFrame((_, delta) => {
    if (!body.current || gameOver) return

    if (dwellRemaining.current > 0) {
      dwellRemaining.current -= delta
    } else {
      z.current += direction.current * TRAM_SPEED * delta
      if (z.current >= extent) {
        z.current = extent
        direction.current = -1
        dwellRemaining.current = TRAM_DWELL_SECONDS
      } else if (z.current <= -extent) {
        z.current = -extent
        direction.current = 1
        dwellRemaining.current = TRAM_DWELL_SECONDS
      }
    }

    body.current.setNextKinematicTranslation({
      x,
      y: TRAM_HEIGHT / 2,
      z: z.current,
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
      // tram near-miss is worth more (it would have been instant lose)
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
      position={[x, TRAM_HEIGHT / 2, startZ]}
      enabledRotations={[false, false, false]}
    >
      {/* hit zone — narrow strip along the tram's path of motion, so
        * walking alongside the tram doesn't trigger a hit. */}
      <CuboidCollider
        args={[HIT_HALF_WIDTH, TRAM_HEIGHT / 2, TRAM_LENGTH / 2]}
        sensor
        onIntersectionEnter={onHit}
      />

      {/* near-miss halo around the tram */}
      <CuboidCollider
        args={[TRAM_WIDTH / 2 + 1.5, TRAM_HEIGHT / 2, TRAM_LENGTH / 2 + 1.5]}
        sensor
        onIntersectionEnter={onNearEnter}
        onIntersectionExit={onNearExit}
      />

      <TramBody
        length={TRAM_LENGTH}
        width={TRAM_WIDTH}
        height={TRAM_HEIGHT}
      />
    </RigidBody>
  )
}
