import { useEffect } from 'react'

import { usePointerLock } from '../hooks/usePointerLock'
import { useGameStore } from '../state/useGameStore'

/**
 * Lives inside the Canvas so it can call useThree() to read the canvas
 * element, but pushes lock state out to Zustand for the UI overlay.
 */
export function PointerLockBridge() {
  const locked = usePointerLock()
  const setLocked = useGameStore((s) => s.setLocked)
  const setStarted = useGameStore((s) => s.setStarted)
  useEffect(() => {
    setLocked(locked)
    if (locked) setStarted(true)
  }, [locked, setLocked, setStarted])
  return null
}
