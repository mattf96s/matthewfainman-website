import { useMemo } from 'react'
import * as THREE from 'three'

interface RedLightWindowProps {
  x: number
  y: number
  width: number
  height: number
  /** Z of the front-of-house plane (silhouette renders just in front). */
  zFront: number
  /** When true, render the figure silhouette behind the curtain.
   * Empty windows just show the lit curtain — this keeps the row from
   * feeling stamped, mirroring how only some De Wallen windows are
   * occupied at any given moment. */
  withSilhouette?: boolean
}

/** Build a unit-height (-0.5 to +0.5 in Y) stylised female silhouette. */
function buildFigureShape(): THREE.Shape {
  const s = new THREE.Shape()

  // Trace clockwise from top of head down the right side, across feet,
  // up the left side. All coords are normalised to a 1-unit tall figure.
  s.moveTo(0, 0.5)
  s.bezierCurveTo(0.085, 0.5, 0.105, 0.46, 0.105, 0.42)
  s.bezierCurveTo(0.115, 0.36, 0.13, 0.32, 0.135, 0.28)
  s.lineTo(0.165, 0.24)
  s.bezierCurveTo(0.17, 0.22, 0.16, 0.18, 0.13, 0.13)
  s.bezierCurveTo(0.105, 0.08, 0.075, 0.04, 0.075, 0.0)
  s.bezierCurveTo(0.075, -0.04, 0.115, -0.08, 0.16, -0.1)
  s.bezierCurveTo(0.165, -0.14, 0.135, -0.22, 0.11, -0.3)
  s.bezierCurveTo(0.1, -0.38, 0.085, -0.46, 0.075, -0.5)
  s.lineTo(0.0, -0.5)
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

let cachedFigureGeometry: THREE.ShapeGeometry | null = null
function getFigureGeometry(): THREE.ShapeGeometry {
  if (cachedFigureGeometry) return cachedFigureGeometry
  cachedFigureGeometry = new THREE.ShapeGeometry(buildFigureShape())
  return cachedFigureGeometry
}

/** Fraction of total window height taken by the lit transom panel above. */
const TRANSOM_FRAC = 0.2
/** Vertical mullion thickness, fraction of window width. */
const VERT_MULLION_FRAC = 0.04
/** Horizontal mullion thickness, fraction of window height. */
const HORIZ_MULLION_FRAC = 0.018
/** Top neon strip height fraction (extends above the window pane). */
const NEON_TOP_FRAC = 0.11
/** Side neon strip width fraction. */
const NEON_SIDE_FRAC = 0.075

const COLOR_NEON = '#ff3b50'
const COLOR_NEON_EMIT = '#ff0c22'
const COLOR_TRANSOM = '#460a16'
const COLOR_TRANSOM_EMIT = '#ff1f36'
const COLOR_CURTAIN_BG = '#1c0508'
const COLOR_CURTAIN_BG_EMIT = '#4a0a16'
const COLOR_CURTAIN_FOLD = '#33060f'
const COLOR_CURTAIN_FOLD_EMIT = '#7a0e1c'
const COLOR_CURTAIN_DEEP = '#11020a'
const COLOR_FRAME = '#1a0407'
const COLOR_FIGURE = '#0a020a'
const COLOR_HANDLE = '#b09a78'
const COLOR_HANDLE_EMIT = '#8c6c40'

/**
 * A ground-floor cabin window styled after De Wallen: a glowing red
 * neon strip above a curtained doorway. The curtain is suggested by
 * vertical fold stripes and a dim background tint; a stylised
 * silhouette sits behind the curtain, partially visible between the
 * folds. A horizontal mullion divides the lit transom at the top from
 * the door panels below; a centre mullion splits the doorway into two
 * panes, each with a small brass handle.
 */
export function RedLightWindow({
  x,
  y,
  width,
  height,
  zFront,
  withSilhouette = false,
}: RedLightWindowProps) {
  const figureGeometry = useMemo(() => getFigureGeometry(), [])

  const transomH = height * TRANSOM_FRAC
  const mainH = height - transomH
  const mainY = -height / 2 + mainH / 2
  const transomY = height / 2 - transomH / 2

  const vertMullionW = width * VERT_MULLION_FRAC
  const horizMullionH = height * HORIZ_MULLION_FRAC
  const neonTopH = height * NEON_TOP_FRAC
  const neonSideW = width * NEON_SIDE_FRAC

  // Fit the figure within the lower (main) door pane, leaving a small
  // margin so the head doesn't clip the top mullion and the feet sit
  // just above the bottom edge.
  const figureScale = mainH * 0.86

  return (
    <group position={[x, y, zFront]}>
      {/* main pane — curtain-tinted dark backdrop */}
      <mesh position={[0, mainY, 0]}>
        <planeGeometry args={[width, mainH]} />
        <meshStandardMaterial
          color={COLOR_CURTAIN_BG}
          emissive={COLOR_CURTAIN_BG_EMIT}
          emissiveIntensity={0.55}
          roughness={0.55}
        />
      </mesh>

      {/* figure silhouette — rendered in FRONT of the curtain folds so
        * the figure reads clearly against the lit pane, like a girl
        * standing at the window. Z is just under the centre mullion so
        * the mullion still cuts cleanly across her. */}
      {withSilhouette && (
        <mesh
          geometry={figureGeometry}
          position={[0, mainY - mainH * 0.02, 0.0035]}
          scale={[figureScale, figureScale, 1]}
        >
          <meshStandardMaterial color={COLOR_FIGURE} roughness={0.7} />
        </mesh>
      )}

      {/* curtain folds — vertical stripes overlay the figure, alternating
        * a slightly lit "ridge" and a deeper "valley" tone */}
      {[-0.36, -0.18, 0.18, 0.36].map((u, i) => {
        const ridge = i % 2 === 0
        return (
          <mesh
            key={`fold-${i}`}
            position={[u * width, mainY, 0.002]}
          >
            <planeGeometry
              args={[width * (ridge ? 0.16 : 0.13), mainH * 0.92]}
            />
            <meshStandardMaterial
              color={ridge ? COLOR_CURTAIN_FOLD : COLOR_CURTAIN_DEEP}
              emissive={ridge ? COLOR_CURTAIN_FOLD_EMIT : COLOR_CURTAIN_BG_EMIT}
              emissiveIntensity={ridge ? 0.55 : 0.3}
              roughness={0.6}
            />
          </mesh>
        )
      })}

      {/* centre vertical mullion — splits doorway into two panes */}
      <mesh position={[0, mainY, 0.004]}>
        <planeGeometry args={[vertMullionW, mainH * 0.97]} />
        <meshStandardMaterial color={COLOR_FRAME} roughness={0.7} />
      </mesh>

      {/* brass door handles — one per pane */}
      {[-1, 1].map((s) => (
        <mesh
          key={`handle-${s}`}
          position={[s * width * 0.07, mainY - mainH * 0.12, 0.005]}
        >
          <planeGeometry args={[width * 0.025, mainH * 0.05]} />
          <meshStandardMaterial
            color={COLOR_HANDLE}
            emissive={COLOR_HANDLE_EMIT}
            emissiveIntensity={0.4}
            roughness={0.45}
            metalness={0.4}
          />
        </mesh>
      ))}

      {/* transom panel — bright lit strip running across the top of the
        * doorway, with the brightest red coming through the glass */}
      <mesh position={[0, transomY, 0]}>
        <planeGeometry args={[width, transomH]} />
        <meshStandardMaterial
          color={COLOR_TRANSOM}
          emissive={COLOR_TRANSOM_EMIT}
          emissiveIntensity={1.55}
          roughness={0.35}
        />
      </mesh>

      {/* slim mullions dividing the transom into four panes (matches the
        * reference's small-pane transom) */}
      {[-0.5, 0, 0.5].map((u, i) => (
        <mesh
          key={`tm-${i}`}
          position={[u * width * 0.5, transomY, 0.003]}
        >
          <planeGeometry args={[vertMullionW * 0.7, transomH * 0.92]} />
          <meshStandardMaterial color={COLOR_FRAME} roughness={0.7} />
        </mesh>
      ))}

      {/* horizontal mullion separating transom from doorway */}
      <mesh position={[0, transomY - transomH / 2, 0.004]}>
        <planeGeometry args={[width, horizMullionH]} />
        <meshStandardMaterial color={COLOR_FRAME} roughness={0.7} />
      </mesh>

      {/* top horizontal neon strip — extends past the window edges, mounted
        * onto the brick above the doorway */}
      <mesh
        position={[0, height / 2 + neonTopH / 2 + 0.01, 0.002]}
      >
        <planeGeometry args={[width + neonSideW * 2, neonTopH]} />
        <meshStandardMaterial
          color={COLOR_NEON}
          emissive={COLOR_NEON_EMIT}
          emissiveIntensity={2.6}
          roughness={0.25}
        />
      </mesh>

      {/* side vertical neon strips framing the doorway */}
      {[-1, 1].map((s) => (
        <mesh
          key={`side-${s}`}
          position={[
            s * (width / 2 + neonSideW / 2),
            0,
            0.001,
          ]}
        >
          <planeGeometry args={[neonSideW, height]} />
          <meshStandardMaterial
            color={COLOR_NEON}
            emissive={COLOR_NEON_EMIT}
            emissiveIntensity={2.1}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* soft red spill onto the surrounding brick — a wider, dimmer halo
        * behind everything, sitting just in front of the wall so it
        * reads as light bleed rather than a painted panel */}
      <mesh position={[0, height * 0.08, -0.002]}>
        <planeGeometry args={[width + neonSideW * 5, height * 1.5]} />
        <meshStandardMaterial
          color="#2a0508"
          emissive="#8a0c1c"
          emissiveIntensity={0.45}
          roughness={0.9}
          transparent
          opacity={0.65}
        />
      </mesh>
    </group>
  )
}
