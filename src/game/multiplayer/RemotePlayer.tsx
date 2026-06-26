import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'

import { lerpAngle } from '../../lib/angle'
import {
  isSnapshotStale,
  remoteRendered,
  remoteSnapshots,
} from '../../multiplayer/playroomState'
import { PLAYER_HEIGHT, PLAYER_RADIUS } from '../constants'
import { GunModel } from '../GunModel'
import { PlayerNose } from '../PlayerNose'
import { SHOULDER_FWD, SHOULDER_RIGHT, SHOULDER_Y } from '../shoulderAnchor'
import { SwordModel } from '../SwordModel'

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
  const gunGroup = useRef<THREE.Group>(null)
  const swordGroup = useRef<THREE.Group>(null)
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

    // show whichever weapon their snapshot says they're holding —
    // imperative visibility flips, so a swap never re-renders the avatar
    const holdingSword = snap.w === 1
    if (gunGroup.current) gunGroup.current.visible = !holdingSword
    if (swordGroup.current) swordGroup.current.visible = holdingSword

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
      currentYaw.current = lerpAngle(currentYaw.current, targetYaw.current, LERP)
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
      {/* facing indicator, matches local player style */}
      <PlayerNose color="#1a1a1a" />
      {/* gun in the right hand — extends in front of the avatar */}
      <group ref={gunGroup} position={[SHOULDER_RIGHT, SHOULDER_Y, SHOULDER_FWD]}>
        <GunModel />
      </group>
      {/* sword, same hand — visibility swapped per snapshot weapon */}
      <group
        ref={swordGroup}
        position={[SHOULDER_RIGHT, SHOULDER_Y, SHOULDER_FWD]}
        visible={false}
      >
        <SwordModel />
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
