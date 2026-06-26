import { Car } from './Car'
import { X_CAR_EAST, X_CAR_WEST } from '../world/constants'

/**
 * A light scatter of cars on the outer lanes — two each way, well spread
 * out. Mostly Teslas (the car you actually see everywhere in Amsterdam) in
 * the usual Tesla palette, with the occasional microcar for variety. Each
 * drives stop-and-go (see Car), so the gaps stay erratic. West lane goes
 * south (direction -1), east lane goes north.
 */
export function Cars() {
  return (
    <>
      <Car x={X_CAR_WEST} startZ={-8} direction={-1} speed={7} color="#e9e9ec" shape="tesla" />
      <Car x={X_CAR_WEST} startZ={26} direction={-1} speed={5} color="#8f9478" shape="microcar" />

      <Car x={X_CAR_EAST} startZ={6} direction={1} speed={7.5} color="#1b1d22" shape="tesla" />
      <Car x={X_CAR_EAST} startZ={-24} direction={1} speed={6.5} color="#34383e" shape="tesla" />
    </>
  )
}
