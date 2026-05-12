import { create } from 'zustand'

interface GameState {
  fps: number
  setFps: (fps: number) => void

  locked: boolean
  setLocked: (locked: boolean) => void

  /** True after the player begins — gates the title screen. */
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

  /** Player health, 0–MAX_HEALTH. Drops below 1 → game over. */
  health: number
  /** Subtract `amount` from health; surface a reason; if ≤0, game over. */
  takeDamage: (amount: number, reason: string) => void
  /** Restore `amount` of health, clamped to MAX_HEALTH. No-op if dead. */
  heal: (amount: number) => void

  gameOver: boolean
  gameOverReason: string | null
  endGame: (reason: string) => void

  /** True once the player has clicked through the Playroom lobby. */
  multiplayerJoined: boolean
  setMultiplayerJoined: (joined: boolean) => void

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

const KILL_FEED_MAX = 5
let killFeedNextId = 1

export const MAX_HEALTH = 100
const NEAR_MISS_BONUS = 5

export const useGameStore = create<GameState>((set) => ({
  fps: 0,
  setFps: (fps) => set({ fps }),

  locked: false,
  setLocked: (locked) => set({ locked }),

  started: false,
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
      if (s.gameOver) return s
      const next = Math.max(0, s.health - amount)
      console.log(`[hit] ${reason} −${amount} (${next}/${MAX_HEALTH} hp)`)
      if (next <= 0) {
        // In multiplayer, dying isn't terminal — the Playroom bridge
        // watches health=0 and triggers a respawn after a short delay.
        // Single-player keeps the old game-over flow.
        if (s.multiplayerJoined) return { health: 0 }
        return { health: 0, gameOver: true, gameOverReason: reason }
      }
      return { health: next }
    }),

  heal: (amount) =>
    set((s) => {
      if (s.gameOver) return s
      const next = Math.min(MAX_HEALTH, s.health + amount)
      return { health: next }
    }),

  gameOver: false,
  gameOverReason: null,
  endGame: (reason) => {
    console.log(`[game over] ${reason}`)
    set({ gameOver: true, gameOverReason: reason, health: 0 })
  },

  multiplayerJoined: false,
  setMultiplayerJoined: (multiplayerJoined) => set({ multiplayerJoined }),

  /** Increments when the local player should be teleported back to spawn
   * — used by Player.tsx to subscribe to respawn requests in multiplayer
   * (single-player respawn already runs off the gameOver edge). */
  respawnTick: 0,
  respawn: () =>
    set((s) => ({ health: MAX_HEALTH, respawnTick: s.respawnTick + 1 })),

  kills: 0,
  deaths: 0,
  killFeed: [],
  addKill: (victimName) =>
    set((s) => ({
      kills: s.kills + 1,
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
      gameOver: false,
      gameOverReason: null,
      paused: false,
      // kills/deaths persist across reset in multiplayer
      kills: s.multiplayerJoined ? s.kills : 0,
      deaths: s.multiplayerJoined ? s.deaths : 0,
    })),
}))
