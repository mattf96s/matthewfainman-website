/**
 * Mutable per-frame input from a touch device — virtual joystick and
 * optional gyroscope tilt. Read by the player controller alongside the
 * keyboard; kept out of Zustand because it updates every touchmove /
 * orientation event (~60 Hz) and would re-render the scene.
 */
export const mobileInput = {
  /** Tilt contribution. -1 (lean back) → 1 (lean forward). */
  gyroForward: 0,
  /** Tilt contribution. -1 (lean left) → 1 (lean right). */
  gyroRight: 0,
  /** Joystick contribution. -1 (back) → 1 (forward). */
  joystickForward: 0,
  /** Joystick contribution. -1 (left) → 1 (right). */
  joystickRight: 0,
  /** True while the on-screen FIRE button is held (hold to auto-fire). */
  firePressed: false,
  /** True while the on-screen JUMP button is held. */
  jumpPressed: false,
  /** True once a deviceorientation event has been received. */
  hasGyro: false,
  /** True once we've tried to obtain permission (iOS requires it). */
  permissionRequested: false,
  /** Calibrated zero-tilt baselines in degrees (screen frame). */
  baselineForward: 50,
  baselineRight: 0,
  /** Cleared between sessions so a fresh calibration runs next start. */
  calibrated: false,
}

export function calibrateGyro(forward: number, right: number) {
  mobileInput.baselineForward = forward
  mobileInput.baselineRight = right
  mobileInput.calibrated = true
}

export function resetMobileInput() {
  mobileInput.gyroForward = 0
  mobileInput.gyroRight = 0
  mobileInput.joystickForward = 0
  mobileInput.joystickRight = 0
  mobileInput.firePressed = false
  mobileInput.jumpPressed = false
  mobileInput.calibrated = false
}

/** Is this a touch-capable device? Cached after the first SSR-safe call. */
let cachedIsTouchDevice: boolean | null = null
export function isTouchDevice(): boolean {
  if (cachedIsTouchDevice !== null) return cachedIsTouchDevice
  if (typeof window === 'undefined') return false
  cachedIsTouchDevice =
    'ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0
  return cachedIsTouchDevice
}
