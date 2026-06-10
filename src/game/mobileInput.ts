/**
 * Mutable per-frame input from a touch device — virtual joystick and
 * the on-screen FIRE/JUMP buttons. Read by the player controller
 * alongside the keyboard; kept out of Zustand because it updates every
 * touchmove (~60 Hz) and would re-render the scene.
 */
export const mobileInput = {
  /** Joystick contribution. -1 (back) → 1 (forward). */
  joystickForward: 0,
  /** Joystick contribution. -1 (left) → 1 (right). */
  joystickRight: 0,
  /** True while the on-screen FIRE button is held (hold to auto-fire). */
  firePressed: false,
  /** True while the on-screen JUMP button is held. */
  jumpPressed: false,
}

export function resetMobileInput() {
  mobileInput.joystickForward = 0
  mobileInput.joystickRight = 0
  mobileInput.firePressed = false
  mobileInput.jumpPressed = false
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
