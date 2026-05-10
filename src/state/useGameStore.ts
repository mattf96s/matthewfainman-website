import { create } from 'zustand'

interface GameState {
  fps: number
  setFps: (fps: number) => void
}

export const useGameStore = create<GameState>((set) => ({
  fps: 0,
  setFps: (fps) => set({ fps }),
}))
