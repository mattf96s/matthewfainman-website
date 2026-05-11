/**
 * Mutable per-frame input from a touch device — tilt-to-move and
 * touch-drag-to-look. Read by the player controller alongside keyboard
 * input; kept out of Zustand because it updates every orientation /
 * touchmove event (~60 Hz) and would re-render the scene.
 */
export const mobileInput = {
  /** -1 (lean back) → 1 (lean forward). 0 inside the deadzone. */
  forwardAxis: 0,
  /** -1 (lean left) → 1 (lean right). */
  rightAxis: 0,
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
  mobileInput.forwardAxis = 0
  mobileInput.rightAxis = 0
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
