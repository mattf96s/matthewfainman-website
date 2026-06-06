import { useEffect } from 'react'

import { useGameStore } from '../../state/useGameStore'

/** How long the player stays down before popping back at spawn. */
const RESPAWN_DELAY_MS = 1400

/**
 * Solo auto-respawn. When the player's health hits 0 in single-player,
 * wait a beat (so the "you got flattened" overlay reads) then heal and
 * teleport back to spawn — death is never terminal, it's just a knockdown.
 *
 * Multiplayer respawn is driven separately by the Playroom bridge
 * (`PlayroomProvider`), which also syncs the death/respawn over the wire.
 */
export function AutoRespawn() {
  useEffect(() => {
    let timer: number | null = null
    return useGameStore.subscribe((state) => {
      if (
        !state.multiplayerJoined &&
        state.health <= 0 &&
        timer === null
      ) {
        timer = window.setTimeout(() => {
          useGameStore.getState().respawn()
          timer = null
        }, RESPAWN_DELAY_MS)
      }
    })
  }, [])

  return null
}
