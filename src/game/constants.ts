export const PLAYER_SPEED = 8
export const PLAYER_HEIGHT = 1.0
export const PLAYER_RADIUS = 0.3
export const PLAYER_JUMP_SPEED = 9
export const GRAVITY = 25

export const CAMERA_DISTANCE = 6
export const CAMERA_HEIGHT = 2.2
export const CAMERA_LERP = 0.12
/** How far ahead of the player the camera's look-at point sits. Aiming
 * the view past the player (instead of at them) is what lets the
 * crosshair float over the world and track the mouse 1:1. */
export const CAMERA_LOOK_AHEAD = 10
export const MOUSE_SENSITIVITY = 0.0025
/** Radians per CSS pixel of touch drag — canvas look *and* the
 * drag-to-aim FIRE button share this so aiming feels identical. */
export const TOUCH_LOOK_SENSITIVITY = 0.006
/** Radians per second when yawing via Q/E. */
export const KEYBOARD_YAW_SPEED = 2.2
export const CAMERA_PITCH_MIN = -0.5
export const CAMERA_PITCH_MAX = 1.2
