import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'

import { cameraState } from '../game/cameraState'
import {
  CAMERA_PITCH_MAX,
  CAMERA_PITCH_MIN,
  MOUSE_SENSITIVITY,
} from '../game/constants'
import { useGameStore } from '../state/useGameStore'

/**
 * Wires the canvas to pointer-lock-based mouse look and to start/resume
 * the game when clicked. Pointer lock is best-effort — environments
 * that block it (sandboxed iframes) still get the start/resume side
 * effect so the game is playable with the keyboard alone.
 */
export function usePointerLock() {
  const canvas = useThree((s) => s.gl.domElement)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (!canvas) return

    const onClick = () => {
      const store = useGameStore.getState()
      if (!store.started) store.setStarted(true)
      if (store.paused) store.setPaused(false)

      if (document.pointerLockElement !== canvas) {
        // best-effort: harmless if the browser refuses
        try {
          canvas.requestPointerLock()
        } catch {
          /* ignored */
        }
      }
    }

    const onLockChange = () => {
      setLocked(document.pointerLockElement === canvas)
    }

    const onMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return
      cameraState.yaw -= e.movementX * MOUSE_SENSITIVITY
      cameraState.pitch = Math.min(
        CAMERA_PITCH_MAX,
        Math.max(
          CAMERA_PITCH_MIN,
          cameraState.pitch + e.movementY * MOUSE_SENSITIVITY,
        ),
      )
    }

    canvas.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onLockChange)
    document.addEventListener('mousemove', onMove)

    return () => {
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('pointerlockchange', onLockChange)
      document.removeEventListener('mousemove', onMove)
    }
  }, [canvas])

  return locked
}
