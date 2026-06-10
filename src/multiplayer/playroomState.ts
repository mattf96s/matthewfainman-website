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
  /** Sender-side performance.now() stamp. Only used as a change counter:
   * if it stops changing, the sender's frame loop is paused (hidden tab,
   * locked phone) and their snapshot is going stale. */
  t?: number
  /** Local performance.now() when a *new* snapshot last arrived — the
   * basis for staleness. Not refreshed by re-reading unchanged state. */
  receivedAt: number
}

/** Snapshot of every other player, keyed by Playroom player id. */
export const remoteSnapshots = new Map<string, RemoteSnapshot>()

/** A player whose snapshot hasn't changed for this long has a paused
 * frame loop (backgrounded tab / locked phone). Their avatar hides and
 * stops being shootable instead of freezing as a statue. */
export const SNAPSHOT_STALE_MS = 5000

export function isSnapshotStale(snap: RemoteSnapshot, now: number): boolean {
  return now - snap.receivedAt > SNAPSHOT_STALE_MS
}

export interface RenderedPose {
  x: number
  y: number
  z: number
}

/** Where each remote avatar is actually *drawn* this frame. The visuals
 * lerp toward the latest snapshot, so they trail it by ~100ms — players
 * aim at what they see, so hit detection must test against this, not the
 * raw snapshot. Written by RemotePlayer each frame. */
export const remoteRendered = new Map<string, RenderedPose>()

/** PlayerState handles, kept so we can call .getProfile() for names/colours. */
export const remotePlayerHandles = new Map<string, PlayerState>()

export const playroom = {
  /** True once insertCoin() has resolved at least once this session. */
  joined: false,
  /** My Playroom player id (set after join). */
  myId: '' as string,
}
