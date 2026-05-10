import { create } from 'zustand'

interface GameState {
  fps: number
  setFps: (fps: number) => void

  locked: boolean
  setLocked: (locked: boolean) => void

  score: number
  /** Adds whole-number seconds; floor handled by caller. */
  addScore: (amount: number) => void

  lives: number
  /** Decrement and surface a reason in the console. */
  loseLife: (reason: string) => void

  gameOver: boolean
  gameOverReason: string | null
  endGame: (reason: string) => void

  reset: () => void
}

const STARTING_LIVES = 3

export const useGameStore = create<GameState>((set) => ({
  fps: 0,
  setFps: (fps) => set({ fps }),

  locked: false,
  setLocked: (locked) => set({ locked }),

  score: 0,
  addScore: (amount) => set((s) => ({ score: s.score + amount })),

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
      lives: STARTING_LIVES,
      gameOver: false,
      gameOverReason: null,
    }),
}))
