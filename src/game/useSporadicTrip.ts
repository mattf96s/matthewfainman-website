import { useRef } from 'react'

interface SporadicTripOptions {
  /** Travel runs from -extent to +extent (direction picked per trip). */
  extent: number
  /** Base cruise speed, m/s. */
  speed: number
  /** Speed varies ±this much per trip. */
  speedJitter?: number
  /** Delay before the first trip, seconds. */
  initialDelay?: number
  /** Idle window between trips, seconds. */
  minIdle: number
  maxIdle: number
}

export interface SporadicTrip {
  /** True while mid-trip (visible and on-track). */
  active: boolean
  /** Current position along the travel axis. */
  z: number
  direction: 1 | -1
}

/**
 * A back-and-forth mover that does trips with random idle gaps between
 * them — each idle picks a fresh direction and speed, so a handful of
 * these together produce naturally sporadic traffic with gaps and bursts.
 * Used by cyclists and scurrying rats alike.
 *
 * Returns a stable `trip` object (read its fields each frame) and an
 * `advance(delta, now)` that steps it and returns true while the entity
 * is mid-trip, false while idle/parked.
 */
export function useSporadicTrip({
  extent,
  speed,
  speedJitter = 1.5,
  initialDelay = 0,
  minIdle,
  maxIdle,
}: SporadicTripOptions): {
  trip: SporadicTrip
  advance: (delta: number, now: number) => boolean
} {
  const trip = useRef<SporadicTrip>({ active: false, z: 0, direction: 1 })
  const tripSpeed = useRef(speed)
  const idleUntil = useRef(performance.now() + initialDelay * 1000)

  const startNewTrip = () => {
    const direction: 1 | -1 = Math.random() < 0.5 ? 1 : -1
    trip.current.direction = direction
    trip.current.z = direction === 1 ? -extent : extent
    tripSpeed.current = speed + (Math.random() * 2 - 1) * speedJitter
    trip.current.active = true
  }

  const parkAndIdle = (now: number) => {
    trip.current.active = false
    idleUntil.current = now + (minIdle + Math.random() * (maxIdle - minIdle)) * 1000
  }

  const advance = (delta: number, now: number): boolean => {
    if (!trip.current.active) {
      if (now >= idleUntil.current) startNewTrip()
      return false
    }
    trip.current.z += trip.current.direction * tripSpeed.current * delta
    const done =
      (trip.current.direction === 1 && trip.current.z > extent) ||
      (trip.current.direction === -1 && trip.current.z < -extent)
    if (done) {
      parkAndIdle(now)
      return false
    }
    return true
  }

  return { trip: trip.current, advance }
}
