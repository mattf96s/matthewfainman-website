import { Car } from './Car'
import { X_CAR_EAST, X_CAR_WEST } from '../world/constants'

const CAR_COLORS = ['#5e8aa8', '#a06a4a', '#7a5a7a', '#2d2d2d', '#c2b264', '#3a5a3a']

/**
 * A light scatter of cars on the outer lanes — two each way, well spread
 * out. Each drives stop-and-go (see Car), so the gaps stay erratic and
 * the street never feels like a steady conveyor. West lane goes south
 * (direction -1), east lane goes north.
 */
export function Cars() {
  return (
    <>
      <Car x={X_CAR_WEST} startZ={-8} direction={-1} speed={7} color={CAR_COLORS[0]} />
      <Car x={X_CAR_WEST} startZ={26} direction={-1} speed={6} color={CAR_COLORS[3]} />

      <Car x={X_CAR_EAST} startZ={6} direction={1} speed={7.5} color={CAR_COLORS[1]} />
      <Car x={X_CAR_EAST} startZ={-24} direction={1} speed={6.5} color={CAR_COLORS[4]} />
    </>
  )
}
