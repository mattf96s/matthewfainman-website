import { useMemo } from 'react'
import * as THREE from 'three'

interface RedLightWindowProps {
  x: number
  y: number
  width: number
  height: number
  /** Z of the front-of-house plane (silhouette renders just in front). */
  zFront: number
}

/** Build a unit-height (-0.5 to +0.5 in Y) stylised female silhouette. */
function buildFigureShape(): THREE.Shape {
  const s = new THREE.Shape()

  // Trace clockwise from top of head down the right side, across feet,
  // up the left side. All coords are normalised to a 1-unit tall figure.
  s.moveTo(0, 0.5) // crown
  s.bezierCurveTo(0.085, 0.5, 0.105, 0.46, 0.105, 0.42) // right side of head
  s.bezierCurveTo(0.115, 0.36, 0.13, 0.32, 0.135, 0.28) // hair falling to shoulder
  s.lineTo(0.165, 0.24) // shoulder edge
  s.bezierCurveTo(0.17, 0.22, 0.16, 0.18, 0.13, 0.13) // upper arm taper
  s.bezierCurveTo(0.105, 0.08, 0.075, 0.04, 0.075, 0.0) // narrow waist
  s.bezierCurveTo(0.075, -0.04, 0.115, -0.08, 0.16, -0.1) // out to hips
  s.bezierCurveTo(0.165, -0.14, 0.135, -0.22, 0.11, -0.3) // thigh taper
  s.bezierCurveTo(0.1, -0.38, 0.085, -0.46, 0.075, -0.5) // calf to foot
  s.lineTo(0.0, -0.5) // foot tip
  s.lineTo(-0.075, -0.5)
  s.bezierCurveTo(-0.085, -0.46, -0.1, -0.38, -0.11, -0.3)
  s.bezierCurveTo(-0.135, -0.22, -0.165, -0.14, -0.16, -0.1)
  s.bezierCurveTo(-0.115, -0.08, -0.075, -0.04, -0.075, 0.0)
  s.bezierCurveTo(-0.075, 0.04, -0.105, 0.08, -0.13, 0.13)
  s.bezierCurveTo(-0.16, 0.18, -0.17, 0.22, -0.165, 0.24)
  s.lineTo(-0.135, 0.28)
  s.bezierCurveTo(-0.13, 0.32, -0.115, 0.36, -0.105, 0.42)
  s.bezierCurveTo(-0.105, 0.46, -0.085, 0.5, 0, 0.5)

  return s
}

// Cache the geometry — it's identical across every red-light window;
// each instance scales its mesh to fit.
let cachedFigureGeometry: THREE.ShapeGeometry | null = null
function getFigureGeometry(): THREE.ShapeGeometry {
  if (cachedFigureGeometry) return cachedFigureGeometry
  cachedFigureGeometry = new THREE.ShapeGeometry(buildFigureShape())
  return cachedFigureGeometry
}

/**
 * A ground-floor window styled after De Wallen: an emissive red plane
 * with a stylised female figure silhouette overlaid. Low-poly, no
 * detail beyond the recognisable shape.
 */
export function RedLightWindow({
  x,
  y,
  width,
  height,
  zFront,
}: RedLightWindowProps) {
  const figureGeometry = useMemo(() => getFigureGeometry(), [])

  // The figure is unit-tall, ~0.34 wide. Scale to fit the window with
  // a little padding so the silhouette doesn't touch the edges.
  const figureScale = height * 0.88

  return (
    <group position={[x, y, zFront]}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#3a0712"
          emissive="#ff1a2e"
          emissiveIntensity={1.6}
          roughness={0.4}
        />
      </mesh>

      <mesh
        geometry={figureGeometry}
        position={[0, 0, 0.002]}
        scale={[figureScale, figureScale, 1]}
      >
        <meshStandardMaterial color="#150207" />
      </mesh>
    </group>
  )
}
