import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import { broadcastSnapshot } from '../../multiplayer/netBridge'
import {
  playroom,
  remotePlayerHandles,
  remoteSnapshots,
} from '../../multiplayer/playroomState'
import { useGameStore } from '../../state/useGameStore'
import { cameraState } from '../cameraState'
import { playerPosition } from '../playerPosition'

const BROADCAST_INTERVAL_MS = 50 // 20 Hz

/**
 * Each frame: 1) pull every other player's latest `s` state out of
 * Playroom and refresh the local snapshot map so the in-canvas
 * RemotePlayer components and the Gun raycast can read it without
 * causing React re-renders; 2) at ~20Hz, push our own pos+yaw+hp
 * into our Playroom player state for everyone else to read.
 */
export function PlayerStateSync() {
  const lastSent = useRef(0)

  useFrame(() => {
    if (!playroom.joined) return
    const now = performance.now()

    // pull every other player's latest snapshot into the shared map
    for (const [id, player] of remotePlayerHandles) {
      if (id === playroom.myId) continue
      const s = player.getState('s')
      if (!s) continue
      // `receivedAt` only advances when the sender's stamp changed —
      // re-reading an unchanged state must not look like fresh data, or
      // a player with a paused tab would never read as stale. Snapshots
      // without a stamp (older clients) keep the always-fresh behaviour.
      const prev = remoteSnapshots.get(id)
      const fresh =
        typeof s.t !== 'number' || prev === undefined || prev.t !== s.t
      remoteSnapshots.set(id, {
        x: s.x,
        y: s.y,
        z: s.z,
        yaw: s.yaw,
        hp: s.hp,
        dead: s.dead,
        t: s.t,
        receivedAt: fresh || !prev ? now : prev.receivedAt,
      })
      // custom display names arrive (and change) out of band of the join
      // event; renamePeer no-ops without notifying while unchanged
      const n: unknown = player.getState('n')
      if (typeof n === 'string' && n) {
        useGameStore.getState().renamePeer(id, n)
      }
    }

    // push our own state at most every BROADCAST_INTERVAL_MS
    if (now - lastSent.current < BROADCAST_INTERVAL_MS) return
    if (!playerPosition.ready) return
    lastSent.current = now
    const store = useGameStore.getState()
    broadcastSnapshot({
      x: playerPosition.x,
      y: playerPosition.y,
      z: playerPosition.z,
      yaw: cameraState.yaw,
      hp: store.health,
      dead: store.health <= 0,
      receivedAt: now,
    })
  })

  return null
}
