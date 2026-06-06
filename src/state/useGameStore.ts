import { create } from 'zustand'

interface GameState {
  fps: number
  setFps: (fps: number) => void

  locked: boolean
  setLocked: (locked: boolean) => void

  /** Whether the sim is live. Defaults true so visitors drop straight into
   * a moving scene — there's no blocking title screen. Kept as a flag so
   * pause and per-frame systems have a single gate to check. */
  started: boolean
  setStarted: (started: boolean) => void

  /** Explicit pause (Esc). Independent of pointer-lock state. */
  paused: boolean
  setPaused: (paused: boolean) => void

  score: number
  /** Adds whole-number seconds; floor handled by caller. */
  addScore: (amount: number) => void
  /** Near-miss bonus — clean pass near a hazard. */
  addNearMiss: () => void
  nearMissCount: number

  /** Player health, 0–MAX_HEALTH. At 0 the player is dead and an
   * auto-respawn brings them back — death is never terminal. */
  health: number
  /** Subtract `amount` from health; record what did it. No-op if already dead. */
  takeDamage: (amount: number, reason: string) => void
  /** Restore `amount` of health, clamped to MAX_HEALTH. No-op if dead. */
  heal: (amount: number) => void

  /** What killed the player this death (`'tram'`, `'water'`, …), shown on
   * the respawn overlay. Null while alive. */
  deathReason: string | null

  /** True once we've connected to the shared Playroom room. */
  multiplayerJoined: boolean
  setMultiplayerJoined: (joined: boolean) => void

  /** Other connected players, for presence UI + remote avatars. Updated
   * on join/leave only — never per frame. */
  peers: Peer[]
  addPeer: (peer: Peer) => void
  removePeer: (id: string) => void

  /** Bumped each time the Player controller should teleport to spawn —
   * used by the multiplayer bridge to respawn the player after death. */
  respawnTick: number
  respawn: () => void

  /** Players this session has killed (counted on the victim's client via RPC). */
  kills: number
  /** Times this session has been killed by a remote player. */
  deaths: number
  addKill: (victimName: string) => void
  addDeath: (killerName: string) => void

  /** Last few kill-feed entries — newest first, capped. */
  killFeed: KillFeedEntry[]

  reset: () => void
}

export interface KillFeedEntry {
  id: number
  killer: string
  victim: string
  at: number
}

export interface Peer {
  id: string
  name: string
  color: string
}

const KILL_FEED_MAX = 5
let killFeedNextId = 1

export const MAX_HEALTH = 100
const NEAR_MISS_BONUS = 5
/** Score awarded for eliminating another player. */
const KILL_SCORE = 100

export const useGameStore = create<GameState>((set) => ({
  fps: 0,
  setFps: (fps) => set({ fps }),

  locked: false,
  setLocked: (locked) => set({ locked }),

  started: true,
  setStarted: (started) => set({ started }),

  paused: false,
  setPaused: (paused) => set({ paused }),

  score: 0,
  addScore: (amount) => set((s) => ({ score: s.score + amount })),
  nearMissCount: 0,
  addNearMiss: () =>
    set((s) => ({
      score: s.score + NEAR_MISS_BONUS,
      nearMissCount: s.nearMissCount + 1,
    })),

  health: MAX_HEALTH,
  takeDamage: (amount, reason) =>
    set((s) => {
      if (s.health <= 0) return s // already dead, waiting on respawn
      const next = Math.max(0, s.health - amount)
      console.log(`[hit] ${reason} −${amount} (${next}/${MAX_HEALTH} hp)`)
      // Death is never terminal: hitting 0 flags the death reason and the
      // auto-respawn system brings the player back after a short delay.
      if (next <= 0) return { health: 0, deathReason: reason }
      return { health: next }
    }),

  heal: (amount) =>
    set((s) => {
      if (s.health <= 0) return s
      const next = Math.min(MAX_HEALTH, s.health + amount)
      return { health: next }
    }),

  deathReason: null,

  multiplayerJoined: false,
  setMultiplayerJoined: (multiplayerJoined) => set({ multiplayerJoined }),

  peers: [],
  addPeer: (peer) =>
    set((s) =>
      s.peers.some((p) => p.id === peer.id)
        ? s
        : { peers: [...s.peers, peer] },
    ),
  removePeer: (id) =>
    set((s) => ({ peers: s.peers.filter((p) => p.id !== id) })),

  /** Increments when the local player should be teleported back to spawn.
   * Player.tsx subscribes to it; both the solo AutoRespawn system and the
   * multiplayer Playroom bridge bump it (via respawn()) after a death. */
  respawnTick: 0,
  respawn: () =>
    set((s) => ({
      health: MAX_HEALTH,
      deathReason: null,
      respawnTick: s.respawnTick + 1,
    })),

  kills: 0,
  deaths: 0,
  killFeed: [],
  addKill: (victimName) =>
    set((s) => ({
      kills: s.kills + 1,
      score: s.score + KILL_SCORE,
      killFeed: [
        { id: killFeedNextId++, killer: 'You', victim: victimName, at: Date.now() },
        ...s.killFeed,
      ].slice(0, KILL_FEED_MAX),
    })),
  addDeath: (killerName) =>
    set((s) => ({
      deaths: s.deaths + 1,
      killFeed: [
        { id: killFeedNextId++, killer: killerName, victim: 'You', at: Date.now() },
        ...s.killFeed,
      ].slice(0, KILL_FEED_MAX),
    })),

  reset: () =>
    set((s) => ({
      score: 0,
      nearMissCount: 0,
      health: MAX_HEALTH,
      deathReason: null,
      paused: false,
      // kills/deaths persist across reset in multiplayer
      kills: s.multiplayerJoined ? s.kills : 0,
      deaths: s.multiplayerJoined ? s.deaths : 0,
    })),
}))
