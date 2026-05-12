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

export const TRACER_LIFETIME_MS = 140
export const GUN_DAMAGE = 25
export const GUN_RANGE = 80
/** Cooldown between local shots (ms). */
export const FIRE_INTERVAL_MS = 220

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
