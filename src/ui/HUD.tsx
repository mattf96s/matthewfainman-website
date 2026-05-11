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
  const nearMissCount = useGameStore((s) => s.nearMissCount)
  const started = useGameStore((s) => s.started)
  const paused = useGameStore((s) => s.paused)
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
        <div>{score}</div>
        <div style={{ fontSize: 18, marginTop: 4 }}>
          {'♥'.repeat(Math.max(0, lives))}
          <span style={{ opacity: 0.25 }}>
            {'♥'.repeat(Math.max(0, 3 - lives))}
          </span>
        </div>
        {nearMissCount > 0 && (
          <div style={{ fontSize: 12, marginTop: 6, opacity: 0.85 }}>
            {nearMissCount} near miss{nearMissCount === 1 ? '' : 'es'}
          </div>
        )}
      </div>

      {!started && <TitleOverlay />}
      {started && paused && !gameOver && <PauseOverlay />}
      {gameOver && (
        <GameOverOverlay
          reason={gameOverReason}
          score={score}
          nearMissCount={nearMissCount}
          reset={reset}
        />
      )}
    </>
  )
}

function TitleOverlay() {
  return (
    <Overlay>
      <div
        style={{
          fontSize: 13,
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          opacity: 0.7,
          marginBottom: 14,
        }}
      >
        Matthew Fainman
      </div>
      <Title>Amsterdam Explorer</Title>
      <Subtitle>
        Walk the gracht. Mind the cyclists. Don't argue with the tram.
        <div style={{ marginTop: 20 }}>
          <strong>
            Press <kbd>Enter</kbd> or click to begin.
          </strong>
          <div style={{ marginTop: 8, opacity: 0.75, fontSize: 13 }}>
            <kbd>WASD</kbd> walk · <kbd>Q</kbd>/<kbd>E</kbd> turn · mouse look ·{' '}
            <kbd>Space</kbd> jump · <kbd>Esc</kbd> pause
          </div>
        </div>
      </Subtitle>
    </Overlay>
  )
}

function PauseOverlay() {
  return (
    <Overlay>
      <Title>Paused</Title>
      <Subtitle>
        Press <kbd>Enter</kbd> or click to resume.
      </Subtitle>
    </Overlay>
  )
}

function GameOverOverlay({
  reason,
  score,
  nearMissCount,
  reset,
}: {
  reason: string | null
  score: number
  nearMissCount: number
  reset: () => void
}) {
  return (
    <Overlay enablePointer>
      <Title>Game over</Title>
      <Subtitle>
        {gameOverReasonText(reason)} after {score} points.
        {nearMissCount > 0 && (
          <div style={{ marginTop: 8, opacity: 0.7 }}>
            {nearMissCount} near miss{nearMissCount === 1 ? '' : 'es'}.
          </div>
        )}
      </Subtitle>
      <button
        onClick={reset}
        style={{
          marginTop: 22,
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
        background:
          'radial-gradient(circle at center, rgba(0,0,0,0.25), rgba(0,0,0,0.6))',
        color: 'white',
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        pointerEvents: enablePointer ? 'auto' : 'none',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 420, padding: '0 24px' }}>
        {children}
      </div>
    </div>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 44,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        marginBottom: 14,
        lineHeight: 1,
      }}
    >
      {children}
    </div>
  )
}

function Subtitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.5 }}>
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
