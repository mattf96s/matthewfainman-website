/**
 * Player movement maths, kept pure (no three.js) so it unit-tests
 * directly. `Player.tsx` feeds it raw input and applies the result.
 */

/**
 * Combine keyboard (±1 per axis) and analog joystick ([-1, 1]) inputs into
 * a world-space walk direction. The combined input clamps to the unit disc
 * so diagonals stay unit length and a small thumb-stick deflection walks
 * proportionally slowly, then rotates into world space by camera `yaw`
 * (camera-forward is (-sin, -cos), camera-right is (cos, -sin)). Written
 * into `out` to avoid allocating a vector every frame.
 */
export function walkDirection(
  forwardRaw: number,
  rightRaw: number,
  yaw: number,
  out: { x: number; z: number },
): void {
  const len = Math.hypot(forwardRaw, rightRaw)
  const scale = len > 1 ? 1 / len : 1
  const forward = forwardRaw * scale
  const right = rightRaw * scale
  const sin = Math.sin(yaw)
  const cos = Math.cos(yaw)
  out.x = forward * -sin + right * cos
  out.z = forward * -cos + right * -sin
}
