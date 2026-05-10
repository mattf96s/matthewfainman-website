import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'

import { cameraState } from '../game/cameraState'
import {
  CAMERA_PITCH_MAX,
  CAMERA_PITCH_MIN,
  MOUSE_SENSITIVITY,
} from '../game/constants'

/**
 * Requests pointer lock when the canvas is clicked and pipes mouse
 * deltas into the shared cameraState yaw/pitch while locked.
 *
 * Returns `locked` so the UI can show a "click to play" overlay.
 */
export function usePointerLock() {
  const canvas = useThree((s) => s.gl.domElement)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (!canvas) return

    const onClick = () => {
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock()
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
