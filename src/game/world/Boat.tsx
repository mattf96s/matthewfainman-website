import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { CANAL_DEPTH, CANAL_LENGTH } from './constants'

interface BoatProps {
  position: [number, number]
  rotationY?: number
  length?: number
  width?: number
  hullColor?: string
  deckColor?: string
  cabinColor?: string
  hasCabin?: boolean
  /** If non-zero, the boat slowly drifts along the canal at this speed
   * (m/s). Wraps within ±CANAL_LENGTH/2 - 5. */
  driftZ?: number
}

const HULL_HEIGHT = 0.55
const CABIN_HEIGHT = 1.1

/**
 * A more realistic canal boat: a tapered hull (wider at the deck,
 * narrower at the keel via the bow wedge), a roomy cabin with side
 * windows and a roof rail, plus side rails along the deck.
 */
export function Boat({
  position: [x, z],
  rotationY = 0,
  length = 7,
  width = 1.9,
  hullColor = '#2c241c',
  deckColor = '#8a7155',
  cabinColor = '#3c2e22',
  hasCabin = true,
  driftZ = 0,
}: BoatProps) {
  const group = useRef<THREE.Group>(null)
  const zPos = useRef(z)
  const phase = useRef(Math.random() * Math.PI * 2)

  const waterY = -CANAL_DEPTH + 0.22
  const driftRange = CANAL_LENGTH / 2 - 5

  // build a tapered hull shape (top-down trapezoid) so the bow is sharper
  const hullGeometry = useMemo(() => {
    const halfW = width / 2
    const tipW = width * 0.25
    const shape = new THREE.Shape()
    shape.moveTo(-halfW, -length / 2 + 1.5)
    shape.lineTo(halfW, -length / 2 + 1.5)
    shape.lineTo(halfW, length / 2 - 1.5)
    shape.lineTo(tipW, length / 2 - 0.3)
    shape.lineTo(-tipW, length / 2 - 0.3)
    shape.lineTo(-halfW, length / 2 - 1.5)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, {
      depth: HULL_HEIGHT,
      bevelEnabled: false,
    })
  }, [length, width])

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime + phase.current
    if (driftZ !== 0) {
      zPos.current += driftZ * delta
      if (zPos.current > driftRange) zPos.current = -driftRange
      else if (zPos.current < -driftRange) zPos.current = driftRange
    }
    group.current.position.x = x + Math.sin(t * 0.5) * 0.04
    group.current.position.y = waterY + Math.sin(t * 0.6) * 0.04
    group.current.position.z = zPos.current
    group.current.rotation.z = Math.sin(t * 0.4) * 0.015
  })

  return (
    <group
      ref={group}
      position={[x, waterY, z]}
      rotation={[0, rotationY, 0]}
    >
      {/* hull — extruded along Y so the shape sits flat */}
      <mesh
        castShadow
        receiveShadow
        geometry={hullGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color={hullColor} roughness={0.9} />
      </mesh>

      {/* deck floor */}
      <mesh position={[0, HULL_HEIGHT + 0.001, 0]}>
        <boxGeometry
          args={[width * 0.88, 0.06, length - 1.4]}
        />
        <meshStandardMaterial color={deckColor} roughness={0.75} />
      </mesh>

      {/* deck side rails — slim boxes running along Z */}
      {[-1, 1].map((side) => (
        <mesh
          key={`rail-${side}`}
          castShadow
          position={[side * (width / 2 - 0.04), HULL_HEIGHT + 0.18, 0]}
        >
          <boxGeometry args={[0.05, 0.06, length - 1.6]} />
          <meshStandardMaterial color="#d4d2c4" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}

      {hasCabin && (
        <>
          {/* cabin body */}
          <mesh
            castShadow
            position={[0, HULL_HEIGHT + CABIN_HEIGHT / 2, -length * 0.18]}
          >
            <boxGeometry
              args={[width * 0.82, CABIN_HEIGHT, length * 0.5]}
            />
            <meshStandardMaterial color={cabinColor} roughness={0.7} />
          </mesh>

          {/* cabin roof — slight overhang */}
          <mesh
            castShadow
            position={[0, HULL_HEIGHT + CABIN_HEIGHT + 0.04, -length * 0.18]}
          >
            <boxGeometry
              args={[width * 0.92, 0.08, length * 0.55]}
            />
            <meshStandardMaterial color="#1c1812" roughness={0.85} />
          </mesh>

          {/* cabin side windows */}
          {[-1, 1].map((side) => (
            <group
              key={`win-${side}`}
              position={[
                side * (width * 0.41 + 0.005),
                HULL_HEIGHT + CABIN_HEIGHT * 0.62,
                -length * 0.18,
              ]}
              rotation={[0, side > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
            >
              {[-1, 0, 1].map((wi) => (
                <mesh
                  key={wi}
                  position={[wi * (length * 0.13), 0, 0]}
                >
                  <planeGeometry
                    args={[length * 0.1, CABIN_HEIGHT * 0.45]}
                  />
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

          {/* front cabin window (faces +Z) */}
          <mesh
            position={[
              0,
              HULL_HEIGHT + CABIN_HEIGHT * 0.62,
              -length * 0.18 + length * 0.25 + 0.001,
            ]}
          >
            <planeGeometry
              args={[width * 0.7, CABIN_HEIGHT * 0.5]}
            />
            <meshStandardMaterial
              color="#1a2a35"
              emissive="#2a4a5e"
              emissiveIntensity={0.22}
              roughness={0.2}
            />
          </mesh>
        </>
      )}
    </group>
  )
}
