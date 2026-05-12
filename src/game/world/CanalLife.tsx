import { CuboidCollider, RigidBody } from '@react-three/rapier'

import { Boat, type BoatVariant } from './Boat'
import { Duck } from './Duck'
import { CANAL_DEPTH, CANAL_WIDTH, X_CANAL } from './constants'

interface MooredBoat {
  side: 'west' | 'east'
  z: number
  length?: number
  width?: number
  variant?: BoatVariant
  hullColor?: string
  trimColor?: string
  cabinColor?: string
  roofColor?: string
  /** If set, rotate 180° so the bow points -Z instead of +Z. Mixes
   * up the mooring direction along the bank. */
  flip?: boolean
}

/** Distance from canal centreline to the bank's inside face. */
const BANK_INNER = CANAL_WIDTH / 2
/** Small water gap between the bank and the moored boat's broadside. */
const BANK_GAP = 0.15

/** World Y of the boat's deck top, where the player stands. Matches the
 * `waterY` in `Boat.tsx` (waterline + a sliver) — bobbing is ignored
 * for the static collider. */
const BOAT_DECK_Y = -CANAL_DEPTH + 0.16
/** Half-height of the boat's deck collider — thick enough to catch the
 * player at high vertical speeds without poking above the visible deck. */
const BOAT_COLLIDER_HALF_H = 0.08

/**
 * Real Amsterdam canal boats sit moored *along* the bank — their long
 * axis runs parallel to the canal, broadside facing the water. The
 * mix below interleaves working sloops, covered hulls, the occasional
 * tour-boat wheelhouse, and full-length houseboats (woonboten) in a
 * spread of Amsterdam-ish colours: cream, dark green, terracotta,
 * navy, slate, weathered black.
 */
// Bridges sit at z=0 (CENTER, ±2 wide) and z=55 (NORTH, ±7 wide).
// Boats must stay outside z ∈ [-3, +3] and z ∈ [+47, +63] (1m margin)
// so cabins don't clip through bridge slabs.
const MOORED: MooredBoat[] = [
  // — west bank, south to north —
  // south stretch (z < -3)
  { side: 'west', z: -65, length: 5.4, width: 1.7, variant: 'open',
    hullColor: '#1e2628', trimColor: '#e0d4b8' },
  { side: 'west', z: -58, length: 5.6, width: 1.8, variant: 'covered',
    hullColor: '#1c1a14', trimColor: '#c2bca6' },
  { side: 'west', z: -50, length: 10, width: 2.7, variant: 'houseboat',
    hullColor: '#15140f', cabinColor: '#d9c8a5', roofColor: '#2a221a' },
  { side: 'west', z: -41, length: 5.4, width: 1.7, variant: 'open',
    hullColor: '#1a1814', trimColor: '#e8e1cf' },
  { side: 'west', z: -33, length: 5.6, width: 1.8, variant: 'covered',
    hullColor: '#1a242b', trimColor: '#c8b896' },
  { side: 'west', z: -25, length: 10, width: 2.7, variant: 'houseboat',
    hullColor: '#1f2a32', cabinColor: '#3a4a2a', roofColor: '#1a1410' },
  { side: 'west', z: -16, length: 5.4, width: 1.7, variant: 'open',
    hullColor: '#3a2818', trimColor: '#dac9a4', flip: true },
  { side: 'west', z: -8, length: 5.4, width: 1.8, variant: 'cabin',
    hullColor: '#2c1d14', cabinColor: '#7a3a2c', roofColor: '#1a100a' },
  // between bridges (3 < z < 47)
  { side: 'west', z: 7, length: 5.4, width: 1.7, variant: 'open',
    hullColor: '#1f1c14', trimColor: '#b8a87a' },
  { side: 'west', z: 14, length: 5.6, width: 1.8, variant: 'covered',
    hullColor: '#171513', trimColor: '#a89270', flip: true },
  { side: 'west', z: 22, length: 6, width: 2.4, variant: 'houseboat',
    hullColor: '#101010', cabinColor: '#c3a87a', roofColor: '#2a4038' },
  { side: 'west', z: 30, length: 5.4, width: 1.8, variant: 'open',
    hullColor: '#1a1812', trimColor: '#dad0b2' },
  { side: 'west', z: 37, length: 5.6, width: 1.7, variant: 'covered',
    hullColor: '#1c1a14', trimColor: '#c6c0a8' },
  { side: 'west', z: 44, length: 5.4, width: 1.8, variant: 'cabin',
    hullColor: '#1a2638', cabinColor: '#284038', roofColor: '#15110d' },
  // north of NORTH_BRIDGE (z > 63)
  { side: 'west', z: 67, length: 5.4, width: 1.7, variant: 'open',
    hullColor: '#1c1a14', trimColor: '#dad0b2' },

  // — east bank, south to north —
  { side: 'east', z: -65, length: 5.4, width: 1.8, variant: 'covered',
    hullColor: '#1a1812', trimColor: '#a89270' },
  { side: 'east', z: -58, length: 5.6, width: 1.8, variant: 'open',
    hullColor: '#16151a', trimColor: '#d6c45a' },
  { side: 'east', z: -50, length: 10, width: 2.7, variant: 'houseboat',
    hullColor: '#1a1612', cabinColor: '#2f4a3a', roofColor: '#1a1a14',
    flip: true },
  { side: 'east', z: -41, length: 5.6, width: 1.8, variant: 'open',
    hullColor: '#1f1c16', trimColor: '#e6d8b0', flip: true },
  { side: 'east', z: -33, length: 5.4, width: 1.7, variant: 'covered',
    hullColor: '#1e1816', trimColor: '#c6c0a8' },
  { side: 'east', z: -25, length: 10, width: 2.6, variant: 'houseboat',
    hullColor: '#0e1f24', cabinColor: '#a8826b', roofColor: '#2a1a14',
    flip: true },
  { side: 'east', z: -16, length: 5.6, width: 1.8, variant: 'covered',
    hullColor: '#1f1816', trimColor: '#b6a472' },
  { side: 'east', z: -8, length: 5, width: 1.7, variant: 'cabin',
    hullColor: '#231918', cabinColor: '#284038', roofColor: '#1a1410' },
  // between bridges
  { side: 'east', z: 7, length: 5.4, width: 1.7, variant: 'open',
    hullColor: '#2c241c', trimColor: '#e6d8b0', flip: true },
  { side: 'east', z: 14, length: 5.6, width: 1.8, variant: 'covered',
    hullColor: '#1f1816', trimColor: '#b6a472' },
  { side: 'east', z: 22, length: 6, width: 2.5, variant: 'houseboat',
    hullColor: '#15161c', cabinColor: '#f0e5cc', roofColor: '#3a1a1a' },
  { side: 'east', z: 30, length: 5.4, width: 1.7, variant: 'open',
    hullColor: '#2a221c', trimColor: '#d4c290' },
  { side: 'east', z: 37, length: 5.6, width: 1.8, variant: 'covered',
    hullColor: '#171513', trimColor: '#c2b88e' },
  { side: 'east', z: 44, length: 5.4, width: 1.7, variant: 'open',
    hullColor: '#2c241c', trimColor: '#e0d2a8' },
  // north of NORTH_BRIDGE
  { side: 'east', z: 67, length: 5.4, width: 1.7, variant: 'covered',
    hullColor: '#1a1612', trimColor: '#b8a87a' },
]

/**
 * Densely-moored canal boats: a long row along each bank with mixed
 * sloops, covered hulls, wheelhouses, and houseboats. Plus two
 * drifting boats down the centreline and a handful of birds.
 */
export function CanalLife() {
  return (
    <>
      {MOORED.map((b, i) => {
        const width = b.width ?? 1.7
        const length = b.length ?? 5.4
        // Sit the boat's broadside flush against the bank with a small
        // water gap. Centre X is bank_inner_edge ± (gap + half_width).
        const inset = BANK_GAP + width / 2
        const x =
          b.side === 'west'
            ? X_CANAL - BANK_INNER + inset
            : X_CANAL + BANK_INNER - inset
        // Long axis along Z — boats parallel to the canal. Flip 180°
        // for some boats to vary which way the bow points.
        const rotY = b.flip ? Math.PI : 0
        return (
          <group key={`boat-${i}`}>
            <Boat
              position={[x, b.z]}
              rotationY={rotY}
              length={length}
              width={width}
              variant={b.variant ?? 'open'}
              hullColor={b.hullColor}
              trimColor={b.trimColor}
              cabinColor={b.cabinColor}
              roofColor={b.roofColor}
            />
            {/* Static deck collider so the player can stand on / hop
              * between boats. The visible boat bobs ±0.03 m; we ignore
              * that and put the collider at the resting deck level. */}
            <RigidBody type="fixed" colliders={false} position={[x, BOAT_DECK_Y, b.z]}>
              <CuboidCollider
                args={[width / 2 * 0.85, BOAT_COLLIDER_HALF_H, length / 2 * 0.85]}
              />
            </RigidBody>
          </group>
        )
      })}

      {/* drifting boats down the canal centreline */}
      <Boat
        position={[X_CANAL, -12]}
        length={5.5}
        variant="open"
        hullColor="#1c1a14"
        trimColor="#e4d8b6"
        driftZ={0.35}
      />
      <Boat
        position={[X_CANAL, 12]}
        rotationY={Math.PI}
        length={5}
        variant="covered"
        hullColor="#1a2a36"
        trimColor="#c8b896"
        driftZ={-0.25}
      />

      {/* birds */}
      <Duck position={[X_CANAL - 1.6, -15]} driftZ={0.3} />
      <Duck position={[X_CANAL + 0.3, -3]} driftZ={0.22} />
      <Duck
        position={[X_CANAL - 0.4, 7]}
        driftZ={-0.18}
        bodyColor="#1a1a1a"
        headColor="#0a0a0a"
        beakColor="#ffffff"
      />
      <Duck position={[X_CANAL + 1.0, 22]} driftZ={0.28} />
      <Duck
        position={[X_CANAL - 1.0, 32]}
        driftZ={-0.15}
        bodyColor="#f5f1ea"
        headColor="#f5f1ea"
        beakColor="#e07020"
        size={1.6}
      />
      <Duck position={[X_CANAL + 1.6, -40]} driftZ={0.2} />
      <Duck position={[X_CANAL - 0.6, 44]} driftZ={-0.22} />
    </>
  )
}
