import { useEffect, useRef } from 'react'

import { cameraState } from '../game/cameraState'
import { playerPosition } from '../game/playerPosition'
import { pickupState } from '../game/pickups/pickupState'
import {
  BLOCK_LENGTH,
  CANAL_WIDTH,
  CAR_LANE_WIDTH,
  CROSS_STREET_Z,
  FAR_SIDEWALK_WIDTH,
  FIETSPAD_WIDTH,
  MEDIAN_WIDTH,
  X_CANAL,
  X_CAR_EAST,
  X_CAR_WEST,
  X_FAR_SIDEWALK,
  X_FIETSPAD,
  X_HOUSE_FRONT,
  X_MEDIAN_EAST,
  X_MEDIAN_WEST,
  X_ROAD,
} from '../game/world/constants'
import { colorForId, LOCAL_PLAYER_COLOR } from '../lib/playerColor'
import { isSnapshotStale, remoteSnapshots } from '../multiplayer/playroomState'
import { useGameStore } from '../state/useGameStore'

interface MinimapProps {
  /** Smaller rendering for touch devices. */
  compact?: boolean
}

// World window the map shows. Wide enough to include the canal houses on
// both banks (their bodies reach ±27) so the street is framed by blocks
// rather than floating as bare stripes. North (+z) is up: map-y = Z_MAX - z.
const X_MIN = -27
const X_MAX = 27
const Z_MIN = -50
const Z_MAX = 62
const MAP_W = X_MAX - X_MIN
const MAP_H = Z_MAX - Z_MIN

const mx = (x: number) => x - X_MIN
const mz = (z: number) => Z_MAX - z
const clampX = (x: number) => Math.min(X_MAX - 1.5, Math.max(X_MIN + 1.5, x))
const clampZ = (z: number) => Math.min(Z_MAX - 1.5, Math.max(Z_MIN + 1.5, z))

// Canal-house footprints, matching HouseRow's spacing so the building
// rows on the map line up with the ones in the world.
const HOUSE_STRIDE = 5.4
const HOUSE_COUNT = Math.floor(BLOCK_LENGTH / HOUSE_STRIDE)
const HOUSE_START_Z = -((HOUSE_COUNT - 1) * HOUSE_STRIDE) / 2
const HOUSE_BODY = HOUSE_STRIDE * 0.66 // exaggerate the gap so blocks read
const houseZs = Array.from(
  { length: HOUSE_COUNT },
  (_, i) => HOUSE_START_Z + i * HOUSE_STRIDE,
)

// West facade mirrors the east one across the canal.
const WEST_FACADE_X = X_FAR_SIDEWALK - FAR_SIDEWALK_WIDTH / 2

// Bridges across the gracht (z, span along z).
const BRIDGES = [
  { z: 0, w: 4 },
  { z: CROSS_STREET_Z, w: 14 },
]

// Flat map palette — tuned for legibility on the dark HUD, not lit 3D.
const C = {
  land: '#9c937f',
  water: '#4f7d92',
  road: '#3b3b40',
  building: '#6d4634',
  buildingEdge: 'rgba(0,0,0,0.25)',
  median: '#c2b9a4',
  fiets: '#b5503a',
  bridge: '#c8b083',
  dash: 'rgba(255,255,255,0.75)',
}

const ROAD_X0 = X_CAR_WEST - CAR_LANE_WIDTH / 2
const ROAD_X1 = X_CAR_EAST + CAR_LANE_WIDTH / 2

const SVG_NS = 'http://www.w3.org/2000/svg'

/**
 * Top-right overhead street map drawn from the world constants (so it
 * can't drift): gracht, road with centre line, the cross-street, canal
 * houses framing both banks, and bridges. On top: you as a heading
 * arrow, peers as their avatar-coloured dots, and the active Panado
 * health drop as a pulsing green cross. Markers update imperatively in a
 * rAF loop — per-frame positions never touch React state.
 */
export function Minimap({ compact }: MinimapProps) {
  const playerRef = useRef<SVGGElement>(null)
  const pickupRef = useRef<SVGGElement>(null)
  const pickupPulseRef = useRef<SVGCircleElement>(null)
  const peersRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const peerDots = new Map<string, SVGCircleElement>()
    let raf = 0

    const tick = () => {
      raf = requestAnimationFrame(tick)

      const player = playerRef.current
      if (player) {
        if (playerPosition.ready) {
          const yaw = cameraState.yaw
          // map view is y-down, so the facing vector (-sin, -cos) on XZ
          // becomes a clockwise rotation of atan2(-sin, -cos)
          const deg =
            Math.atan2(-Math.sin(yaw), -Math.cos(yaw)) * (180 / Math.PI)
          player.setAttribute(
            'transform',
            `translate(${mx(clampX(playerPosition.x))} ${mz(clampZ(playerPosition.z))}) rotate(${deg})`,
          )
          player.style.display = ''
        } else {
          player.style.display = 'none'
        }
      }

      const pickup = pickupRef.current
      if (pickup) {
        if (pickupState.active) {
          pickup.setAttribute(
            'transform',
            `translate(${mx(clampX(pickupState.x))} ${mz(clampZ(pickupState.z))})`,
          )
          pickup.style.display = ''
          const ring = pickupPulseRef.current
          if (ring) {
            // soft outward pulse so the drop draws the eye
            const phase = (performance.now() / 950) % 1
            ring.setAttribute('r', String(3.2 + phase * 4))
            ring.setAttribute('opacity', String(0.55 * (1 - phase)))
          }
        } else {
          pickup.style.display = 'none'
        }
      }

      // Peers come and go between frames, so their dots are plain DOM
      // nodes reconciled here rather than React children.
      const host = peersRef.current
      if (host) {
        const peers = useGameStore.getState().peers
        for (const [id, snap] of remoteSnapshots) {
          let dot = peerDots.get(id)
          if (!dot) {
            dot = document.createElementNS(SVG_NS, 'circle')
            dot.setAttribute('r', '2.1')
            dot.setAttribute('stroke', '#fff')
            dot.setAttribute('stroke-width', '0.7')
            peerDots.set(id, dot)
            host.appendChild(dot)
          }
          dot.setAttribute(
            'fill',
            // fallback derives from the id too — never the hotdog colour
            peers.find((p) => p.id === id)?.color ?? colorForId(id),
          )
          dot.setAttribute('cx', String(mx(clampX(snap.x))))
          dot.setAttribute('cy', String(mz(clampZ(snap.z))))
          // hidden while dead or stale, matching the in-world avatar
          dot.style.display =
            snap.dead || isSnapshotStale(snap, performance.now()) ? 'none' : ''
        }
        for (const [id, dot] of peerDots) {
          if (!remoteSnapshots.has(id)) {
            dot.remove()
            peerDots.delete(id)
          }
        }
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const width = compact ? 58 : 76
  const height = Math.round((width * MAP_H) / MAP_W)

  return (
    <div
      style={{
        position: 'absolute',
        // tucks under the smaller scoreboard on mobile; desktop's score
        // panel is taller, so it sits lower there
        top: compact ? 80 : 108,
        right: 12,
        padding: 4,
        borderRadius: 12,
        background: 'rgba(15,20,24,0.55)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(6px)',
        pointerEvents: 'none',
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        style={{ display: 'block' }}
      >
        <defs>
          <clipPath id="mm-clip">
            <rect x={0} y={0} width={MAP_W} height={MAP_H} rx={5} ry={5} />
          </clipPath>
        </defs>

        <g clipPath="url(#mm-clip)">
          {/* land base */}
          <rect x={0} y={0} width={MAP_W} height={MAP_H} fill={C.land} />

          {/* gracht — full height, it runs past the block ends */}
          <rect
            x={mx(X_CANAL - CANAL_WIDTH / 2)}
            y={0}
            width={CANAL_WIDTH}
            height={MAP_H}
            fill={C.water}
          />

          {/* canal houses, both banks — a comb of blocks frames the street */}
          {houseZs.map((z) => (
            <g key={`h${z}`}>
              <rect
                x={0}
                y={mz(z + HOUSE_BODY / 2)}
                width={mx(WEST_FACADE_X)}
                height={HOUSE_BODY}
                fill={C.building}
                stroke={C.buildingEdge}
                strokeWidth={0.3}
              />
              <rect
                x={mx(X_HOUSE_FRONT)}
                y={mz(z + HOUSE_BODY / 2)}
                width={MAP_W - mx(X_HOUSE_FRONT)}
                height={HOUSE_BODY}
                fill={C.building}
                stroke={C.buildingEdge}
                strokeWidth={0.3}
              />
            </g>
          ))}

          {/* main road, extended north to meet the cross-street */}
          <rect
            x={mx(ROAD_X0)}
            y={mz(CROSS_STREET_Z)}
            width={ROAD_X1 - ROAD_X0}
            height={CROSS_STREET_Z - Z_MIN}
            fill={C.road}
          />
          {/* tram-stop medians sitting in the road */}
          <rect
            x={mx(X_MEDIAN_WEST - MEDIAN_WIDTH / 2)}
            y={mz(BLOCK_LENGTH / 2)}
            width={MEDIAN_WIDTH}
            height={BLOCK_LENGTH}
            fill={C.median}
          />
          <rect
            x={mx(X_MEDIAN_EAST - MEDIAN_WIDTH / 2)}
            y={mz(BLOCK_LENGTH / 2)}
            width={MEDIAN_WIDTH}
            height={BLOCK_LENGTH}
            fill={C.median}
          />
          {/* fietspad (bike path) — Amsterdam terracotta */}
          <rect
            x={mx(X_FIETSPAD - FIETSPAD_WIDTH / 2)}
            y={mz(BLOCK_LENGTH / 2)}
            width={FIETSPAD_WIDTH}
            height={BLOCK_LENGTH}
            fill={C.fiets}
          />

          {/* cross-street running east–west */}
          <rect
            x={0}
            y={mz(CROSS_STREET_Z + 7)}
            width={MAP_W}
            height={14}
            fill={C.road}
          />

          {/* bridges over the gracht */}
          {BRIDGES.map((b) => (
            <rect
              key={`b${b.z}`}
              x={mx(X_CANAL - CANAL_WIDTH / 2 - 1)}
              y={mz(b.z + b.w / 2)}
              width={CANAL_WIDTH + 2}
              height={b.w}
              fill={C.bridge}
            />
          ))}

          {/* lane markings — the dashes are what make it read as a road */}
          <line
            x1={mx(X_ROAD)}
            y1={mz(BLOCK_LENGTH / 2)}
            x2={mx(X_ROAD)}
            y2={mz(-BLOCK_LENGTH / 2)}
            stroke={C.dash}
            strokeWidth={0.5}
            strokeDasharray="3 3"
          />
          <line
            x1={mx(-18)}
            y1={mz(CROSS_STREET_Z)}
            x2={mx(18)}
            y2={mz(CROSS_STREET_Z)}
            stroke={C.dash}
            strokeWidth={0.5}
            strokeDasharray="3 3"
          />

          {/* --- live markers, driven from the rAF loop above --- */}
          <g ref={peersRef} />
          <g ref={pickupRef} style={{ display: 'none' }}>
            <circle
              ref={pickupPulseRef}
              r={3.2}
              fill="none"
              stroke="#3ad06a"
              strokeWidth={0.8}
            />
            <circle r={3} fill="#1f7a3f" stroke="#eafff0" strokeWidth={0.7} />
            <rect x={-1.9} y={-0.65} width={3.8} height={1.3} fill="#eafff0" />
            <rect x={-0.65} y={-1.9} width={1.3} height={3.8} fill="#eafff0" />
          </g>
          <g ref={playerRef} style={{ display: 'none' }}>
            <circle r={4} fill="rgba(255,255,255,0.22)" />
            {/* the hotdog's arrow — peer dots never use this colour */}
            <polygon
              points="0,-3.4 2.3,2.8 0,1.5 -2.3,2.8"
              fill={LOCAL_PLAYER_COLOR}
              stroke="rgba(255,255,255,0.9)"
              strokeWidth={0.5}
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* frame + compass sit above the clip so they're always crisp */}
        <rect
          x={0.5}
          y={0.5}
          width={MAP_W - 1}
          height={MAP_H - 1}
          rx={5}
          ry={5}
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={1}
        />
        <text
          x={4}
          y={7.5}
          fill="rgba(255,255,255,0.85)"
          fontSize={6}
          fontWeight={700}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          N
        </text>
        <polygon
          points={`${MAP_W - 5},2.5 ${MAP_W - 3},6 ${MAP_W - 7},6`}
          fill="rgba(255,255,255,0.7)"
        />
      </svg>
    </div>
  )
}
