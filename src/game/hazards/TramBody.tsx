interface TramBodyProps {
  length: number
  width: number
  height: number
}

const COLOR_BLUE = '#0066b3'
const COLOR_WHITE = '#ecebe5'
const COLOR_GLASS = '#16202b'
const COLOR_SKIRT = '#272a30'
const COLOR_ACCORDION = '#1c1c1c'
const COLOR_BOGIE = '#141414'
const COLOR_TRIM = '#7a8696'
const COLOR_MULLION = '#0a0a0a'
const COLOR_DOOR = '#005594'

/**
 * Visual body of a GVB Combino-style articulated tram, in local space
 * with the nose facing +Z. Bands stacked bottom→top:
 *   dark skirt, GVB blue band, dark window strip, white roof.
 * Plus three bogies underneath, two accordion joints, vertical window
 * mullions, side doors, pantograph, and head/tail lights.
 */
export function TramBody({ length, width, height }: TramBodyProps) {
  // y-band layout: 0 at body centre; body spans [-h/2, +h/2]
  const skirtH = 0.45
  const blueH = 0.7
  const windowH = 1.0
  const roofH = height - skirtH - blueH - windowH

  const y0 = -height / 2
  const ySkirt = y0 + skirtH / 2
  const yBlue = y0 + skirtH + blueH / 2
  const yWindow = y0 + skirtH + blueH + windowH / 2
  const yRoof = y0 + skirtH + blueH + windowH + roofH / 2

  // slight inset so layers read as separate bands rather than one slab
  const skirtInset = 0.06
  const roofInset = 0.04

  // articulation joints at ±length/6 (3-section split)
  const accordionPositions = [-length / 6, length / 6]
  const accordionW = 0.32

  // bogies (visible truck/wheel housings) under each section
  const bogieY = y0 + 0.16
  const bogieH = 0.3
  const bogieZs = [-length * 0.36, 0, length * 0.36]

  // vertical mullions across the window strip, skipping the accordion zones
  const mullionStep = 1.6
  const mullionCount = Math.max(1, Math.floor(length / mullionStep) - 1)
  const mullionStart = (-length + mullionStep) / 2

  // side doors: two per side, placed mid-section in each end section
  const doorZs = [-length * 0.32, length * 0.32]
  const doorH = blueH + windowH * 0.85
  const doorY = y0 + skirtH + doorH / 2
  const doorW = 1.3

  return (
    <group>
      {/* dark skirt at the bottom */}
      <mesh receiveShadow position={[0, ySkirt, 0]}>
        <boxGeometry args={[width - 2 * skirtInset, skirtH, length]} />
        <meshStandardMaterial color={COLOR_SKIRT} roughness={0.85} />
      </mesh>

      {/* GVB blue band */}
      <mesh castShadow receiveShadow position={[0, yBlue, 0]}>
        <boxGeometry args={[width, blueH, length]} />
        <meshStandardMaterial color={COLOR_BLUE} roughness={0.45} />
      </mesh>

      {/* thin chrome trim separating blue and window strip */}
      <mesh position={[0, yBlue + blueH / 2 + 0.025, 0]}>
        <boxGeometry args={[width + 0.005, 0.05, length + 0.01]} />
        <meshStandardMaterial
          color={COLOR_TRIM}
          roughness={0.3}
          metalness={0.65}
        />
      </mesh>

      {/* continuous window strip (also forms the front + rear windshields) */}
      <mesh receiveShadow position={[0, yWindow, 0]}>
        <boxGeometry args={[width, windowH, length]} />
        <meshStandardMaterial
          color={COLOR_GLASS}
          emissive={COLOR_GLASS}
          emissiveIntensity={0.18}
          roughness={0.15}
          metalness={0.55}
        />
      </mesh>

      {/* white upper / roof */}
      <mesh receiveShadow position={[0, yRoof, 0]}>
        <boxGeometry args={[width - 2 * roofInset, roofH, length]} />
        <meshStandardMaterial color={COLOR_WHITE} roughness={0.6} />
      </mesh>

      {/* vertical mullions splitting up the window strip */}
      {Array.from({ length: mullionCount }).map((_, i) => {
        const z = mullionStart + i * mullionStep
        const nearAccordion =
          Math.abs(z - accordionPositions[0]!) < accordionW / 2 + 0.1 ||
          Math.abs(z - accordionPositions[1]!) < accordionW / 2 + 0.1
        if (nearAccordion) return null
        return (
          <group key={i}>
            {[-1, 1].map((side) => (
              <mesh
                key={side}
                position={[(width / 2 + 0.006) * side, yWindow, z]}
              >
                <boxGeometry args={[0.04, windowH + 0.02, 0.08]} />
                <meshStandardMaterial color={COLOR_MULLION} roughness={0.8} />
              </mesh>
            ))}
          </group>
        )
      })}

      {/* doors — slightly recessed darker-blue panels with handle lines */}
      {doorZs.flatMap((dz) =>
        [-1, 1].map((side) => (
          <group key={`door-${dz}-${side}`}>
            <mesh
              position={[(width / 2 + 0.007) * side, doorY, dz]}
              rotation={[0, side > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
            >
              <planeGeometry args={[doorW, doorH]} />
              <meshStandardMaterial color={COLOR_DOOR} roughness={0.55} />
            </mesh>
            {/* door split line down the middle */}
            <mesh
              position={[(width / 2 + 0.009) * side, doorY, dz]}
              rotation={[0, side > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
            >
              <planeGeometry args={[0.025, doorH]} />
              <meshStandardMaterial color={COLOR_MULLION} />
            </mesh>
          </group>
        )),
      )}

      {/* accordion bellows at the section joints */}
      {accordionPositions.map((z) => (
        <mesh
          key={z}
          position={[0, (yBlue + yRoof) / 2 + 0.05, z]}
        >
          <boxGeometry
            args={[width + 0.04, blueH + windowH + roofH * 0.6, accordionW]}
          />
          <meshStandardMaterial color={COLOR_ACCORDION} roughness={0.95} />
        </mesh>
      ))}

      {/* bogies — dark wheel housings under each section */}
      {bogieZs.map((z) => (
        <mesh key={z} position={[0, bogieY, z]}>
          <boxGeometry args={[width - 0.4, bogieH, 1.9]} />
          <meshStandardMaterial color={COLOR_BOGIE} roughness={0.9} />
        </mesh>
      ))}

      {/* pantograph on the roof, at the centre section */}
      <Pantograph y={yRoof + roofH / 2} />

      {/* destination sign panel above the front windshield */}
      <mesh position={[0, yRoof, length / 2 + 0.003]}>
        <planeGeometry args={[width * 0.55, 0.3]} />
        <meshStandardMaterial
          color="#0e0e0e"
          emissive="#ff9020"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* head/tail lights along the blue band */}
      {[-1, 1].map((dir) => {
        const z = (dir * length) / 2 + dir * 0.012
        const isHead = dir === 1
        return (
          <group key={dir}>
            {[-width * 0.32, width * 0.32].map((wx) => (
              <mesh
                key={wx}
                position={[wx, yBlue + 0.05, z]}
                rotation={[0, isHead ? 0 : Math.PI, 0]}
              >
                <planeGeometry args={[0.45, 0.22]} />
                <meshStandardMaterial
                  color={isHead ? '#fff4c2' : '#a52121'}
                  emissive={isHead ? '#fff4c2' : '#d63333'}
                  emissiveIntensity={0.75}
                />
              </mesh>
            ))}
          </group>
        )
      })}

      {/* GVB-blue front bumper accent — small wedge along the bottom of the nose */}
      {[-1, 1].map((dir) => (
        <mesh
          key={`bumper-${dir}`}
          position={[0, ySkirt + 0.1, (dir * length) / 2 - dir * 0.1]}
        >
          <boxGeometry args={[width - 2 * skirtInset - 0.02, 0.18, 0.18]} />
          <meshStandardMaterial color={COLOR_BLUE} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function Pantograph({ y }: { y: number }) {
  return (
    <group position={[0, y, 0]}>
      {/* base plate */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.6, 0.06, 2.4]} />
        <meshStandardMaterial color="#262626" roughness={0.8} />
      </mesh>
      {/* lower arm (V-shape) */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[0, 0.45, s * 0.55]}
          rotation={[s * 0.75, 0, 0]}
        >
          <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
          <meshStandardMaterial color="#4f4f4f" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* horizontal pickup bar */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[1.5, 0.04, 0.08]} />
        <meshStandardMaterial color="#8a8a8a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* contact strip on top */}
      <mesh position={[0, 0.89, 0]}>
        <boxGeometry args={[1.55, 0.025, 0.04]} />
        <meshStandardMaterial color="#bcbcbc" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}
