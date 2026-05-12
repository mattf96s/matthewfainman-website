import { useGameStore } from '../state/useGameStore'

/**
 * Renders the "Play multiplayer" button on the title overlay.
 * Clicking it flips `multiplayerJoined` in the game store; the
 * PlayroomProvider effect picks that up and calls insertCoin(),
 * which renders Playroom's own lobby UI over our scene.
 */
export function PlayroomLobbyButton() {
  const joined = useGameStore((s) => s.multiplayerJoined)
  const setJoined = useGameStore((s) => s.setMultiplayerJoined)

  if (joined) return null

  return (
    <button
      onClick={() => setJoined(true)}
      style={{
        marginTop: 14,
        padding: '8px 18px',
        fontSize: 13,
        fontWeight: 600,
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.3)',
        background: 'rgba(255,255,255,0.12)',
        color: 'white',
        cursor: 'pointer',
        fontFamily: 'inherit',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        pointerEvents: 'auto',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.background =
          'rgba(255,255,255,0.22)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.background =
          'rgba(255,255,255,0.12)'
      }}
    >
      Play multiplayer
    </button>
  )
}
