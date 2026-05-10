import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import { useGameStore } from '../state/useGameStore'

export function FpsTracker() {
  const setFps = useGameStore((s) => s.setFps)
  const frames = useRef(0)
  const lastTime = useRef(performance.now())

  useFrame(() => {
    frames.current++
    const now = performance.now()
    if (now - lastTime.current >= 1000) {
      setFps(frames.current)
      frames.current = 0
      lastTime.current = now
    }
  })

  return null
}
