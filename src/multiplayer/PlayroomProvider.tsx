import { useEffect, useRef } from 'react'
import {
  insertCoin,
  myPlayer,
  onPlayerJoin,
  RPC,
  type PlayerState,
} from 'playroomkit'

import { useGameStore } from '../state/useGameStore'
import { pushShot } from './shots'
import {
  playroom,
  remotePlayerHandles,
  remoteSnapshots,
  type RemoteSnapshot,
} from './playroomState'

const RESPAWN_DELAY_MS = 1800

/**
 * Top-level multiplayer lifecycle. Mounted once at the route level
 * (client-only). Exposes nothing — listens to the game store for the
 * "user clicked Multiplayer" trigger, then enters the Playroom lobby
 * and registers RPC handlers.
 */
export function PlayroomProvider() {
  const wantJoin = useGameStore((s) => s.multiplayerJoined)
  const initStartedRef = useRef(false)
  const respawnTimerRef = useRef<number | null>(null)

  // Enter the Playroom lobby once the user opts in.
  useEffect(() => {
    if (!wantJoin || initStartedRef.current) return
    initStartedRef.current = true

    // GameId from joinplayroom.com — falls back to dev mode if absent.
    // Set VITE_PLAYROOM_GAME_ID to override for a different game.
    const gameId =
      (import.meta.env.VITE_PLAYROOM_GAME_ID as string | undefined) ??
      '2UqOeQa5wobIMg14yURV'

    insertCoin(
      {
        gameId,
        maxPlayersPerRoom: 8,
        skipLobby: false,
        defaultPlayerStates: {
          s: { x: 0, y: 1, z: 0, yaw: 0, hp: 100, dead: false, t: 0 },
        },
      },
      () => {
        playroom.joined = true
        playroom.myId = myPlayer().id
      },
      (err) => {
        console.error('[playroom] failed to enter lobby', err)
        useGameStore.getState().setMultiplayerJoined(false)
        initStartedRef.current = false
      },
    )

    // Track joins & quits — keep handle map in sync; quits also clear snapshots.
    const unsub = onPlayerJoin((player: PlayerState) => {
      remotePlayerHandles.set(player.id, player)
      player.onQuit(() => {
        remotePlayerHandles.delete(player.id)
        remoteSnapshots.delete(player.id)
      })
    })

    return () => {
      unsub()
    }
  }, [wantJoin])

  // RPC handlers — bind once when joined.
  useEffect(() => {
    if (!wantJoin) return

    // Other players announce they shot. Render the tracer locally; if
    // we're the named victim, apply damage and (if it kills us) tell
    // the shooter via 'killed-by' so they can score the kill.
    const unshot = RPC.register(
      'shot',
      async (
        data: {
          ox: number
          oy: number
          oz: number
          hx: number
          hy: number
          hz: number
          victimId: string | null
          damage: number
        },
        sender: PlayerState,
      ) => {
        pushShot(data.ox, data.oy, data.oz, data.hx, data.hy, data.hz)

        if (data.victimId && data.victimId === playroom.myId) {
          const store = useGameStore.getState()
          // hp=0 just marks us dying; the auto-respawn timer below brings
          // us back. Death is never terminal.
          store.takeDamage(data.damage, 'shot')
          if (useGameStore.getState().health <= 0) {
            const killerName = sender.getProfile().name ?? 'someone'
            store.addDeath(killerName)
            try {
              RPC.call(
                'killed-by',
                { victimName: myPlayer().getProfile().name },
                RPC.Mode.ALL,
              )
            } catch (e) {
              console.warn('[playroom] killed-by RPC failed', e)
            }
          }
        }
      },
    )

    // The victim tells us we killed them. senderPlayer is the second arg.
    const unkilled = RPC.register(
      'killed-by',
      async (data: { victimName: string }, sender: PlayerState) => {
        // Only the shooter (whoever fired the matching 'shot') should
        // score; we can't easily tag that, so credit whoever the victim
        // last took damage from. Simplification: every shooter who hit
        // the now-dead victim within the cooldown gets credit on their
        // own client. Cheap heuristic: only count if I fired in the last 1s.
        const lastFire = lastLocalFireAt.value
        if (performance.now() - lastFire < 1000) {
          useGameStore.getState().addKill(data.victimName)
        }
        // Silence unused-var lint.
        void sender
      },
    )

    return () => {
      unshot()
      unkilled()
    }
  }, [wantJoin])

  // Auto-respawn: when hp hits 0 in multiplayer, wait then heal+teleport.
  useEffect(() => {
    if (!wantJoin) return
    return useGameStore.subscribe((state) => {
      if (
        state.multiplayerJoined &&
        state.health <= 0 &&
        respawnTimerRef.current === null
      ) {
        respawnTimerRef.current = window.setTimeout(() => {
          useGameStore.getState().respawn()
          respawnTimerRef.current = null
        }, RESPAWN_DELAY_MS)
      }
    })
  }, [wantJoin])

  return null
}

/** Module-scope timestamp so the kill-credit heuristic can read it. */
export const lastLocalFireAt = { value: 0 }

/** Helper for the local Gun: push our own shot to the network and to the
 * local tracer queue in one call. */
export function broadcastShot(
  ox: number,
  oy: number,
  oz: number,
  hx: number,
  hy: number,
  hz: number,
  victimId: string | null,
  damage: number,
): void {
  pushShot(ox, oy, oz, hx, hy, hz)
  lastLocalFireAt.value = performance.now()
  if (!playroom.joined) return
  try {
    RPC.call(
      'shot',
      { ox, oy, oz, hx, hy, hz, victimId, damage },
      RPC.Mode.OTHERS,
    )
  } catch (e) {
    console.warn('[playroom] shot RPC failed', e)
  }
}

/** Helper for PlayerStateSync: broadcast my latest snapshot. */
export function broadcastSnapshot(snapshot: RemoteSnapshot): void {
  if (!playroom.joined) return
  try {
    myPlayer().setState('s', snapshot, false)
  } catch (e) {
    console.warn('[playroom] setState failed', e)
  }
}
