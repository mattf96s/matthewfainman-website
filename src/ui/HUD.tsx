import { useEffect, useState } from 'react'
import { FileDown, Github, Linkedin } from 'lucide-react'

import { isTouchDevice } from '../game/mobileInput'
import { profile } from '../lib/profile'
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
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    setTouch(isTouchDevice())
  }, [])

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
        {touch ? 'Tap anywhere to begin.' : <>Press <kbd>Enter</kbd> to begin.</>}
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            opacity: 0.7,
            letterSpacing: '0.02em',
          }}
        >
          {touch ? (
            <>Tilt your phone to walk · drag the screen to look around</>
          ) : (
            <>
              <kbd>WASD</kbd> or <kbd>arrow keys</kbd> to walk ·{' '}
              <kbd>Q</kbd>/<kbd>E</kbd> to turn
            </>
          )}
        </div>
        <SocialLinks />
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

function SocialLinks() {
  const items: Array<{
    label: string
    href: string
    Icon: typeof Github
    download?: string
  }> = [
    { label: 'GitHub', href: profile.github, Icon: Github },
    { label: 'LinkedIn', href: profile.linkedin, Icon: Linkedin },
    {
      label: 'Download CV',
      href: profile.cvDownload,
      Icon: FileDown,
      download: profile.cvFilename,
    },
  ]

  return (
    <div
      style={{
        marginTop: 28,
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        pointerEvents: 'auto',
      }}
    >
      {items.map(({ label, href, Icon, download }) => (
        <a
          key={label}
          href={href}
          target={download ? undefined : '_blank'}
          rel={download ? undefined : 'noopener noreferrer'}
          download={download}
          aria-label={label}
          title={label}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'rgba(255,255,255,0.08)',
            color: 'white',
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'background 120ms',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLAnchorElement).style.background =
              'rgba(255,255,255,0.18)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLAnchorElement).style.background =
              'rgba(255,255,255,0.08)'
          }}
        >
          <Icon size={16} strokeWidth={1.8} />
          {label}
        </a>
      ))}
    </div>
  )
}

function gameOverReasonText(reason: string | null): string {
  switch (reason) {
    case 'tram':
      return 'A tram clipped you'
    case 'bike':
      return 'A cyclist took you out'
    default:
      return 'You were knocked down'
  }
}
