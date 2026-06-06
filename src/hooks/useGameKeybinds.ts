import { useEffect } from 'react'

import { useGameStore } from '../state/useGameStore'

/**
 * Global keybinds for game flow:
 *   - Enter / Space (on overlays): start or resume
 *   - Esc: pause during play
 *
 * Mounted at the route level (outside the Canvas) so it works without
 * pointer lock — useful in environments where pointer lock is blocked
 * (sandboxed iframes, some embeds).
 */
export function useGameKeybinds() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const state = useGameStore.getState()
      const { started, paused } = state

      if (e.key === 'Escape') {
        if (started && !paused) {
          state.setPaused(true)
        }
        return
      }

      if (e.key === 'Enter') {
        if (!started) {
          state.setStarted(true)
          state.setPaused(false)
          e.preventDefault()
        } else if (paused) {
          state.setPaused(false)
          e.preventDefault()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [])
}
