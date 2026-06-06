import { playroom } from '../../multiplayer/playroomState'
import { useGameStore } from '../../state/useGameStore'
import { RemotePlayer } from './RemotePlayer'

/**
 * Mounts a RemotePlayer per connected peer. The peer list lives in the
 * game store (updated on join/leave by the Playroom layer), so this
 * re-renders only when someone joins or leaves — per-frame positions flow
 * through the snapshot map. Reading peers from the store (rather than
 * Playroom's usePlayersList) keeps this component free of any playroomkit
 * import, so the networking code can be lazy-loaded.
 */
export function RemotePlayers() {
  const peers = useGameStore((s) => s.peers)

  return (
    <>
      {peers
        .filter((p) => p.id !== playroom.myId)
        .map((p) => (
          <RemotePlayer key={p.id} id={p.id} name={p.name} color={p.color} />
        ))}
    </>
  )
}
