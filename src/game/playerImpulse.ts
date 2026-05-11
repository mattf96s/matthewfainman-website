/**
 * Mutable per-frame knockback state shared between hazards (which fire
 * `triggerKnockback` on impact) and the player controller (which reads
 * `playerImpulse` each frame to override WASD with the throw motion).
 *
 * Kept out of Zustand: this is per-frame physics state, not gameplay
 * state — a Zustand update would re-render the scene tree.
 */
export const playerImpulse = {
  /** performance.now() ms at which the current knockback started. */
  startedAt: 0,
  /** performance.now() ms at which the current knockback ends. */
  endsAt: 0,
  /** Total duration of the current knockback, ms. */
  durationMs: 0,
  /** Initial planar velocity, m/s. Decays linearly to zero by endsAt. */
  vx: 0,
  vz: 0,
  /** Initial upward velocity, m/s — pops the player into the air. */
  vy: 0,
}

export function triggerKnockback(
  durationMs: number,
  vx: number,
  vy: number,
  vz: number,
) {
  const now = performance.now()
  // A stronger knockback in progress wins; otherwise the new one stomps.
  const currentMag = Math.hypot(playerImpulse.vx, playerImpulse.vz)
  const newMag = Math.hypot(vx, vz)
  if (now < playerImpulse.endsAt && currentMag > newMag) return
  playerImpulse.startedAt = now
  playerImpulse.endsAt = now + durationMs
  playerImpulse.durationMs = durationMs
  playerImpulse.vx = vx
  playerImpulse.vy = vy
  playerImpulse.vz = vz
}

export function isKnockbackActive(now: number = performance.now()): boolean {
  return now < playerImpulse.endsAt
}
