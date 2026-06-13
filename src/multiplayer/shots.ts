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
 * (~0.3) is added on top by the caller, giving ~1.3m edge-to-edge. Kept
 * to genuine hugging distance so the blade visibly reaches whoever it
 * hits — a longer reach reads as a phantom stab from across the street. */
export const SWORD_RANGE = 1.0
/** cos of the half-angle of the frontal swing arc (80° total). Forgiving
 * enough for a meme toy, narrow enough that you can't tag someone off to
 * the side just by turning the camera. */
export const SWORD_COS_HALF_ARC = Math.cos((40 * Math.PI) / 180)
/** Cooldown between swings (ms). */
export const SWING_INTERVAL_MS = 420

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
