import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'

import {
  isSnapshotStale,
  remoteRendered,
  remoteSnapshots,
} from '../../multiplayer/playroomState'
import { PLAYER_HEIGHT, PLAYER_RADIUS } from '../constants'

interface RemotePlayerProps {
  id: string
  name: string
  color: string
}

const LERP = 0.25
/** Jumps larger than this (squared metres) are teleports — respawns are
 * ≥18m apart — so snap instead of ghost-sliding across the map. Normal
 * movement covers <0.5m between snapshots. */
const SNAP_DISTANCE_SQ = 25

/**
 * Renders one remote player. Reads the shared snapshot map each frame
 * and lerps toward the latest received pose. Mesh stays mounted as
 * long as the parent keeps this `id` in its players list — RemotePlayers
 * controls join/leave via Playroom's usePlayersList.
 */
export function RemotePlayer({ id, name, color }: RemotePlayerProps) {
  const group = useRef<THREE.Group>(null)
  const targetPos = useRef(new THREE.Vector3())
  const targetYaw = useRef(0)
  // Last interpolated values, so we know where to draw a gun from.
  const currentYaw = useRef(0)
  /** True while the avatar is hidden (dead/stale/no data) — the next
   * shown frame snaps to the snapshot instead of lerping from the old
   * spot. */
  const wasHidden = useRef(true)

  // Drop our rendered-pose entry when this avatar unmounts so the gun
  // never tests against a ghost.
  useEffect(() => () => void remoteRendered.delete(id), [id])

  useFrame(() => {
    const g = group.current
    if (!g) return
    const snap = remoteSnapshots.get(id)
    // Hide until the first snapshot arrives, while dead, and when the
    // snapshot stream has gone stale (their tab is backgrounded — the
    // player isn't really *there*, so don't render a shootable statue).
    if (!snap || snap.dead || isSnapshotStale(snap, performance.now())) {
      g.visible = false
      remoteRendered.delete(id)
      wasHidden.current = true
      return
    }
    g.visible = true

    targetPos.current.set(snap.x, snap.y, snap.z)
    targetYaw.current = snap.yaw + Math.PI // remote faces away from their own camera

    if (
      wasHidden.current ||
      g.position.distanceToSquared(targetPos.current) > SNAP_DISTANCE_SQ
    ) {
      // reappearing or teleporting (respawn) — snap, don't slide
      g.position.copy(targetPos.current)
      currentYaw.current = targetYaw.current
    } else {
      g.position.lerp(targetPos.current, LERP)
      // angle lerp on shortest arc
      const dy = wrapPi(targetYaw.current - currentYaw.current)
      currentYaw.current += dy * LERP
    }
    wasHidden.current = false
    g.rotation.y = currentYaw.current

    // Publish where this avatar is actually drawn for hit detection.
    let pose = remoteRendered.get(id)
    if (!pose) {
      pose = { x: 0, y: 0, z: 0 }
      remoteRendered.set(id, pose)
    }
    pose.x = g.position.x
    pose.y = g.position.y
    pose.z = g.position.z
  })

  return (
    <group ref={group} visible={false}>
      <mesh castShadow>
        <capsuleGeometry args={[PLAYER_RADIUS, PLAYER_HEIGHT, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* small "nose" — facing indicator, matches local player style */}
      <mesh position={[0, 0.3, PLAYER_RADIUS + 0.05]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* gun in the right hand — extends in front of the avatar */}
      <group position={[0.32, 0.55, PLAYER_RADIUS + 0.05]}>
        <mesh>
          <boxGeometry args={[0.12, 0.14, 0.55]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.4} />
        </mesh>
      </group>
      {/* floating nametag */}
      <Billboard position={[0, PLAYER_HEIGHT + 0.6, 0]}>
        <Text
          fontSize={0.22}
          color="#fff"
          outlineWidth={0.02}
          outlineColor="#000"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      </Billboard>
    </group>
  )
}

function wrapPi(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2
  while (a < -Math.PI) a += Math.PI * 2
  return a
}
