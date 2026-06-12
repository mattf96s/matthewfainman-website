import { useEffect } from 'react'

import { useGameStore } from '../state/useGameStore'

/** Don't let gameplay keys fire while the player is typing (name editor). */
function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable)
  )
}

/** Min ms between wheel-driven weapon swaps — trackpads fire dozens of
 * wheel events per flick; without this one scroll cycles the loadout. */
const WHEEL_SWAP_COOLDOWN_MS = 200

/**
 * Global keybinds for game flow:
 *   - Enter / Space (on overlays): start or resume
 *   - Esc: pause during play
 *   - 1 / 2: select gun / sword; Tab and mouse wheel (while
 *     pointer-locked) quick-swap between them
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
        return
      }

      // Weapon selection — standard shooter number rows, plus Tab to
      // quick-swap. Tab only bites while pointer-locked so the page
      // keeps normal keyboard focus navigation outside of play.
      if (!started || paused || isTypingTarget(e.target)) return
      if (e.key === '1') {
        state.setWeapon('gun')
      } else if (e.key === '2') {
        state.setWeapon('sword')
      } else if (e.key === 'Tab' && document.pointerLockElement) {
        e.preventDefault()
        state.toggleWeapon()
      }
    }

    // Mouse wheel cycles weapons while locked — with two weapons that's
    // a swap, throttled so one trackpad flick is one swap.
    let lastWheelSwap = 0
    const onWheel = (e: WheelEvent) => {
      if (!document.pointerLockElement) return
      if (Math.abs(e.deltaY) < 2) return
      const state = useGameStore.getState()
      if (!state.started || state.paused) return
      const now = performance.now()
      if (now - lastWheelSwap < WHEEL_SWAP_COOLDOWN_MS) return
      lastWheelSwap = now
      state.toggleWeapon()
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel)
    }
  }, [])
}
