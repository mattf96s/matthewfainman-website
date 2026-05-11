import type { ArcSegment, PathSegment, TramPath } from '../hazards/PathTram'

interface TramTracksProps {
  path: TramPath
  /** Distance between the two rails. */
  gauge?: number
  /** Y position of the rails (just above the road). */
  y?: number
  color?: string
  /** Arc segments are tessellated into this many straight sub-rails. */
  arcSegments?: number
}

const RAIL_W = 0.07
const RAIL_H = 0.04

interface Point2 {
  x: number
  z: number
}

function Rail({
  from,
  to,
  color,
  y,
}: {
  from: Point2
  to: Point2
  color: string
  y: number
}) {
  const dx = to.x - from.x
  const dz = to.z - from.z
  const length = Math.hypot(dx, dz)
  if (length < 0.001) return null
  const yaw = Math.atan2(dx, dz)
  return (
    <mesh
      position={[(from.x + to.x) / 2, y, (from.z + to.z) / 2]}
      rotation={[0, yaw, 0]}
    >
      <boxGeometry args={[RAIL_W, RAIL_H, length + RAIL_W]} />
      <meshStandardMaterial
        color={color}
        metalness={0.65}
        roughness={0.35}
      />
    </mesh>
  )
}

function StraightTrack({
  seg,
  gauge,
  color,
  y,
}: {
  seg: PathSegment
  gauge: number
  color: string
  y: number
}) {
  const dx = seg.x2 - seg.x1
  const dz = seg.z2 - seg.z1
  const len = Math.hypot(dx, dz)
  if (len < 0.001) return null
  // perpendicular in the XZ plane (right side of motion)
  const perpX = dz / len
  const perpZ = -dx / len
  const ox = (perpX * gauge) / 2
  const oz = (perpZ * gauge) / 2

  return (
    <>
      <Rail
        from={{ x: seg.x1 + ox, z: seg.z1 + oz }}
        to={{ x: seg.x2 + ox, z: seg.z2 + oz }}
        color={color}
        y={y}
      />
      <Rail
        from={{ x: seg.x1 - ox, z: seg.z1 - oz }}
        to={{ x: seg.x2 - ox, z: seg.z2 - oz }}
        color={color}
        y={y}
      />
    </>
  )
}

function ArcTrack({
  seg,
  gauge,
  color,
  y,
  segments,
}: {
  seg: ArcSegment
  gauge: number
  color: string
  y: number
  segments: number
}) {
  const innerR = seg.radius - gauge / 2
  const outerR = seg.radius + gauge / 2
  const pieces: React.ReactNode[] = []
  for (let i = 0; i < segments; i++) {
    const a1 = seg.startAngle + ((seg.endAngle - seg.startAngle) * i) / segments
    const a2 =
      seg.startAngle + ((seg.endAngle - seg.startAngle) * (i + 1)) / segments
    pieces.push(
      <Rail
        key={`in-${i}`}
        from={{ x: seg.cx + innerR * Math.cos(a1), z: seg.cz + innerR * Math.sin(a1) }}
        to={{ x: seg.cx + innerR * Math.cos(a2), z: seg.cz + innerR * Math.sin(a2) }}
        color={color}
        y={y}
      />,
      <Rail
        key={`out-${i}`}
        from={{ x: seg.cx + outerR * Math.cos(a1), z: seg.cz + outerR * Math.sin(a1) }}
        to={{ x: seg.cx + outerR * Math.cos(a2), z: seg.cz + outerR * Math.sin(a2) }}
        color={color}
        y={y}
      />,
    )
  }
  return <>{pieces}</>
}

/**
 * Renders a pair of metal rails along an arbitrary tram path (straight
 * + arc segments). Use {@link StraightTramTracks} for the simple
 * back-and-forth tram lane.
 */
export function TramTracks({
  path,
  gauge = 1.45,
  y = 0.018,
  color = '#9a9a92',
  arcSegments = 12,
}: TramTracksProps) {
  return (
    <group>
      {path.map((seg, i) =>
        seg.kind === 'straight' ? (
          <StraightTrack key={i} seg={seg} gauge={gauge} color={color} y={y} />
        ) : (
          <ArcTrack
            key={i}
            seg={seg}
            gauge={gauge}
            color={color}
            y={y}
            segments={arcSegments}
          />
        ),
      )}
    </group>
  )
}

interface StraightTramTracksProps {
  x: number
  z1: number
  z2: number
  gauge?: number
  y?: number
  color?: string
}

/** Convenience for the bouncing tram on a single straight lane. */
export function StraightTramTracks({
  x,
  z1,
  z2,
  gauge = 1.45,
  y = 0.018,
  color = '#9a9a92',
}: StraightTramTracksProps) {
  return (
    <TramTracks
      path={[{ kind: 'straight', x1: x, z1, x2: x, z2 }]}
      gauge={gauge}
      y={y}
      color={color}
    />
  )
}
