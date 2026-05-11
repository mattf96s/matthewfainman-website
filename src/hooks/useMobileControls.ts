import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

import { cameraState } from '../game/cameraState'
import {
  CAMERA_PITCH_MAX,
  CAMERA_PITCH_MIN,
} from '../game/constants'
import {
  calibrateGyro,
  isTouchDevice,
  mobileInput,
} from '../game/mobileInput'
import { useGameStore } from '../state/useGameStore'

/** Degrees of tilt that count as "no input". */
const TILT_DEADZONE = 4
/** Degrees of tilt at which the axis saturates at ±1. */
const TILT_FULL_SCALE = 22
/** Radians per CSS pixel of touch drag. */
const TOUCH_YAW_SENSITIVITY = 0.006
const TOUCH_PITCH_SENSITIVITY = 0.006

interface DeviceOrientationEventStatic {
  requestPermission?: () => Promise<'granted' | 'denied' | 'default'>
}

function mapAxis(deg: number): number {
  const abs = Math.abs(deg)
  if (abs < TILT_DEADZONE) return 0
  const sign = Math.sign(deg)
  return sign * Math.min(1, (abs - TILT_DEADZONE) / TILT_FULL_SCALE)
}

function getScreenAngle(): number {
  if (typeof screen !== 'undefined' && screen.orientation) {
    return screen.orientation.angle
  }
  const w = window as unknown as { orientation?: number }
  return w.orientation ?? 0
}

/**
 * Rotates the raw device beta/gamma into a screen-aligned (forward,
 * right) tilt pair so the controls feel the same in portrait or
 * landscape.
 */
function toScreenTilt(
  beta: number,
  gamma: number,
): { forward: number; right: number } {
  const angle = getScreenAngle()
  switch (angle) {
    case 90:
      return { forward: -gamma, right: beta }
    case -90:
    case 270:
      return { forward: gamma, right: -beta }
    case 180:
      return { forward: -beta, right: -gamma }
    default:
      return { forward: beta, right: gamma }
  }
}

/**
 * Wires up touch + gyroscope controls on touch-capable devices.
 *
 * - Tilt the phone: drives the player's planar movement (analog).
 * - One-finger drag on the canvas: rotates the camera yaw (and a
 *   gentler pitch from vertical drag).
 * - iOS 13+: a permission prompt is requested inside the first
 *   touchstart so we don't blow the user-gesture requirement.
 *
 * Mounted inside the R3F Canvas so `useThree` can resolve the canvas
 * element to attach listeners to.
 */
export function useMobileControls() {
  const canvas = useThree((s) => s.gl.domElement)

  useEffect(() => {
    if (!canvas) return
    if (!isTouchDevice()) return

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return
      const { forward, right } = toScreenTilt(e.beta, e.gamma)
      if (!mobileInput.calibrated) {
        calibrateGyro(forward, right)
        mobileInput.hasGyro = true
        return
      }
      mobileInput.forwardAxis = mapAxis(forward - mobileInput.baselineForward)
      mobileInput.rightAxis = mapAxis(right - mobileInput.baselineRight)
    }

    const attachOrientationListener = () => {
      window.addEventListener('deviceorientation', onOrientation)
    }

    const ensureGyroPermission = () => {
      const Ctor = (
        window as unknown as {
          DeviceOrientationEvent?: DeviceOrientationEventStatic
        }
      ).DeviceOrientationEvent
      if (mobileInput.permissionRequested) return
      mobileInput.permissionRequested = true
      if (Ctor?.requestPermission) {
        Ctor.requestPermission()
          .then((state) => {
            if (state === 'granted') attachOrientationListener()
          })
          .catch(() => {
            /* user denied — silent fallback to touch-only */
          })
      } else {
        attachOrientationListener()
      }
    }

    let primaryId: number | null = null
    let lastX = 0
    let lastY = 0

    const onTouchStart = (e: TouchEvent) => {
      ensureGyroPermission()

      const store = useGameStore.getState()
      if (!store.started) store.setStarted(true)
      else if (store.paused && !store.gameOver) store.setPaused(false)

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
        cameraState.yaw -= dx * TOUCH_YAW_SENSITIVITY
        cameraState.pitch = Math.max(
          CAMERA_PITCH_MIN,
          Math.min(
            CAMERA_PITCH_MAX,
            cameraState.pitch + dy * TOUCH_PITCH_SENSITIVITY,
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
      window.removeEventListener('deviceorientation', onOrientation)
    }
  }, [canvas])
}
