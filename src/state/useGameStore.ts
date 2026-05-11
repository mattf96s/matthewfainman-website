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

  gameOver: boolean
  gameOverReason: string | null
  endGame: (reason: string) => void

  reset: () => void
}

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
        return { health: 0, gameOver: true, gameOverReason: reason }
      }
      return { health: next }
    }),

  gameOver: false,
  gameOverReason: null,
  endGame: (reason) => {
    console.log(`[game over] ${reason}`)
    set({ gameOver: true, gameOverReason: reason, health: 0 })
  },

  reset: () =>
    set({
      score: 0,
      nearMissCount: 0,
      health: MAX_HEALTH,
      gameOver: false,
      gameOverReason: null,
      paused: false,
    }),
}))
