import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'

import { X_HOUSE_SIDEWALK } from '../world/constants'
import { Tourist } from './Tourist'

const WALK_SPEED = 1.1
const EXTENT = 22
/** Random pause range, seconds — they stop occasionally to gawk. */
const PAUSE_MIN = 2
const PAUSE_MAX = 6

/**
 * A small wandering group of tourists on the house-side sidewalk.
 * Leader walks back and forth, pausing at random points; followers
 * trail in formation behind them.
 */
export function Tourists() {
  const group = useRef<THREE.Group>(null)
  const z = useRef(0)
  const direction = useRef<1 | -1>(1)
  const pauseUntil = useRef(0)

  useFrame((_, delta) => {
    const now = performance.now()
    const paused = now < pauseUntil.current

    if (!paused) {
      z.current += direction.current * WALK_SPEED * delta
      if (z.current > EXTENT) {
        z.current = EXTENT
        direction.current = -1
        pauseUntil.current =
          now + (PAUSE_MIN + Math.random() * (PAUSE_MAX - PAUSE_MIN)) * 1000
      } else if (z.current < -EXTENT) {
        z.current = -EXTENT
        direction.current = 1
        pauseUntil.current =
          now + (PAUSE_MIN + Math.random() * (PAUSE_MAX - PAUSE_MIN)) * 1000
      } else if (Math.random() < 0.003) {
        // small chance per frame to pause mid-walk and look around
        pauseUntil.current =
          now + (PAUSE_MIN + Math.random() * (PAUSE_MAX - PAUSE_MIN)) * 1000
      }
    }

    if (group.current) group.current.position.z = z.current
  })

  // tourists arranged in a loose triangle relative to the moving group
  return (
    <group ref={group} position={[X_HOUSE_SIDEWALK, 0, 0]}>
      <Tourist
        position={[0.4, 0, 0]}
        shirt="#d6b54c"
        hasHat
        phase={0}
      />
      <Tourist
        position={[-0.3, 0, -0.95]}
        shirt="#3b6d8a"
        hasBackpack
        phase={1.4}
      />
      <Tourist
        position={[0.55, 0, -1.7]}
        shirt="#b94a4a"
        trousers="#3a2a1c"
        phase={2.8}
      />
    </group>
  )
}
