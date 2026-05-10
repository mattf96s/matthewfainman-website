import { create } from 'zustand'

interface GameState {
  fps: number
  setFps: (fps: number) => void
  locked: boolean
  setLocked: (locked: boolean) => void
}

export const useGameStore = create<GameState>((set) => ({
  fps: 0,
  setFps: (fps) => set({ fps }),
  locked: false,
  setLocked: (locked) => set({ locked }),
}))
