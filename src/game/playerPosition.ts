/**
 * Shared world-space position of the player capsule, written each
 * frame from Player.tsx and read by hazards for manual hit detection.
 *
 * The character-controller-driven kinematic body doesn't reliably
 * trigger Rapier sensor intersection events, so hazards do their own
 * bounding-box overlap checks against this position instead of
 * relying on `onIntersectionEnter` callbacks.
 */
export const playerPosition = {
  x: 0,
  y: 0,
  z: 0,
  /** Set true once the player body has reported a position at least
   * once — gates hazards from acting on the stale (0,0,0) default. */
  ready: false,
}
