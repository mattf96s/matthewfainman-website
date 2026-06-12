/**
 * Shot events shared between the local Gun (which writes them) and the
 * Tracers renderer (which draws them). Each entry decays after
 * TRACER_LIFETIME_MS and is then evicted.
 */

export interface ShotEvent {
  id: number
  ox: number
  oy: number
  oz: number
  hx: number
  hy: number
  hz: number
  /** performance.now() when the shot started. */
  startedAt: number
}

export const TRACER_LIFETIME_MS = 200
export const GUN_DAMAGE = 15
export const GUN_RANGE = 80
/** Cooldown between local shots (ms). */
export const FIRE_INTERVAL_MS = 220

/* Sword — the close-combat option. Hits harder than the gun because you
 * have to get within hugging distance of someone who can shoot back. */
export const SWORD_DAMAGE = 25
/** Reach measured from the player centre; the target's capsule radius
 * is added on top by the caller. */
export const SWORD_RANGE = 2.2
/** cos of the half-angle of the frontal swing arc (100° total — this is
 * a meme toy, err on the side of "that counted"). */
export const SWORD_COS_HALF_ARC = Math.cos((50 * Math.PI) / 180)
/** Cooldown between swings (ms). */
export const SWING_INTERVAL_MS = 400

let nextId = 1

export const activeShots: ShotEvent[] = []

export function pushShot(
  ox: number,
  oy: number,
  oz: number,
  hx: number,
  hy: number,
  hz: number,
): void {
  activeShots.push({
    id: nextId++,
    ox,
    oy,
    oz,
    hx,
    hy,
    hz,
    startedAt: performance.now(),
  })
}

export function pruneShots(now: number): void {
  while (activeShots.length > 0 && now - activeShots[0]!.startedAt > TRACER_LIFETIME_MS) {
    activeShots.shift()
  }
}
