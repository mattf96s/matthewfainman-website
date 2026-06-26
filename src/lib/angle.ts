/**
 * Angle helpers for smoothly turning meshes. Dependency-free so they
 * unit-test without three.js.
 */

/** Wraps an angle into (-π, π], the shortest signed representation. */
export function wrapAngle(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2
  while (a < -Math.PI) a += Math.PI * 2
  return a
}

/** Lerps `from` toward `to` along the shortest arc. */
export function lerpAngle(from: number, to: number, alpha: number): number {
  return from + wrapAngle(to - from) * alpha
}
