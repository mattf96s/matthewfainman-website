/**
 * Mutable per-frame camera orientation shared between the player controller
 * (reads yaw to convert WASD to world-space) and the follow camera (reads
 * yaw/pitch to position itself).
 *
 * Kept out of Zustand: mouse-move runs ~100 Hz and would re-render the
 * scene tree every event.
 */
export const cameraState = {
  yaw: 0,
  pitch: 0.1,
}
