/**
 * Dependency-free bridge between in-Canvas gameplay (Gun, PlayerStateSync)
 * and the heavy Playroom networking layer. Gameplay imports ONLY this
 * module — never `playroomkit` — so the multiplayer code can be lazy-loaded
 * as a separate chunk. The PlayroomProvider registers the real senders
 * once it finishes loading and connecting; until then, shots still render
 * their local tracer and snapshots are silently dropped.
 */
import { pushShot } from './shots'
import type { RemoteSnapshot } from './playroomState'

export interface ShotPayload {
  ox: number
  oy: number
  oz: number
  hx: number
  hy: number
  hz: number
  victimId: string | null
  damage: number
}

type ShotSender = (payload: ShotPayload) => void
type SnapshotSender = (snapshot: RemoteSnapshot) => void

let shotSender: ShotSender | null = null
let snapshotSender: SnapshotSender | null = null

/** performance.now() of our last local shot — read by the kill-credit
 * heuristic in the Playroom layer. */
export const lastLocalFireAt = { value: 0 }

export function registerNet(senders: {
  shot: ShotSender
  snapshot: SnapshotSender
}): void {
  shotSender = senders.shot
  snapshotSender = senders.snapshot
}

export function unregisterNet(): void {
  shotSender = null
  snapshotSender = null
}

/** Fire a shot: always show the local tracer; broadcast over the network
 * if the multiplayer layer is connected. */
export function broadcastShot(
  ox: number,
  oy: number,
  oz: number,
  hx: number,
  hy: number,
  hz: number,
  victimId: string | null,
  damage: number,
): void {
  pushShot(ox, oy, oz, hx, hy, hz)
  lastLocalFireAt.value = performance.now()
  shotSender?.({ ox, oy, oz, hx, hy, hz, victimId, damage })
}

/** Push our latest pose/health snapshot to the network, if connected.
 * Stamps the sender-side change counter `t` so receivers can tell a
 * live stream from a frozen one (see SNAPSHOT_STALE_MS). */
export function broadcastSnapshot(snapshot: RemoteSnapshot): void {
  snapshotSender?.({ ...snapshot, t: performance.now() })
}
