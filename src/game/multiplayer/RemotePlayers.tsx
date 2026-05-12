import { usePlayersList } from 'playroomkit'

import { playroom } from '../../multiplayer/playroomState'
import { useGameStore } from '../../state/useGameStore'
import { RemotePlayer } from './RemotePlayer'

/**
 * Mounts a RemotePlayer per non-local Playroom player. usePlayersList
 * (without the changeOnState flag) re-renders only on join/leave, not
 * on per-frame position updates — those flow through the snapshot map.
 */
export function RemotePlayers() {
  const joined = useGameStore((s) => s.multiplayerJoined)
  const players = usePlayersList()

  if (!joined) return null

  return (
    <>
      {players
        .filter((p) => p.id !== playroom.myId)
        .map((p) => {
          const profile = p.getProfile()
          const color = profile.color?.hexString ?? '#e07a5f'
          return (
            <RemotePlayer
              key={p.id}
              id={p.id}
              name={profile.name}
              color={color}
            />
          )
        })}
    </>
  )
}
