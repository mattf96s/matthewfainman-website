import { Boat } from './Boat'
import { Duck } from './Duck'
import { X_CANAL } from './constants'

/**
 * Moored and drifting boats on the canal, plus a handful of birds.
 * Boats with driftZ ≠ 0 move slowly along the canal.
 */
export function CanalLife() {
  return (
    <>
      {/* moored to the west bank, facing north */}
      <Boat
        position={[X_CANAL - 2.4, -32]}
        rotationY={-Math.PI / 2}
        length={7}
        hasCabin
      />
      <Boat
        position={[X_CANAL - 2.4, -18]}
        rotationY={-Math.PI / 2}
        length={6}
        hullColor="#1f2820"
        deckColor="#695840"
        hasCabin={false}
      />
      <Boat
        position={[X_CANAL - 2.4, 6]}
        rotationY={-Math.PI / 2}
        length={6.5}
        hullColor="#3a2a1c"
        deckColor="#7a6850"
        hasCabin
      />
      <Boat
        position={[X_CANAL - 2.4, 22]}
        rotationY={-Math.PI / 2}
        length={5.5}
        hullColor="#2a3640"
        deckColor="#6a5840"
        hasCabin
      />

      {/* moored to the east bank, facing south */}
      <Boat
        position={[X_CANAL + 2.4, -24]}
        rotationY={Math.PI / 2}
        length={7}
        hullColor="#2a2018"
        deckColor="#85705a"
        cabinColor="#2a1f15"
        hasCabin
      />
      <Boat
        position={[X_CANAL + 2.4, -4]}
        rotationY={Math.PI / 2}
        length={6}
        hullColor="#1a2030"
        deckColor="#7a6555"
        hasCabin={false}
      />
      <Boat
        position={[X_CANAL + 2.4, 18]}
        rotationY={Math.PI / 2}
        length={6.5}
        hullColor="#352318"
        deckColor="#8a7155"
        cabinColor="#3c2818"
        hasCabin
      />

      {/* drifting boats down the canal centreline */}
      <Boat
        position={[X_CANAL, -10]}
        length={5.5}
        hullColor="#3c2818"
        deckColor="#90785a"
        cabinColor="#2a1f15"
        hasCabin
        driftZ={0.4}
      />
      <Boat
        position={[X_CANAL, 14]}
        rotationY={Math.PI}
        length={5}
        hullColor="#1f2c36"
        deckColor="#6a5840"
        hasCabin={false}
        driftZ={-0.3}
      />

      {/* birds */}
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
