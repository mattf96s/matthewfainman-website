import { useEffect, useRef } from 'react'

import { cameraState } from '../game/cameraState'
import { playerPosition } from '../game/playerPosition'
import { pickupState } from '../game/pickups/pickupState'
import {
  BLOCK_LENGTH,
  CANAL_WIDTH,
  CAR_LANE_WIDTH,
  COLOR_BRIDGE,
  COLOR_CANAL,
  COLOR_CANAL_PAVEMENT,
  COLOR_FIETSPAD,
  COLOR_MEDIAN,
  COLOR_ROAD,
  COLOR_SIDEWALK,
  CROSS_STREET_WIDTH,
  CROSS_STREET_X_HALF,
  CROSS_STREET_Z,
  FAR_SIDEWALK_WIDTH,
  FIETSPAD_WIDTH,
  HOUSE_SIDEWALK_WIDTH,
  MEDIAN_WIDTH,
  NEAR_SIDEWALK_WIDTH,
  X_CANAL,
  X_CAR_EAST,
  X_CAR_WEST,
  X_FAR_SIDEWALK,
  X_FIETSPAD,
  X_HOUSE_FRONT,
  X_HOUSE_SIDEWALK,
  X_MEDIAN_EAST,
  X_MEDIAN_WEST,
  X_NEAR_SIDEWALK,
} from '../game/world/constants'
import { remoteSnapshots } from '../multiplayer/playroomState'
import { useGameStore } from '../state/useGameStore'

interface MinimapProps {
  /** Smaller rendering for touch devices, where the bottom-right thumb
   * cluster needs the vertical room in landscape. */
  compact?: boolean
}

// World window the map shows: full street width plus the cross-street up
// north. North (+z) is up, so map-y = Z_MAX - z.
const X_MIN = -21
const X_MAX = 21
const Z_MIN = -52
const Z_MAX = 64
const MAP_W = X_MAX - X_MIN
const MAP_H = Z_MAX - Z_MIN

const mx = (x: number) => x - X_MIN
const mz = (z: number) => Z_MAX - z
const clampX = (x: number) => Math.min(X_MAX - 1, Math.max(X_MIN + 1, x))
const clampZ = (z: number) => Math.min(Z_MAX - 1, Math.max(Z_MIN + 1, z))

// The lane strips span the built block; the canal runs the full window.
const STRIP_Y = mz(BLOCK_LENGTH / 2)

const SVG_NS = 'http://www.w3.org/2000/svg'

/**
 * Top-right overhead map: the street layout (straight from the world
 * constants, so it can't drift), you as an arrow, peers as their
 * profile-coloured dots, and the active Panado drop as a green cross.
 * Markers update imperatively in a rAF loop — per-frame positions never
 * touch React state.
 */
export function Minimap({ compact }: MinimapProps) {
  const playerRef = useRef<SVGPolygonElement>(null)
  const pickupRef = useRef<SVGGElement>(null)
  const peersRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const peerDots = new Map<string, SVGCircleElement>()
    let raf = 0

    const tick = () => {
      raf = requestAnimationFrame(tick)

      const arrow = playerRef.current
      if (arrow) {
        if (playerPosition.ready) {
          const yaw = cameraState.yaw
          // map view is y-down, so the facing vector (-sin, -cos) on XZ
          // becomes a clockwise rotation of atan2(-sin, -cos)
          const deg =
            Math.atan2(-Math.sin(yaw), -Math.cos(yaw)) * (180 / Math.PI)
          arrow.setAttribute(
            'transform',
            `translate(${mx(clampX(playerPosition.x))} ${mz(clampZ(playerPosition.z))}) rotate(${deg})`,
          )
          arrow.style.display = ''
        } else {
          arrow.style.display = 'none'
        }
      }

      const pickup = pickupRef.current
      if (pickup) {
        if (pickupState.active) {
          pickup.setAttribute(
            'transform',
            `translate(${mx(pickupState.x)} ${mz(pickupState.z)})`,
          )
          pickup.style.display = ''
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
            dot.setAttribute('r', '1.6')
            dot.setAttribute('stroke', 'rgba(0,0,0,0.55)')
            dot.setAttribute('stroke-width', '0.4')
            peerDots.set(id, dot)
            host.appendChild(dot)
          }
          dot.setAttribute(
            'fill',
            peers.find((p) => p.id === id)?.color ?? '#e07a5f',
          )
          dot.setAttribute('cx', String(mx(clampX(snap.x))))
          dot.setAttribute('cy', String(mz(clampZ(snap.z))))
          dot.style.display = snap.dead ? 'none' : ''
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

  const width = compact ? 46 : 62
  const height = Math.round((width * MAP_H) / MAP_W)

  return (
    <div
      style={{
        position: 'absolute',
        top: 108,
        right: 12,
        padding: 5,
        borderRadius: 10,
        background: 'rgba(15,20,24,0.5)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(6px)',
        pointerEvents: 'none',
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        style={{ display: 'block', borderRadius: 6, overflow: 'hidden' }}
      >
        {/* --- static world, west → east --- */}
        <rect x={0} y={0} width={MAP_W} height={MAP_H} fill="#232b32" />
        <rect
          x={mx(X_CANAL - CANAL_WIDTH / 2)}
          y={0}
          width={CANAL_WIDTH}
          height={MAP_H}
          fill={COLOR_CANAL}
        />
        <rect
          x={mx(X_FAR_SIDEWALK - FAR_SIDEWALK_WIDTH / 2)}
          y={STRIP_Y}
          width={FAR_SIDEWALK_WIDTH}
          height={BLOCK_LENGTH}
          fill={COLOR_SIDEWALK}
        />
        <rect
          x={mx(X_NEAR_SIDEWALK - NEAR_SIDEWALK_WIDTH / 2)}
          y={STRIP_Y}
          width={NEAR_SIDEWALK_WIDTH}
          height={BLOCK_LENGTH}
          fill={COLOR_CANAL_PAVEMENT}
        />
        <rect
          x={mx(X_CAR_WEST - CAR_LANE_WIDTH / 2)}
          y={STRIP_Y}
          width={X_CAR_EAST - X_CAR_WEST + CAR_LANE_WIDTH}
          height={BLOCK_LENGTH}
          fill={COLOR_ROAD}
        />
        <rect
          x={mx(X_MEDIAN_WEST - MEDIAN_WIDTH / 2)}
          y={STRIP_Y}
          width={MEDIAN_WIDTH}
          height={BLOCK_LENGTH}
          fill={COLOR_MEDIAN}
        />
        <rect
          x={mx(X_MEDIAN_EAST - MEDIAN_WIDTH / 2)}
          y={STRIP_Y}
          width={MEDIAN_WIDTH}
          height={BLOCK_LENGTH}
          fill={COLOR_MEDIAN}
        />
        <rect
          x={mx(X_FIETSPAD - FIETSPAD_WIDTH / 2)}
          y={STRIP_Y}
          width={FIETSPAD_WIDTH}
          height={BLOCK_LENGTH}
          fill={COLOR_FIETSPAD}
        />
        <rect
          x={mx(X_HOUSE_SIDEWALK - HOUSE_SIDEWALK_WIDTH / 2)}
          y={STRIP_Y}
          width={HOUSE_SIDEWALK_WIDTH}
          height={BLOCK_LENGTH}
          fill={COLOR_SIDEWALK}
        />
        <rect
          x={mx(X_HOUSE_FRONT)}
          y={STRIP_Y}
          width={X_MAX - X_HOUSE_FRONT}
          height={BLOCK_LENGTH}
          fill="#7a4434"
        />
        <rect
          x={mx(-CROSS_STREET_X_HALF)}
          y={mz(CROSS_STREET_Z + CROSS_STREET_WIDTH / 2)}
          width={CROSS_STREET_X_HALF * 2}
          height={CROSS_STREET_WIDTH}
          fill={COLOR_ROAD}
        />
        <rect
          x={mx(X_CANAL - CANAL_WIDTH / 2)}
          y={mz(2.2)}
          width={CANAL_WIDTH}
          height={4.4}
          fill={COLOR_BRIDGE}
        />

        {/* --- live markers, driven from the rAF loop above --- */}
        <g ref={peersRef} />
        <g ref={pickupRef} style={{ display: 'none' }}>
          <rect x={-1.8} y={-0.6} width={3.6} height={1.2} fill="#3ad06a" />
          <rect x={-0.6} y={-1.8} width={1.2} height={3.6} fill="#3ad06a" />
        </g>
        <polygon
          ref={playerRef}
          points="0,-2.6 1.8,2.2 0,1.2 -1.8,2.2"
          fill="#ffffff"
          stroke="rgba(0,0,0,0.6)"
          strokeWidth={0.4}
          style={{ display: 'none' }}
        />
      </svg>
    </div>
  )
}
