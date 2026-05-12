import { useEffect, useState } from 'react'

import {
  X_FAR_SIDEWALK,
  X_HOUSE_SIDEWALK,
  X_MEDIAN_EAST,
  X_MEDIAN_WEST,
} from '../world/constants'
import { Stroopwafel } from './Stroopwafel'

interface SpawnSpot {
  x: number
  z: number
}

/** Candidate spawn spots — biased to the far side of the road and the
 * narrow medians so picking one up usually means dashing across
 * traffic. The two far-sidewalk entries sit on the bridges, since the
 * gracht is now a real hazard and otherwise unreachable on foot. */
const SPOTS: SpawnSpot[] = [
  { x: X_HOUSE_SIDEWALK, z: -32 },
  { x: X_HOUSE_SIDEWALK, z: -8 },
  { x: X_HOUSE_SIDEWALK, z: 20 },
  { x: X_HOUSE_SIDEWALK, z: 40 },
  { x: X_MEDIAN_EAST, z: -18 },
  { x: X_MEDIAN_EAST, z: 24 },
  { x: X_MEDIAN_WEST, z: -8 },
  { x: X_MEDIAN_WEST, z: 30 },
  { x: X_FAR_SIDEWALK, z: 0 },
  { x: X_FAR_SIDEWALK, z: 55 },
]

const LIFETIME_MIN = 12
const LIFETIME_MAX = 20
const COOLDOWN_MIN = 8
const COOLDOWN_MAX = 18
const HEAL_AMOUNT = 25

interface ActiveSpawn {
  /** Bumped each respawn so React remounts and the timer resets. */
  id: number
  spot: SpawnSpot
  lifetime: number
}

const pickSpot = (avoid: SpawnSpot | null): SpawnSpot => {
  if (!avoid) return SPOTS[Math.floor(Math.random() * SPOTS.length)]!
  // pick again until we get a different spot — keeps the next pickup
  // somewhere new rather than respawning where the last one was
  let next = SPOTS[Math.floor(Math.random() * SPOTS.length)]!
  for (let i = 0; i < 5 && next === avoid; i++) {
    next = SPOTS[Math.floor(Math.random() * SPOTS.length)]!
  }
  return next
}

/**
 * Spawns one stroopwafel at a time in a random place. After each is
 * eaten or expires, a fresh one appears after a short cool-down. One
 * at a time keeps the reward feeling like a moment, not a litter.
 */
export function Stroopwafels() {
  const [current, setCurrent] = useState<ActiveSpawn | null>(null)

  // schedule the first spawn after mount, and re-schedule whenever
  // `current` clears (because the wafel resolved or timed out)
  useEffect(() => {
    if (current) return
    const cooldownMs =
      (COOLDOWN_MIN + Math.random() * (COOLDOWN_MAX - COOLDOWN_MIN)) *
      1000
    const id = window.setTimeout(() => {
      setCurrent((prev) => ({
        id: (prev?.id ?? 0) + 1,
        spot: pickSpot(prev?.spot ?? null),
        lifetime:
          LIFETIME_MIN + Math.random() * (LIFETIME_MAX - LIFETIME_MIN),
      }))
    }, cooldownMs)
    return () => window.clearTimeout(id)
  }, [current])

  if (!current) return null
  return (
    <Stroopwafel
      key={current.id}
      x={current.spot.x}
      z={current.spot.z}
      lifetime={current.lifetime}
      heal={HEAL_AMOUNT}
      onResolve={() => setCurrent(null)}
    />
  )
}
