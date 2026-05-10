import { Bridge } from './Bridge'
import { Canal } from './Canal'
import { CanalHouse } from './CanalHouse'
import { Street } from './Street'
import {
  BLOCK_LENGTH,
  HOUSE_BRICKS,
  X_HOUSE_FRONT,
} from './constants'

const HOUSE_WIDTH = 5
const HOUSE_DEPTH = 8
const HOUSE_GAP = 0.4

/**
 * Composes a single Amsterdam block: street strips, canal, a bridge, and
 * a row of narrow gabled houses along the east side.
 */
export function Block() {
  const houseCount = Math.floor(
    BLOCK_LENGTH / (HOUSE_WIDTH + HOUSE_GAP),
  )
  const stride = HOUSE_WIDTH + HOUSE_GAP
  const startZ = -((houseCount - 1) * stride) / 2

  return (
    <group>
      <Street />
      <Canal bridgeZ={0} bridgeWidth={4} />
      <Bridge z={0} width={4} />

      {Array.from({ length: houseCount }, (_, i) => {
        const z = startZ + i * stride
        const brick = HOUSE_BRICKS[i % HOUSE_BRICKS.length]!
        const heightVariation = 1.5 * Math.sin(i * 1.7)
        return (
          <CanalHouse
            key={i}
            position={[
              X_HOUSE_FRONT + HOUSE_DEPTH / 2,
              0,
              z,
            ]}
            width={HOUSE_WIDTH}
            depth={HOUSE_DEPTH}
            height={9 + heightVariation}
            rotationY={-Math.PI / 2}
            brick={brick}
          />
        )
      })}
    </group>
  )
}
