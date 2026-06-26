import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { CANAL_DEPTH, CANAL_LENGTH } from './constants'

export type BoatVariant = 'open' | 'covered' | 'cabin' | 'houseboat'

interface BoatProps {
  position: [number, number]
  rotationY?: number
  length?: number
  width?: number
  hullColor?: string
  trimColor?: string
  /** Cabin / superstructure colour (houseboat + cabin variants). */
  cabinColor?: string
  /** Roof colour for the houseboat variant. */
  roofColor?: string
  /** "open" = bare hull, "covered" = rolled tarp over the middle,
   * "cabin" = small wheelhouse, "houseboat" = full-length living
   * quarters (woonboot). Defaults to "open". */
  variant?: BoatVariant
  /** If non-zero, the boat slowly drifts along the canal at this
   * speed (m/s). */
  driftZ?: number
}

const HULL_HEIGHT = 0.42
const CABIN_HEIGHT = 1.0
const COVER_HEIGHT = 0.28
const HOUSEBOAT_CABIN_HEIGHT = 1.5

/**
 * Stylised low-poly canal sloop. Hull is an extruded shape tapered at both
 * ends, sitting low in the water with a thin trim along the rim. The
 * superstructure is swapped per `variant` (see the Boat* components below).
 */
export function Boat({
  position: [x, z],
  rotationY = 0,
  length = 5.5,
  width = 1.7,
  hullColor = '#1d1a16',
  trimColor = '#d8d3c2',
  cabinColor,
  roofColor,
  variant = 'open',
  driftZ = 0,
}: BoatProps) {
  const group = useRef<THREE.Group>(null)
  const zPos = useRef(z)
  const phase = useRef(Math.random() * Math.PI * 2)

  // sit low in the water: the hull centre roughly at the waterline
  const waterY = -CANAL_DEPTH + 0.16
  const driftRange = CANAL_LENGTH / 2 - 4

  /** Pointed bow at +Z, slightly tapered stern at -Z. Hull shape lives
   * in the XY plane and is extruded along +Z; the mesh rotates it so
   * the extrusion becomes the hull height. */
  const hullGeometry = useMemo(() => {
    const halfW = width / 2
    const bowTipW = width * 0.18
    const sternTipW = width * 0.42
    const shape = new THREE.Shape()
    // start at the stern (port corner), trace clockwise
    shape.moveTo(-sternTipW / 2, -length / 2)
    shape.lineTo(sternTipW / 2, -length / 2)
    shape.lineTo(halfW, -length / 2 + 0.9)
    shape.lineTo(halfW, length / 2 - 1.5)
    shape.lineTo(bowTipW / 2, length / 2 - 0.3)
    shape.lineTo(-bowTipW / 2, length / 2 - 0.3)
    shape.lineTo(-halfW, length / 2 - 1.5)
    shape.lineTo(-halfW, -length / 2 + 0.9)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, {
      depth: HULL_HEIGHT,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 2,
    })
  }, [length, width])

  /** Slightly inset deck shape — same outline as hull but pulled in. */
  const deckGeometry = useMemo(() => {
    const halfW = width / 2 - 0.08
    const bowTipW = width * 0.18 - 0.06
    const sternTipW = width * 0.42 - 0.1
    const shape = new THREE.Shape()
    shape.moveTo(-sternTipW / 2, -length / 2 + 0.06)
    shape.lineTo(sternTipW / 2, -length / 2 + 0.06)
    shape.lineTo(halfW, -length / 2 + 0.94)
    shape.lineTo(halfW, length / 2 - 1.55)
    shape.lineTo(bowTipW / 2, length / 2 - 0.36)
    shape.lineTo(-bowTipW / 2, length / 2 - 0.36)
    shape.lineTo(-halfW, length / 2 - 1.55)
    shape.lineTo(-halfW, -length / 2 + 0.94)
    shape.closePath()
    return new THREE.ShapeGeometry(shape)
  }, [length, width])

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime + phase.current
    if (driftZ !== 0) {
      zPos.current += driftZ * delta
      if (zPos.current > driftRange) zPos.current = -driftRange
      else if (zPos.current < -driftRange) zPos.current = driftRange
    }
    group.current.position.x = x + Math.sin(t * 0.45) * 0.03
    group.current.position.y = waterY + Math.sin(t * 0.6) * 0.03
    group.current.position.z = zPos.current
    group.current.rotation.z = Math.sin(t * 0.4) * 0.012
  })

  // local-space y of the rim (top of the hull): the extrusion along +Z
  // becomes a downward range after the -90° X rotation, so the rim sits
  // at y = 0 in the rotated frame.
  const rimY = 0
  const deckY = rimY - 0.02
  const dims = { rimY, length, width }

  return (
    <group ref={group} position={[x, waterY, z]} rotation={[0, rotationY, 0]}>
      {/* hull — extruded shape rotated so depth becomes downward y */}
      <mesh receiveShadow geometry={hullGeometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={hullColor} roughness={0.9} />
      </mesh>

      {/* deck — a thin flat plate inset from the rim */}
      <mesh
        receiveShadow
        geometry={deckGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, deckY, 0]}
      >
        <meshStandardMaterial color="#8a6e4a" roughness={0.85} />
      </mesh>

      {/* gunwale trim — thin painted strip along the rim. No shadow:
        * it's tiny and the hull already shadows the same footprint. */}
      {[-1, 1].map((side) => (
        <mesh
          key={`gun-${side}`}
          position={[side * (width / 2 - 0.04), rimY + 0.04, 0]}
        >
          <boxGeometry args={[0.07, 0.08, length * 0.92]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
      ))}

      {variant === 'open' && <BoatOpen {...dims} />}
      {variant === 'covered' && <BoatCovered {...dims} />}
      {variant === 'cabin' && (
        <BoatCabin {...dims} cabinColor={cabinColor} roofColor={roofColor} />
      )}
      {variant === 'houseboat' && (
        <BoatHouseboat {...dims} cabinColor={cabinColor} roofColor={roofColor} />
      )}
    </group>
  )
}

interface BoatPartProps {
  rimY: number
  length: number
  width: number
}

interface BoatCabinProps extends BoatPartProps {
  cabinColor?: string
  roofColor?: string
}

/** A run of lit window panes down both sides of a cabin. Shared by the
 * wheelhouse and houseboat variants, which differ only in pane count,
 * spacing and tint. */
interface BoatWindowStripProps {
  /** Half-width of the cabin: the strip sits just outside each long face. */
  sideOffset: number
  y: number
  z: number
  bays: number[]
  spacing: number
  paneW: number
  paneH: number
  color: string
  emissive: string
  emissiveIntensity: number
  roughness: number
  metalness?: number
}

function BoatWindowStrip({
  sideOffset,
  y,
  z,
  bays,
  spacing,
  paneW,
  paneH,
  color,
  emissive,
  emissiveIntensity,
  roughness,
  metalness,
}: BoatWindowStripProps) {
  return (
    <>
      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * sideOffset, y, z]}
          rotation={[0, side > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          {bays.map((wi) => (
            <mesh key={wi} position={[wi * spacing, 0, 0]}>
              <planeGeometry args={[paneW, paneH]} />
              <meshStandardMaterial
                color={color}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
                roughness={roughness}
                metalness={metalness}
              />
            </mesh>
          ))}
        </group>
      ))}
    </>
  )
}

/** Bare hull: a plank seat near the stern + an outboard motor cowling. */
function BoatOpen({ rimY, length, width }: BoatPartProps) {
  return (
    <>
      <mesh position={[0, rimY - 0.06, -length * 0.28]}>
        <boxGeometry args={[width * 0.78, 0.08, 0.28]} />
        <meshStandardMaterial color="#7a5e3c" roughness={0.85} />
      </mesh>
      <mesh position={[0, rimY + 0.15, -length / 2 + 0.18]}>
        <boxGeometry args={[0.28, 0.42, 0.2]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.7} />
      </mesh>
    </>
  )
}

/** Rolled tarp / boat cover stretched over the middle, with a spine ridge. */
function BoatCovered({ rimY, length, width }: BoatPartProps) {
  return (
    <>
      <mesh position={[0, rimY + COVER_HEIGHT / 2, 0]}>
        <boxGeometry args={[width * 0.78, COVER_HEIGHT, length * 0.7]} />
        <meshStandardMaterial color="#15140f" roughness={0.98} />
      </mesh>
      <mesh position={[0, rimY + COVER_HEIGHT + 0.025, 0]}>
        <boxGeometry args={[0.08, 0.05, length * 0.72]} />
        <meshStandardMaterial color="#3a3a32" roughness={0.9} />
      </mesh>
    </>
  )
}

/** Small wheelhouse near the stern with a flat roof and side windows. */
function BoatCabin({ rimY, length, width, cabinColor, roofColor }: BoatCabinProps) {
  return (
    <>
      <mesh position={[0, rimY + CABIN_HEIGHT / 2, -length * 0.18]}>
        <boxGeometry args={[width * 0.78, CABIN_HEIGHT, length * 0.45]} />
        <meshStandardMaterial color={cabinColor ?? '#2e1f15'} roughness={0.7} />
      </mesh>
      <mesh position={[0, rimY + CABIN_HEIGHT + 0.04, -length * 0.18]}>
        <boxGeometry args={[width * 0.88, 0.08, length * 0.5]} />
        <meshStandardMaterial color={roofColor ?? '#15110d'} roughness={0.85} />
      </mesh>
      <BoatWindowStrip
        sideOffset={width * 0.39 + 0.005}
        y={rimY + CABIN_HEIGHT * 0.6}
        z={-length * 0.18}
        bays={[-1, 0, 1]}
        spacing={length * 0.12}
        paneW={length * 0.09}
        paneH={CABIN_HEIGHT * 0.4}
        color="#1a2a35"
        emissive="#2a4a5e"
        emissiveIntensity={0.18}
        roughness={0.2}
      />
    </>
  )
}

/** Full-length living quarters (woonboot): cabin, roof, window run, door,
 * chimney and a bow-end planter. */
function BoatHouseboat({
  rimY,
  length,
  width,
  cabinColor,
  roofColor,
}: BoatCabinProps) {
  const cabinLen = length * 0.82
  const cabinW = width * 0.88
  const cabinZ = -length * 0.04
  const cabin = cabinColor ?? '#d8c8a8'
  const roof = roofColor ?? '#2a221c'
  return (
    <>
      {/* main cabin / living quarters */}
      <mesh receiveShadow position={[0, rimY + HOUSEBOAT_CABIN_HEIGHT / 2, cabinZ]}>
        <boxGeometry args={[cabinW, HOUSEBOAT_CABIN_HEIGHT, cabinLen]} />
        <meshStandardMaterial color={cabin} roughness={0.85} />
      </mesh>
      {/* flat roof with slight overhang — cabin already shadows below */}
      <mesh position={[0, rimY + HOUSEBOAT_CABIN_HEIGHT + 0.04, cabinZ]}>
        <boxGeometry args={[cabinW + 0.18, 0.08, cabinLen + 0.18]} />
        <meshStandardMaterial color={roof} roughness={0.9} />
      </mesh>
      <BoatWindowStrip
        sideOffset={cabinW / 2 + 0.005}
        y={rimY + HOUSEBOAT_CABIN_HEIGHT * 0.58}
        z={cabinZ}
        bays={[-2, -1, 0, 1, 2]}
        spacing={cabinLen * 0.155}
        paneW={cabinLen * 0.11}
        paneH={HOUSEBOAT_CABIN_HEIGHT * 0.34}
        color="#1a2530"
        emissive="#c4a04a"
        emissiveIntensity={0.18}
        roughness={0.25}
        metalness={0.35}
      />
      {/* door at the bow end */}
      <mesh
        position={[0, rimY + HOUSEBOAT_CABIN_HEIGHT * 0.32, cabinZ + cabinLen / 2 + 0.005]}
      >
        <planeGeometry args={[cabinW * 0.22, HOUSEBOAT_CABIN_HEIGHT * 0.58]} />
        <meshStandardMaterial color="#3a2818" roughness={0.7} />
      </mesh>
      {/* chimney — narrow, no shadow */}
      <mesh
        position={[
          cabinW * 0.28,
          rimY + HOUSEBOAT_CABIN_HEIGHT + 0.4,
          cabinZ - cabinLen * 0.22,
        ]}
      >
        <boxGeometry args={[0.18, 0.6, 0.18]} />
        <meshStandardMaterial color="#2a201a" roughness={0.9} />
      </mesh>
      {/* small bow-end planter for a touch of green */}
      <mesh position={[0, rimY + 0.12, length * 0.42]}>
        <boxGeometry args={[width * 0.55, 0.18, 0.22]} />
        <meshStandardMaterial color="#3b4a2a" roughness={0.9} />
      </mesh>
    </>
  )
}
