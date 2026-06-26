import { PLAYER_RADIUS } from './constants'

/**
 * The local player's right-shoulder weapon anchor, in player-local space.
 * The gun muzzle, the gun mesh and the sword mesh all hang off this same
 * point, so the offset maths lives in one place.
 */
export const SHOULDER_RIGHT = 0.32
export const SHOULDER_FWD = PLAYER_RADIUS + 0.05
export const SHOULDER_Y = 0.55

/**
 * World-space XZ offset of the shoulder anchor for a player facing `yaw`.
 * Written into `out` to avoid allocating a vector every frame.
 */
export function shoulderOffset(yaw: number, out: { x: number; z: number }): void {
  const sin = Math.sin(yaw)
  const cos = Math.cos(yaw)
  out.x = SHOULDER_RIGHT * cos + SHOULDER_FWD * -sin
  out.z = SHOULDER_RIGHT * -sin + SHOULDER_FWD * -cos
}
