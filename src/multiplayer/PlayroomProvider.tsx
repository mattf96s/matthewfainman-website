import { useEffect, useRef } from 'react'
import {
  insertCoin,
  myPlayer,
  onPlayerJoin,
  RPC,
  type PlayerState,
} from 'playroomkit'

import { cameraState } from '../game/cameraState'
import { playerPosition } from '../game/playerPosition'
import { track } from '../lib/analytics'
import { colorForId } from '../lib/playerColor'
import { useGameStore } from '../state/useGameStore'
import {
  broadcastSnapshot,
  lastLocalFireAt,
  registerNet,
  unregisterNet,
} from './netBridge'
import { pushShot } from './shots'
import {
  playroom,
  remotePlayerHandles,
  remoteRendered,
  remoteSnapshots,
} from './playroomState'

const RESPAWN_DELAY_MS = 1800

/** One shared public room: every visitor lands in the same place, so if
 * anyone else is around you can immediately see and shoot them. */
const ROOM_CODE = 'amsterdam-canal'
const MAX_PLAYERS = 12

/** `?room=foo` overrides the shared room — E2E tests need isolation
 * from real visitors (and from each other), and it doubles as a way to
 * play a private match. */
function resolveRoomCode(): string {
  if (typeof window === 'undefined') return ROOM_CODE
  return new URLSearchParams(window.location.search).get('room') ?? ROOM_CODE
}

/**
 * Push our snapshot immediately, outside the 20Hz frame-loop cadence.
 * The frame loop pauses with rAF when the tab is backgrounded, but RPCs
 * and timers still run — so deaths and respawns that happen while hidden
 * must be pushed from here or other players see a frozen statue.
 */
function pushSnapshotNow(): void {
  if (!playroom.joined || !playerPosition.ready) return
  const store = useGameStore.getState()
  broadcastSnapshot({
    x: playerPosition.x,
    y: playerPosition.y,
    z: playerPosition.z,
    yaw: cameraState.yaw,
    hp: store.health,
    dead: store.health <= 0,
    receivedAt: performance.now(),
  })
}

/** A player's display name: their self-chosen name (synced as state 'n',
 * since skipLobby precludes Playroom's own profile editor) falling back
 * to the Playroom-generated profile name. */
function nameOf(player: PlayerState): string {
  const n: unknown = player.getState('n')
  if (typeof n === 'string' && n) return n
  return player.getProfile().name ?? 'stranger'
}

/**
 * Multiplayer lifecycle, lazy-loaded and mounted once at the route level
 * (client-only). Connects automatically on mount — there's no lobby and
 * no "join" button. Being the only module that imports `playroomkit`, it
 * gets code-split into its own chunk; the rest of the game talks to the
 * network through the dependency-free `netBridge`.
 */
export function PlayroomProvider() {
  const initStartedRef = useRef(false)
  const respawnTimerRef = useRef<number | null>(null)

  // Connect on mount. Open the page → you're in the shared room.
  useEffect(() => {
    if (initStartedRef.current) return
    initStartedRef.current = true

    const gameId =
      (import.meta.env.VITE_PLAYROOM_GAME_ID as string | undefined) ??
      '2UqOeQa5wobIMg14yURV'

    // Wire the in-canvas Gun / PlayerStateSync (which only know about the
    // bridge) to the live network now that this layer has loaded.
    registerNet({
      shot: (p) => {
        if (!playroom.joined) return
        try {
          RPC.call('shot', p, RPC.Mode.OTHERS)
        } catch (e) {
          console.warn('[playroom] shot RPC failed', e)
        }
      },
      snapshot: (s) => {
        if (!playroom.joined) return
        try {
          myPlayer().setState('s', s, false)
        } catch (e) {
          console.warn('[playroom] setState failed', e)
        }
      },
    })

    insertCoin(
      {
        gameId,
        roomCode: resolveRoomCode(),
        maxPlayersPerRoom: MAX_PLAYERS,
        skipLobby: true,
        defaultPlayerStates: {
          s: { x: 0, y: 1, z: 0, yaw: 0, hp: 100, dead: false, receivedAt: 0 },
        },
      },
      () => {
        playroom.joined = true
        playroom.myId = myPlayer().id
        useGameStore.getState().setMultiplayerJoined(true)
        // share the locally chosen name (if any) with the room
        const name = useGameStore.getState().playerName
        if (name) {
          try {
            myPlayer().setState('n', name, true)
          } catch (e) {
            console.warn('[playroom] name setState failed', e)
          }
        }
        track('multiplayer_connected')
      },
      (err) => {
        console.error('[playroom] failed to connect', err)
      },
    )

    // Keep the synced name current when the player edits it mid-session.
    const unsubName = useGameStore.subscribe((state, prev) => {
      if (!playroom.joined || state.playerName === prev.playerName) return
      try {
        myPlayer().setState('n', state.playerName, true)
      } catch (e) {
        console.warn('[playroom] name setState failed', e)
      }
    })

    // Track joins & quits — keep the handle map (for per-frame state
    // reads) and the store peer list (for presence + avatars) in sync.
    const unsub = onPlayerJoin((player: PlayerState) => {
      remotePlayerHandles.set(player.id, player)
      if (player.id !== myPlayer().id) {
        useGameStore.getState().addPeer({
          id: player.id,
          name: nameOf(player),
          // id-derived so every client renders this player identically
          color: colorForId(player.id),
        })
        track('peer_joined', { peers: useGameStore.getState().peers.length })
      }
      player.onQuit(() => {
        remotePlayerHandles.delete(player.id)
        remoteSnapshots.delete(player.id)
        remoteRendered.delete(player.id)
        useGameStore.getState().removePeer(player.id)
        track('peer_left', { peers: useGameStore.getState().peers.length })
      })
    })

    return () => {
      unsub()
      unsubName()
      unregisterNet()
    }
  }, [])

  // RPC handlers — incoming shots and kill credit.
  useEffect(() => {
    // Other players announce they shot. Render the tracer locally; if
    // we're the named victim, apply damage and (if it kills us) tell the
    // shooter via 'killed-by' so they can score the kill.
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
          store.takeDamage(data.damage, 'shot')
          if (useGameStore.getState().health <= 0) {
            // tell everyone we're down right away — the frame-loop
            // broadcast is paused if this tab is backgrounded
            pushSnapshotNow()
            store.addDeath(nameOf(sender))
            try {
              RPC.call(
                'killed-by',
                { victimName: nameOf(myPlayer()) },
                RPC.Mode.ALL,
              )
            } catch (e) {
              console.warn('[playroom] killed-by RPC failed', e)
            }
          }
        }
      },
    )

    // The victim tells everyone who died; credit the kill to us only if
    // we fired in the last second (cheap heuristic — no server auth).
    const unkilled = RPC.register(
      'killed-by',
      async (data: { victimName: string }, sender: PlayerState) => {
        if (performance.now() - lastLocalFireAt.value < 1000) {
          useGameStore.getState().addKill(data.victimName)
        }
        void sender
      },
    )

    return () => {
      unshot()
      unkilled()
    }
  }, [])

  // Auto-respawn: when hp hits 0 in multiplayer, wait then heal + teleport.
  useEffect(() => {
    return useGameStore.subscribe((state) => {
      if (
        state.multiplayerJoined &&
        state.health <= 0 &&
        respawnTimerRef.current === null
      ) {
        respawnTimerRef.current = window.setTimeout(() => {
          useGameStore.getState().respawn()
          // respawn() already teleported us (synchronous subscriber in
          // Player.tsx) — push the new spot now in case rAF is paused
          pushSnapshotNow()
          respawnTimerRef.current = null
        }, RESPAWN_DELAY_MS)
      }
    })
  }, [])

  return null
}
