/**
 * Mutable, module-scope multiplayer state. Lives outside Zustand because
 * per-frame remote-player updates (~20 Hz) would otherwise re-render the
 * entire scene tree on every tick.
 *
 * Components subscribe to playerJoinedSignal for join/leave-only updates;
 * positions and yaw are read directly from the snapshot maps each frame.
 */

import type { PlayerState } from 'playroomkit'

export interface RemoteSnapshot {
  /** Last received network position. */
  x: number
  y: number
  z: number
  /** Where they're aiming (= where they're facing). */
  yaw: number
  hp: number
  dead: boolean
  /** performance.now() when this snapshot was received — used to ignore
   * stale joiners that haven't sent state yet. */
  receivedAt: number
}

/** Snapshot of every other player, keyed by Playroom player id. */
export const remoteSnapshots = new Map<string, RemoteSnapshot>()

/** PlayerState handles, kept so we can call .getProfile() for names/colours. */
export const remotePlayerHandles = new Map<string, PlayerState>()

export const playroom = {
  /** True once insertCoin() has resolved at least once this session. */
  joined: false,
  /** My Playroom player id (set after join). */
  myId: '' as string,
}
