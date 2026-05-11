import { Boat } from './Boat'
import { Duck } from './Duck'
import { X_CANAL } from './constants'

/**
 * Moored boats and floating birds along the canal. Boats are static
 * (just gentle bobbing); ducks/swan/coots drift slowly.
 */
export function CanalLife() {
  return (
    <>
      {/* boats — moored along the canal length, offset to the side */}
      <Boat
        position={[X_CANAL + 2.5, -25]}
        rotationY={Math.PI / 2}
        length={7}
        hasCabin
      />
      <Boat
        position={[X_CANAL - 2.5, -8]}
        rotationY={-Math.PI / 2}
        length={5.5}
        hullColor="#1e2a32"
        deckColor="#6a5840"
      />
      <Boat
        position={[X_CANAL + 2.5, 12]}
        rotationY={Math.PI / 2}
        length={6.5}
        hullColor="#2a3640"
        deckColor="#7a6850"
        hasCabin
      />
      <Boat
        position={[X_CANAL - 2.2, 25]}
        rotationY={-Math.PI / 2}
        length={5}
        hullColor="#3a2820"
        deckColor="#8a7a60"
      />

      {/* ducks (brown), coot (dark with white beak), swan (white) */}
      <Duck position={[X_CANAL - 1.5, -15]} driftZ={0.3} />
      <Duck position={[X_CANAL + 0.5, -5]} driftZ={0.22} />
      <Duck
        position={[X_CANAL - 0.8, 5]}
        driftZ={-0.18}
        bodyColor="#1a1a1a"
        headColor="#0a0a0a"
        beakColor="#ffffff"
      />
      <Duck position={[X_CANAL + 1.0, 20]} driftZ={0.28} />
      <Duck
        position={[X_CANAL - 1.2, 32]}
        driftZ={-0.15}
        bodyColor="#f5f1ea"
        headColor="#f5f1ea"
        beakColor="#e07020"
        size={1.6}
      />
    </>
  )
}
