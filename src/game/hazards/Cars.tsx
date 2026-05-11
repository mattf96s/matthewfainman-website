import { Car } from './Car'
import { X_CAR_EAST, X_CAR_WEST } from '../world/constants'

const CAR_COLORS = ['#5e8aa8', '#a06a4a', '#7a5a7a', '#2d2d2d', '#c2b264', '#3a5a3a']

/**
 * A handful of cars on the outer lanes. West lane traffic goes south
 * (direction -1), east lane goes north.
 */
export function Cars() {
  return (
    <>
      <Car x={X_CAR_WEST} startZ={-12} direction={-1} speed={6} color={CAR_COLORS[0]} />
      <Car x={X_CAR_WEST} startZ={14} direction={-1} speed={8} color={CAR_COLORS[3]} />
      <Car x={X_CAR_WEST} startZ={-28} direction={-1} speed={5.5} color={CAR_COLORS[5]} />

      <Car x={X_CAR_EAST} startZ={2} direction={1} speed={6.5} color={CAR_COLORS[1]} />
      <Car x={X_CAR_EAST} startZ={-20} direction={1} speed={7} color={CAR_COLORS[2]} />
      <Car x={X_CAR_EAST} startZ={22} direction={1} speed={5.8} color={CAR_COLORS[4]} />
    </>
  )
}
