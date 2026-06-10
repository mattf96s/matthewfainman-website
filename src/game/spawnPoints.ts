import {
  X_CANAL,
  X_FAR_SIDEWALK,
  X_HOUSE_SIDEWALK,
  X_NEAR_SIDEWALK,
} from './world/constants'

export type SpawnPoint = [number, number, number]

/** First-load spawn — fixed so the opening framing is predictable:
 * canal-side sidewalk near the bridge, offset off the lamp-post row. */
export const INITIAL_SPAWN: SpawnPoint = [X_NEAR_SIDEWALK + 1.0, 2, 4]

/**
 * Hand-picked respawn spots, spread over both banks and the bridge.
 * Each is checked against the prop layout (lamps every 12 on the
 * sidewalk centrelines, parked cars/bikes, racks, bins, canal trees)
 * so nobody respawns inside a collider.
 */
const SPAWN_POINTS: readonly SpawnPoint[] = [
  INITIAL_SPAWN,
  [X_NEAR_SIDEWALK + 1.0, 2, -36],
  [X_NEAR_SIDEWALK + 1.0, 2, 30],
  [X_HOUSE_SIDEWALK - 1.0, 2, -36],
  [X_HOUSE_SIDEWALK - 1.0, 2, -2],
  [X_HOUSE_SIDEWALK - 1.0, 2, 12],
  [X_HOUSE_SIDEWALK - 1.0, 2, 34],
  [X_FAR_SIDEWALK - 0.9, 2, -24],
  [X_FAR_SIDEWALK - 0.9, 2, 24],
  // mid-bridge over the canal
  [X_CANAL, 2, 0],
]

/** Respawning right where you died (or where your killer is camping)
 * defeats the point — require at least this much distance when possible. */
const MIN_RESPAWN_DISTANCE = 18

/**
 * Picks a random spawn point, preferring ones at least
 * MIN_RESPAWN_DISTANCE away from `(awayFromX, awayFromZ)` — normally
 * the spot the player just died at.
 */
export function randomSpawn(awayFromX: number, awayFromZ: number): SpawnPoint {
  const far = SPAWN_POINTS.filter(
    ([x, , z]) =>
      Math.hypot(x - awayFromX, z - awayFromZ) >= MIN_RESPAWN_DISTANCE,
  )
  const pool = far.length > 0 ? far : SPAWN_POINTS
  return pool[Math.floor(Math.random() * pool.length)]!
}
