import { BLOCK_LENGTH, X_HOUSE_SIDEWALK, X_NEAR_SIDEWALK } from '../world/constants'
import { Rat } from './Rat'

const EXTENT = BLOCK_LENGTH / 2 - 2

/**
 * Occasional rats scurrying along the canal-side sidewalk and the
 * house-side sidewalk. Long idle windows so they read as a surprise
 * rather than ambient traffic.
 */
export function Rats() {
  return (
    <>
      <Rat
        x={X_NEAR_SIDEWALK + 0.6}
        extent={EXTENT}
        speed={5}
        initialDelay={9}
        minIdle={14}
        maxIdle={32}
      />
      <Rat
        x={X_HOUSE_SIDEWALK - 0.6}
        extent={EXTENT}
        speed={5.5}
        initialDelay={18}
        minIdle={20}
        maxIdle={45}
      />
    </>
  )
}
