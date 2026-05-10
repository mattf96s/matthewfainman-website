import { Bike } from './Bike'
import {
  BLOCK_LENGTH,
  X_FIETSPAD,
} from '../world/constants'

const BIKE_COUNT = 4
const BIKE_SPEED = 6
const BIKE_EXTENT = BLOCK_LENGTH / 2 - 1

/** Spawns evenly-spaced bikes circulating along the fietspad. */
export function Bikes() {
  const span = BIKE_EXTENT * 2

  return (
    <>
      {Array.from({ length: BIKE_COUNT }, (_, i) => {
        const startZ = -BIKE_EXTENT + (span * i) / BIKE_COUNT
        return (
          <Bike
            key={i}
            x={X_FIETSPAD}
            startZ={startZ}
            extent={BIKE_EXTENT}
            speed={BIKE_SPEED}
            direction={1}
          />
        )
      })}
    </>
  )
}
