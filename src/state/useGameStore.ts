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

  lives: number
  /** Decrement and surface a reason in the console. */
  loseLife: (reason: string) => void

  gameOver: boolean
  gameOverReason: string | null
  endGame: (reason: string) => void

  reset: () => void
}

const STARTING_LIVES = 3
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

  lives: STARTING_LIVES,
  loseLife: (reason) =>
    set((s) => {
      const next = s.lives - 1
      console.log(`[hit] ${reason} (${next} lives left)`)
      if (next <= 0) {
        return { lives: 0, gameOver: true, gameOverReason: reason }
      }
      return { lives: next }
    }),

  gameOver: false,
  gameOverReason: null,
  endGame: (reason) => {
    console.log(`[game over] ${reason}`)
    set({ gameOver: true, gameOverReason: reason, lives: 0 })
  },

  reset: () =>
    set({
      score: 0,
      nearMissCount: 0,
      lives: STARTING_LIVES,
      gameOver: false,
      gameOverReason: null,
      paused: false,
    }),
}))
