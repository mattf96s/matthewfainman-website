import { useMemo } from 'react'
import * as THREE from 'three'

export type CarShape = 'tesla' | 'microcar'

/** Footprint per shape — drives the manual hit AABB in Car and the
 * parked-car colliders. */
export const CAR_DIMS: Record<
  CarShape,
  { length: number; width: number; height: number }
> = {
  tesla: { length: 4.6, width: 1.86, height: 1.44 },
  microcar: { length: 2.6, width: 1.6, height: 1.65 },
}

interface CarBodyProps {
  color: string
  /** Register a tail-light material so Car can flare it under braking. */
  registerTailMat: (index: number, m: THREE.MeshStandardMaterial | null) => void
}

/**
 * Build an extruded side-profile body. `points` are [length, height] in a
 * length-centred frame (rear negative, front positive, ground at y=0); the
 * result is reoriented so the silhouette runs along Z with the nose at +Z
 * and the width along X.
 */
function profileGeometry(
  points: readonly [number, number][],
  width: number,
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(points[0]![0], points[0]![1])
  for (let i = 1; i < points.length; i++) shape.lineTo(points[i]![0], points[i]![1])
  shape.closePath()
  const geo = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false })
  geo.translate(0, 0, -width / 2) // centre across the width
  geo.rotateY(-Math.PI / 2) // length → +Z (nose), width → X
  return geo
}

function Wheels({
  axle,
  radius,
  halfWidth,
  rim = false,
}: {
  axle: number
  radius: number
  halfWidth: number
  /** Show an alloy hub (Tesla); microcars keep plain black wheels. */
  rim?: boolean
}) {
  const spots: [number, number][] = [
    [halfWidth, axle],
    [-halfWidth, axle],
    [halfWidth, -axle],
    [-halfWidth, -axle],
  ]
  return (
    <>
      {spots.map(([wx, wz], i) => (
        <group key={i} position={[wx, radius, wz]} rotation={[0, 0, Math.PI / 2]}>
          {/* tyre */}
          <mesh castShadow>
            <cylinderGeometry args={[radius, radius, 0.2, 16]} />
            <meshStandardMaterial color="#16161a" roughness={0.85} />
          </mesh>
          {/* alloy hub — slightly longer than the tyre so the grey face
            * shows in the centre of the black tyre ring on both sides */}
          {rim && (
            <mesh>
              <cylinderGeometry args={[radius * 0.62, radius * 0.62, 0.24, 16]} />
              <meshStandardMaterial color="#bdc1c7" roughness={0.4} metalness={0.5} />
            </mesh>
          )}
        </group>
      ))}
    </>
  )
}

// ---- Tesla (sleek fastback sedan) ----

// Lower body up to the beltline (full width). A short tail and long cabin
// give the Model 3's liftback stance; extra vertices round the nose/tail.
const TESLA_LOWER: readonly [number, number][] = [
  [-2.3, 0.34],
  [-2.33, 0.52],
  [-2.26, 0.7],
  [-2.05, 0.82], // short trunk shoulder
  [-1.95, 0.84],
  [1.08, 0.84], // beltline → cowl (moderate hood, not cab-forward)
  [1.62, 0.77],
  [2.02, 0.66],
  [2.26, 0.52],
  [2.36, 0.42],
  [2.3, 0.32],
  [2.16, 0.28],
]
// Greenhouse: one continuous arched roofline (Model 3 signature) — a
// moderately raked windshield flows to a broad peak just behind centre,
// then a long smooth fastback down to a short tail. No flat roof section,
// so it reads sleek rather than as a square notchback. Narrower than the
// body for tumblehome.
const TESLA_GLASS: readonly [number, number][] = [
  [1.08, 0.84],
  [0.55, 1.16],
  [0.05, 1.34],
  [-0.5, 1.4],
  [-1.05, 1.36],
  [-1.5, 1.18],
  [-1.8, 0.98],
  [-1.95, 0.84],
]

function TeslaBody({ color, registerTailMat }: CarBodyProps) {
  const { bodyGeo, glassGeo } = useMemo(
    () => ({
      bodyGeo: profileGeometry(TESLA_LOWER, CAR_DIMS.tesla.width),
      glassGeo: profileGeometry(TESLA_GLASS, 1.62),
    }),
    [],
  )

  return (
    <group>
      <mesh geometry={bodyGeo} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} flatShading />
      </mesh>
      <mesh geometry={glassGeo}>
        <meshStandardMaterial color="#141a22" roughness={0.1} metalness={0.6} flatShading />
      </mesh>

      <Wheels axle={1.46} radius={0.34} halfWidth={0.9} rim />

      {/* sleek dark headlight units with a faint LED accent */}
      {[-0.6, 0.6].map((wx) => (
        <mesh key={wx} position={[wx, 0.62, 2.18]}>
          <boxGeometry args={[0.5, 0.1, 0.06]} />
          <meshStandardMaterial
            color="#1a1d22"
            emissive="#cfe0ff"
            emissiveIntensity={0.25}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* full-width tail light bar (the Tesla cue) */}
      <mesh position={[0, 0.62, -2.32]}>
        <boxGeometry args={[1.42, 0.1, 0.05]} />
        <meshStandardMaterial
          ref={(m) => registerTailMat(0, m)}
          color="#c22"
          emissive="#e23838"
          emissiveIntensity={0.55}
        />
      </mesh>
    </group>
  )
}

// ---- Microcar (tall, stubby bubble car) ----

const MICRO_LOWER: readonly [number, number][] = [
  [-1.3, 0.3],
  [-1.3, 0.86],
  [1.02, 0.86],
  [1.24, 0.62],
  [1.3, 0.46],
  [1.28, 0.3],
]
const MICRO_GLASS: readonly [number, number][] = [
  [1.02, 0.86],
  [0.8, 1.46],
  [0.55, 1.6],
  [-0.95, 1.6],
  [-1.22, 1.42],
  [-1.3, 1.0],
  [-1.3, 0.86],
]

function MicrocarBody({ color, registerTailMat }: CarBodyProps) {
  const { bodyGeo, glassGeo } = useMemo(
    () => ({
      bodyGeo: profileGeometry(MICRO_LOWER, CAR_DIMS.microcar.width),
      glassGeo: profileGeometry(MICRO_GLASS, CAR_DIMS.microcar.width - 0.14),
    }),
    [],
  )

  return (
    <group>
      <mesh geometry={bodyGeo} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} flatShading />
      </mesh>
      <mesh geometry={glassGeo}>
        <meshStandardMaterial color="#12171d" roughness={0.12} metalness={0.5} flatShading />
      </mesh>

      <Wheels axle={0.92} radius={0.38} halfWidth={0.72} />

      {/* stubby round-ish headlights */}
      {[-0.5, 0.5].map((wx) => (
        <mesh key={wx} position={[wx, 0.58, 1.24]}>
          <boxGeometry args={[0.3, 0.16, 0.05]} />
          <meshStandardMaterial color="#f2f4f6" emissive="#ffedb0" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* twin tail lights */}
      {[-0.5, 0.5].map((wx, i) => (
        <mesh key={wx} position={[wx, 0.7, -1.28]}>
          <boxGeometry args={[0.26, 0.16, 0.05]} />
          <meshStandardMaterial
            ref={(m) => registerTailMat(i, m)}
            color="#c22"
            emissive="#e23838"
            emissiveIntensity={0.55}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Procedural car body, selected by shape. Designed ground-relative
 * (wheels touch y=0) and facing +Z. */
export function CarBody({
  shape,
  color,
  registerTailMat,
}: CarBodyProps & { shape: CarShape }) {
  return shape === 'microcar' ? (
    <MicrocarBody color={color} registerTailMat={registerTailMat} />
  ) : (
    <TeslaBody color={color} registerTailMat={registerTailMat} />
  )
}
