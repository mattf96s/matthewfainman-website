import { ParkedBike } from './ParkedBike'
import {
  X_HOUSE_SIDEWALK,
  X_NEAR_SIDEWALK,
} from './constants'

/** A scattering of parked / abandoned bikes along the sidewalks. */
export function ParkedBikes() {
  return (
    <>
      <ParkedBike position={[X_HOUSE_SIDEWALK + 0.8, -25]} rotationY={0.2} />
      <ParkedBike position={[X_HOUSE_SIDEWALK + 0.5, -24]} rotationY={-0.1} />
      <ParkedBike position={[X_HOUSE_SIDEWALK - 0.3, -23.2]} rotationY={0.5} fallen />

      <ParkedBike position={[X_NEAR_SIDEWALK - 0.6, -10]} rotationY={Math.PI / 2 + 0.2} />
      <ParkedBike position={[X_NEAR_SIDEWALK + 0.7, -9]} rotationY={-Math.PI / 2 - 0.05} fallen frameColor="#3b3a32" />

      <ParkedBike position={[X_HOUSE_SIDEWALK - 0.6, 4]} rotationY={Math.PI / 2 + 0.3} frameColor="#33252b" />
      <ParkedBike position={[X_HOUSE_SIDEWALK + 0.5, 5]} rotationY={Math.PI / 2 - 0.1} />
      <ParkedBike position={[X_HOUSE_SIDEWALK + 0.2, 6.1]} rotationY={0.6} fallen />

      <ParkedBike position={[X_NEAR_SIDEWALK + 0.4, 18]} rotationY={0.4} frameColor="#1c2a3c" />
      <ParkedBike position={[X_NEAR_SIDEWALK - 0.5, 19]} rotationY={-0.3} />

      <ParkedBike position={[X_HOUSE_SIDEWALK + 0.3, 24]} rotationY={Math.PI / 2 + 0.1} />
      <ParkedBike position={[X_HOUSE_SIDEWALK - 0.4, 25.2]} rotationY={Math.PI / 2 - 0.3} fallen />
    </>
  )
}
