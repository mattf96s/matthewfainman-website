import { useGameStore } from '../state/useGameStore'

const baseText: React.CSSProperties = {
  color: 'white',
  fontFamily: 'monospace',
  textShadow: '0 1px 2px rgba(0,0,0,0.6)',
  pointerEvents: 'none',
}

export function HUD() {
  const fps = useGameStore((s) => s.fps)
  const score = useGameStore((s) => s.score)
  const lives = useGameStore((s) => s.lives)
  const locked = useGameStore((s) => s.locked)
  const gameOver = useGameStore((s) => s.gameOver)
  const gameOverReason = useGameStore((s) => s.gameOverReason)
  const reset = useGameStore((s) => s.reset)

  return (
    <>
      <div style={{ ...baseText, position: 'absolute', top: 12, left: 12, fontSize: 14 }}>
        {fps.toFixed(0)} fps
      </div>

      <div
        style={{
          ...baseText,
          position: 'absolute',
          top: 12,
          right: 16,
          fontSize: 22,
          textAlign: 'right',
        }}
      >
        <div>{score}s</div>
        <div style={{ fontSize: 18, marginTop: 4 }}>
          {'♥'.repeat(Math.max(0, lives))}
          <span style={{ opacity: 0.25 }}>
            {'♥'.repeat(Math.max(0, 3 - lives))}
          </span>
        </div>
      </div>

      {!locked && !gameOver && (
        <Overlay>
          <Title>Click to play</Title>
          <Subtitle>
            WASD to walk, mouse to look, space to jump.
            <br />
            Press <kbd>Esc</kbd> to release the cursor.
          </Subtitle>
        </Overlay>
      )}

      {gameOver && (
        <Overlay enablePointer>
          <Title>Game over</Title>
          <Subtitle>
            {gameOverReasonText(gameOverReason)} after {score} seconds.
          </Subtitle>
          <button
            onClick={reset}
            style={{
              marginTop: 20,
              padding: '10px 22px',
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.12)',
              color: 'white',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Try again
          </button>
        </Overlay>
      )}
    </>
  )
}

function Overlay({
  children,
  enablePointer = false,
}: {
  children: React.ReactNode
  enablePointer?: boolean
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
        color: 'white',
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        pointerEvents: enablePointer ? 'auto' : 'none',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 380 }}>{children}</div>
    </div>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 32,
        fontWeight: 600,
        letterSpacing: '0.02em',
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  )
}

function Subtitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5 }}>
      {children}
    </div>
  )
}

function gameOverReasonText(reason: string | null): string {
  switch (reason) {
    case 'tram':
      return 'A tram clipped you'
    case 'canal':
      return 'You fell in the gracht'
    case 'bike':
      return 'A cyclist took you out'
    default:
      return 'You were knocked down'
  }
}
