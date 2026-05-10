import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import { useGameStore } from '../../state/useGameStore'

/**
 * Survival timer. Accumulates delta into a ref each frame and flushes
 * whole seconds into the store so we don't trigger a render per frame.
 */
export function ScoreTimer() {
  const accumulator = useRef(0)
  const addScore = useGameStore((s) => s.addScore)

  useFrame((_, delta) => {
    const { gameOver, locked } = useGameStore.getState()
    if (gameOver || !locked) return
    accumulator.current += delta
    if (accumulator.current >= 1) {
      const whole = Math.floor(accumulator.current)
      addScore(whole)
      accumulator.current -= whole
    }
  })

  return null
}
