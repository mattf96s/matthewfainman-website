import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, type RapierRigidBody } from '@react-three/rapier'

import { triggerCameraShake } from '../cameraState'
import { PLAYER_RADIUS } from '../constants'
import { triggerKnockback } from '../playerImpulse'
import { playerPosition } from '../playerPosition'
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
/** Half-extents of the wider near-miss halo around the tram. */
const NEAR_HALF_WIDTH = TRAM_WIDTH / 2 + 1.5
const NEAR_HALF_LENGTH = TRAM_LENGTH / 2 + 1.5

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
  const cooldown = useRef(0)
  const takeDamage = useGameStore((s) => s.takeDamage)
  const addNearMiss = useGameStore((s) => s.addNearMiss)
  const gameOver = useGameStore((s) => s.gameOver)

  /** True while player overlaps the on-rails hit zone — gates damage to
   * once-per-entry instead of every frame. */
  const hitInside = useRef(false)

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

    if (!playerPosition.ready) return

    const dx = Math.abs(playerPosition.x - x)
    const dz = Math.abs(playerPosition.z - z.current)

    const inHit =
      dx < HIT_HALF_WIDTH + PLAYER_RADIUS &&
      dz < TRAM_LENGTH / 2 + PLAYER_RADIUS
    const now = performance.now()
    if (inHit) {
      if (!hitInside.current && now - cooldown.current >= 1500) {
        hitInside.current = true
        cooldown.current = now
        wasHit.current = true
        triggerCameraShake(800, 0.7)
        triggerKnockback(1000, 0, 7, direction.current * 22)
        takeDamage(80, 'tram')
      }
    } else {
      hitInside.current = false
    }

    const inNear =
      dx < NEAR_HALF_WIDTH + PLAYER_RADIUS &&
      dz < NEAR_HALF_LENGTH + PLAYER_RADIUS
    if (inNear && !playerInside.current) {
      playerInside.current = true
      wasHit.current = false
    } else if (!inNear && playerInside.current) {
      playerInside.current = false
      if (!wasHit.current) {
        // tram near-miss is worth more (it would have been instant lose)
        addNearMiss()
        addNearMiss()
      }
      wasHit.current = false
    }
  })

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[x, TRAM_HEIGHT / 2, startZ]}
      enabledRotations={[false, false, false]}
    >
      <TramBody
        length={TRAM_LENGTH}
        width={TRAM_WIDTH}
        height={TRAM_HEIGHT}
      />
    </RigidBody>
  )
}
