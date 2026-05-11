import { ROAD_WIDTH, X_ROAD } from './constants'

interface ZebraCrossingProps {
  z: number
}

const STRIPE_COUNT = 5
const STRIPE_WIDTH = 0.45 // along Z
const GAP_WIDTH = 0.45
const Y_LIFT = 0.012 // float a hair above the road to avoid z-fighting
const COLOR_PAINT = '#f1ece0'

/**
 * A simple zebra crossing: five white stripes running across the road
 * (X-axis), spaced evenly along the road direction (Z).
 */
export function ZebraCrossing({ z }: ZebraCrossingProps) {
  const totalSpan =
    STRIPE_COUNT * STRIPE_WIDTH + (STRIPE_COUNT - 1) * GAP_WIDTH
  const startZ = z - totalSpan / 2 + STRIPE_WIDTH / 2

  return (
    <group>
      {Array.from({ length: STRIPE_COUNT }, (_, i) => {
        const stripeZ = startZ + i * (STRIPE_WIDTH + GAP_WIDTH)
        return (
          <mesh
            key={i}
            position={[X_ROAD, Y_LIFT, stripeZ]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[ROAD_WIDTH, STRIPE_WIDTH]} />
            <meshStandardMaterial color={COLOR_PAINT} roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}
