import { Bin } from './Bin'
import { X_HOUSE_SIDEWALK, X_NEAR_SIDEWALK } from './constants'

/** Where the bins live in the world. Statiegeld collector walks between these. */
export const BIN_POSITIONS: ReadonlyArray<readonly [number, number]> = [
  [X_NEAR_SIDEWALK, -18],
  [X_HOUSE_SIDEWALK, -8],
  [X_NEAR_SIDEWALK, 12],
  [X_HOUSE_SIDEWALK, 22],
] as const

export function Bins() {
  return (
    <>
      {BIN_POSITIONS.map(([x, z], i) => (
        <Bin key={i} position={[x, z]} />
      ))}
    </>
  )
}
