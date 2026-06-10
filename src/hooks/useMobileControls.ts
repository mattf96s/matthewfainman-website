import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

import { cameraState } from '../game/cameraState'
import {
  CAMERA_PITCH_MAX,
  CAMERA_PITCH_MIN,
  TOUCH_LOOK_SENSITIVITY,
} from '../game/constants'
import { isTouchDevice } from '../game/mobileInput'
import { useGameStore } from '../state/useGameStore'

/**
 * Wires up touch look controls on touch-capable devices: one-finger
 * drag on the canvas rotates the camera yaw/pitch. Movement is the
 * virtual joystick's job (left thumb), and the FIRE button has its own
 * drag-to-aim handling — together that's the standard mobile-shooter
 * split: left thumb moves, right thumb aims (and shoots).
 *
 * Mounted inside the R3F Canvas so `useThree` can resolve the canvas
 * element to attach listeners to.
 */
export function useMobileControls() {
  const canvas = useThree((s) => s.gl.domElement)

  useEffect(() => {
    if (!canvas) return
    if (!isTouchDevice()) return

    let primaryId: number | null = null
    let lastX = 0
    let lastY = 0

    const onTouchStart = (e: TouchEvent) => {
      const store = useGameStore.getState()
      if (!store.started) store.setStarted(true)
      else if (store.paused) store.setPaused(false)

      if (primaryId === null && e.touches.length > 0) {
        const t = e.touches[0]!
        primaryId = t.identifier
        lastX = t.clientX
        lastY = t.clientY
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (primaryId === null) return
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i]!
        if (t.identifier !== primaryId) continue
        const dx = t.clientX - lastX
        const dy = t.clientY - lastY
        cameraState.yaw -= dx * TOUCH_LOOK_SENSITIVITY
        cameraState.pitch = Math.max(
          CAMERA_PITCH_MIN,
          Math.min(
            CAMERA_PITCH_MAX,
            cameraState.pitch + dy * TOUCH_LOOK_SENSITIVITY,
          ),
        )
        lastX = t.clientX
        lastY = t.clientY
        break
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      let stillPresent = false
      for (let i = 0; i < e.touches.length; i++) {
        if (e.touches[i]!.identifier === primaryId) {
          stillPresent = true
          break
        }
      }
      if (!stillPresent) primaryId = null
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: true })
    canvas.addEventListener('touchend', onTouchEnd, { passive: true })
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      canvas.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [canvas])
}
