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

export type AttackKind = 'gun' | 'sword'

export interface ShotPayload {
  ox: number
  oy: number
  oz: number
  hx: number
  hy: number
  hz: number
  victimId: string | null
  damage: number
  /** What dealt the hit. Sword hits draw no tracer and report a
   * different death reason. Absent on payloads from older clients —
   * treat as 'gun'. */
  kind?: AttackKind
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
  shotSender?.({ ox, oy, oz, hx, hy, hz, victimId, damage, kind: 'gun' })
}

/** Land a sword hit on one victim. No tracer — the swing animation is
 * the visual — so unlike shots, misses never reach the network. */
export function broadcastMelee(victimId: string, damage: number): void {
  lastLocalFireAt.value = performance.now()
  shotSender?.({
    ox: 0,
    oy: 0,
    oz: 0,
    hx: 0,
    hy: 0,
    hz: 0,
    victimId,
    damage,
    kind: 'sword',
  })
}

/** Push our latest pose/health snapshot to the network, if connected.
 * Stamps the sender-side change counter `t` so receivers can tell a
 * live stream from a frozen one (see SNAPSHOT_STALE_MS). */
export function broadcastSnapshot(snapshot: RemoteSnapshot): void {
  snapshotSender?.({ ...snapshot, t: performance.now() })
}
