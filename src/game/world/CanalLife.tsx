import { Boat, type BoatVariant } from './Boat'
import { Duck } from './Duck'
import { CANAL_WIDTH, X_CANAL } from './constants'

interface MooredBoat {
  side: 'west' | 'east'
  z: number
  length?: number
  width?: number
  variant?: BoatVariant
  hullColor?: string
  trimColor?: string
}

// distance from canal centreline to the bank-side row of moored boats
const SIDE_OFFSET = CANAL_WIDTH / 2 - 1.05

const MOORED: MooredBoat[] = [
  { side: 'west', z: -54, length: 5.5, variant: 'covered', hullColor: '#1c1a14' },
  { side: 'west', z: -48, length: 5, variant: 'open', hullColor: '#211e16' },
  { side: 'west', z: -42, length: 5.5, variant: 'cabin', hullColor: '#1a2638' },
  { side: 'west', z: -36, length: 5, variant: 'open', hullColor: '#1f1a14' },
  { side: 'west', z: -32, length: 5.5, variant: 'open' },
  { side: 'west', z: -26, length: 5, variant: 'covered', hullColor: '#1a242b' },
  { side: 'west', z: -20.5, length: 5.5, variant: 'covered', hullColor: '#191815' },
  { side: 'west', z: -14, length: 4.8, variant: 'open', hullColor: '#1f1a14', trimColor: '#c2bca6' },
  { side: 'west', z: -8, length: 6, variant: 'covered', hullColor: '#15161c' },
  { side: 'west', z: -1.5, length: 5, variant: 'open', hullColor: '#2c241c' },
  { side: 'west', z: 5, length: 5.5, variant: 'cabin', hullColor: '#1a2a36' },
  { side: 'west', z: 11.5, length: 5, variant: 'covered', hullColor: '#1c1a14' },
  { side: 'west', z: 18, length: 5.5, variant: 'open', trimColor: '#dce0d6' },
  { side: 'west', z: 24, length: 5, variant: 'covered', hullColor: '#171513' },
  { side: 'west', z: 30, length: 5.2, variant: 'open', hullColor: '#1a1812' },
  { side: 'west', z: 36, length: 5, variant: 'covered', hullColor: '#1a242b' },
  { side: 'west', z: 42, length: 5.5, variant: 'open', hullColor: '#1f1c16' },
  { side: 'west', z: 48, length: 5, variant: 'covered', hullColor: '#15161c' },

  { side: 'east', z: -52, length: 5, variant: 'open', hullColor: '#1f1a14' },
  { side: 'east', z: -46, length: 5.5, variant: 'covered', hullColor: '#171513' },
  { side: 'east', z: -40, length: 5, variant: 'open', hullColor: '#23201a' },
  { side: 'east', z: -34, length: 5.5, variant: 'cabin', hullColor: '#1c1a14' },
  { side: 'east', z: -30, length: 5, variant: 'covered', hullColor: '#15161c' },
  { side: 'east', z: -24, length: 5.5, variant: 'open' },
  { side: 'east', z: -18, length: 4.8, variant: 'covered', hullColor: '#1e1614' },
  { side: 'east', z: -11.5, length: 5.5, variant: 'cabin', hullColor: '#23191a' },
  { side: 'east', z: -5, length: 5, variant: 'open', trimColor: '#e6e0c8' },
  { side: 'east', z: 1.5, length: 5.5, variant: 'covered', hullColor: '#1a242b' },
  { side: 'east', z: 8, length: 5, variant: 'open', hullColor: '#1f1c16' },
  { side: 'east', z: 14, length: 5.8, variant: 'covered', hullColor: '#171513' },
  { side: 'east', z: 20.5, length: 5, variant: 'open', hullColor: '#2c241c' },
  { side: 'east', z: 27, length: 5.5, variant: 'covered', hullColor: '#1a1812' },
  { side: 'east', z: 33, length: 5, variant: 'open', hullColor: '#1f1c16' },
  { side: 'east', z: 40, length: 5.5, variant: 'covered', hullColor: '#1a1812' },
  { side: 'east', z: 46, length: 5, variant: 'cabin', hullColor: '#1a2a36' },
]

/**
 * Densely-moored canal boats: a long row along each bank with a mix
 * of open / covered / cabin variants. Plus two drifting boats down
 * the centreline and a handful of birds.
 */
export function CanalLife() {
  return (
    <>
      {MOORED.map((b, i) => {
        const x =
          b.side === 'west' ? X_CANAL - SIDE_OFFSET : X_CANAL + SIDE_OFFSET
        const rotY = b.side === 'west' ? -Math.PI / 2 : Math.PI / 2
        return (
          <Boat
            key={`boat-${i}`}
            position={[x, b.z]}
            rotationY={rotY}
            length={b.length}
            width={b.width}
            variant={b.variant ?? 'open'}
            hullColor={b.hullColor}
            trimColor={b.trimColor}
          />
        )
      })}

      {/* drifting boats down the canal centreline */}
      <Boat
        position={[X_CANAL, -12]}
        length={5.5}
        variant="open"
        hullColor="#1c1a14"
        driftZ={0.35}
      />
      <Boat
        position={[X_CANAL, 12]}
        rotationY={Math.PI}
        length={5}
        variant="covered"
        hullColor="#1a2a36"
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
