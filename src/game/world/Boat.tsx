import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { CANAL_DEPTH, CANAL_LENGTH } from './constants'

export type BoatVariant = 'open' | 'covered' | 'cabin'

interface BoatProps {
  position: [number, number]
  rotationY?: number
  length?: number
  width?: number
  hullColor?: string
  trimColor?: string
  /** "open" = bare hull, "covered" = rolled tarp over the middle,
   * "cabin" = small wheelhouse. Defaults to "open". */
  variant?: BoatVariant
  /** If non-zero, the boat slowly drifts along the canal at this
   * speed (m/s). */
  driftZ?: number
}

const HULL_HEIGHT = 0.42
const CABIN_HEIGHT = 1.0
const COVER_HEIGHT = 0.28

/**
 * Stylised low-poly canal sloop. Hull is an extruded shape tapered
 * at both ends. Sits low in the water with a thin trim along the
 * rim. Three variants for visual variety: open (bare), covered
 * (rolled-tarp middle), cabin (small wheelhouse).
 */
export function Boat({
  position: [x, z],
  rotationY = 0,
  length = 5.5,
  width = 1.7,
  hullColor = '#1d1a16',
  trimColor = '#d8d3c2',
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

  // local-space y of the rim (top of the hull), since the extrusion
  // along +Z becomes a downward range after the -90° X rotation, the
  // rim sits at y = 0 in the rotated frame.
  const rimY = 0
  const deckY = rimY - 0.02

  return (
    <group ref={group} position={[x, waterY, z]} rotation={[0, rotationY, 0]}>
      {/* hull — extruded shape rotated so depth becomes downward y */}
      <mesh
        castShadow
        receiveShadow
        geometry={hullGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
      >
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

      {/* gunwale trim — thin painted strip along the rim */}
      {[-1, 1].map((side) => (
        <mesh
          key={`gun-${side}`}
          castShadow
          position={[side * (width / 2 - 0.04), rimY + 0.04, 0]}
        >
          <boxGeometry args={[0.07, 0.08, length * 0.92]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
      ))}

      {variant === 'covered' && (
        <>
          {/* rolled tarp / boat cover stretched over the middle */}
          <mesh
            castShadow
            position={[0, rimY + COVER_HEIGHT / 2, 0]}
          >
            <boxGeometry
              args={[width * 0.78, COVER_HEIGHT, length * 0.7]}
            />
            <meshStandardMaterial
              color="#15140f"
              roughness={0.98}
            />
          </mesh>
          {/* ridge along the spine */}
          <mesh
            castShadow
            position={[0, rimY + COVER_HEIGHT + 0.025, 0]}
          >
            <boxGeometry args={[0.08, 0.05, length * 0.72]} />
            <meshStandardMaterial color="#3a3a32" roughness={0.9} />
          </mesh>
        </>
      )}

      {variant === 'cabin' && (
        <>
          <mesh
            castShadow
            position={[0, rimY + CABIN_HEIGHT / 2, -length * 0.18]}
          >
            <boxGeometry
              args={[width * 0.78, CABIN_HEIGHT, length * 0.45]}
            />
            <meshStandardMaterial color="#2e1f15" roughness={0.7} />
          </mesh>
          <mesh
            castShadow
            position={[0, rimY + CABIN_HEIGHT + 0.04, -length * 0.18]}
          >
            <boxGeometry
              args={[width * 0.88, 0.08, length * 0.5]}
            />
            <meshStandardMaterial color="#15110d" roughness={0.85} />
          </mesh>
          {[-1, 1].map((side) => (
            <group
              key={`cwin-${side}`}
              position={[
                side * (width * 0.39 + 0.005),
                rimY + CABIN_HEIGHT * 0.6,
                -length * 0.18,
              ]}
              rotation={[0, side > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
            >
              {[-1, 0, 1].map((wi) => (
                <mesh key={wi} position={[wi * (length * 0.12), 0, 0]}>
                  <planeGeometry args={[length * 0.09, CABIN_HEIGHT * 0.4]} />
                  <meshStandardMaterial
                    color="#1a2a35"
                    emissive="#2a4a5e"
                    emissiveIntensity={0.18}
                    roughness={0.2}
                  />
                </mesh>
              ))}
            </group>
          ))}
        </>
      )}

      {variant === 'open' && (
        <>
          {/* simple plank seat across the boat near the stern */}
          <mesh
            castShadow
            position={[0, rimY - 0.06, -length * 0.28]}
          >
            <boxGeometry args={[width * 0.78, 0.08, 0.28]} />
            <meshStandardMaterial color="#7a5e3c" roughness={0.85} />
          </mesh>
          {/* outboard motor cowling at the stern */}
          <mesh
            castShadow
            position={[0, rimY + 0.15, -length / 2 + 0.18]}
          >
            <boxGeometry args={[0.28, 0.42, 0.2]} />
            <meshStandardMaterial color="#1c1c1c" roughness={0.7} />
          </mesh>
        </>
      )}
    </group>
  )
}
