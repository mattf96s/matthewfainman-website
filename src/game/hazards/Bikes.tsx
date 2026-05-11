import { Bike } from './Bike'
import { BLOCK_LENGTH, X_FIETSPAD } from '../world/constants'

const BIKE_COUNT = 5
const BIKE_SPEED = 6
const BIKE_EXTENT = BLOCK_LENGTH / 2 - 1

/**
 * Spawns a handful of independent bikes along the fietspad. Each bike
 * does a single trip then idles for a random interval before its next
 * trip — so traffic naturally bunches and gaps rather than running
 * as a continuous conveyor.
 */
export function Bikes() {
  return (
    <>
      {Array.from({ length: BIKE_COUNT }, (_, i) => (
        <Bike
          key={i}
          x={X_FIETSPAD}
          extent={BIKE_EXTENT}
          speed={BIKE_SPEED}
          initialDelay={i * 2.3 + Math.random() * 4}
          minIdle={5}
          maxIdle={18}
          speedJitter={1.8}
        />
      ))}
    </>
  )
}
