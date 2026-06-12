/**
 * Pure math for passive health regeneration. The frame-loop system
 * (`src/game/systems/HealthRegen.tsx`) calls `regenTick` once per frame
 * and accumulates the fractional result, flushing whole hit-points to
 * the store — same pattern as the canal drowning damage, so the store
 * (and React) never sees per-frame updates.
 */

/** Seconds without taking damage before regeneration kicks in. */
export const REGEN_DELAY_S = 5
/** Hit-points recovered per second once regenerating. */
export const REGEN_RATE_PER_S = 3

/**
 * Health to recover for one frame, possibly fractional.
 *
 * `sinceDamageS` is the time since the player last took damage, measured
 * at the END of the frame; `deltaS` is the frame duration. When the
 * regen delay expires mid-frame, only the portion of the frame past the
 * delay heals — so regen starts exactly REGEN_DELAY_S after the hit, not
 * up to a frame late.
 *
 * Returns 0 while dead, at full health, or still inside the delay.
 */
export function regenTick(
  health: number,
  maxHealth: number,
  sinceDamageS: number,
  deltaS: number,
): number {
  if (health <= 0 || health >= maxHealth) return 0
  const activeS = Math.min(deltaS, Math.max(0, sinceDamageS - REGEN_DELAY_S))
  return Math.min(maxHealth - health, activeS * REGEN_RATE_PER_S)
}
