/**
 * Pure hit test for melee swings: is a target inside the attacker's
 * frontal arc? XZ-plane only — vertical tolerance is the caller's
 * concern (capsule heights barely differ in this game). Dependency-free
 * like `raycast.ts`, so it unit-tests without three.js.
 */

/**
 * True when the point at (dx, dz) — target position minus attacker
 * position — lies within `range` and inside the arc around the unit
 * facing direction (fx, fz) whose half-angle has cosine `cosHalfArc`.
 *
 * Targets close enough to overlap the attacker always count: at
 * near-zero distance the direction is meaningless and a swing should
 * obviously connect.
 */
export function isInMeleeArc(
  dx: number,
  dz: number,
  fx: number,
  fz: number,
  range: number,
  cosHalfArc: number,
): boolean {
  const distSq = dx * dx + dz * dz
  if (distSq > range * range) return false
  if (distSq < 1e-6) return true
  const dist = Math.sqrt(distSq)
  return (dx * fx + dz * fz) / dist >= cosHalfArc
}
