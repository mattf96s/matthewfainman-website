import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Github, Linkedin, Volume2, VolumeX } from 'lucide-react'

import { isTouchDevice, mobileInput } from '../game/mobileInput'
import { profile } from '../lib/profile'
import * as sfx from '../lib/sfx'
import {
  MAX_HEALTH,
  useGameStore,
  type KillFeedEntry,
} from '../state/useGameStore'
import { FeedbackSystem } from './FeedbackSystem'
import { onFloat, type FloatTextEvent } from './floatText'
import { onHit } from './hitmarker'
import { VirtualJoystick } from './VirtualJoystick'

const hudFont: CSSProperties = {
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  color: '#fff',
  textShadow: '0 1px 2px rgba(0,0,0,0.55)',
}

const panel: CSSProperties = {
  background: 'rgba(15,20,24,0.5)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
  padding: '8px 12px',
  backdropFilter: 'blur(6px)',
  pointerEvents: 'none',
}

const kbdStyle: CSSProperties = {
  display: 'inline-block',
  padding: '1px 6px',
  margin: '0 1px',
  borderRadius: 6,
  background: 'rgba(255,255,255,0.16)',
  border: '1px solid rgba(255,255,255,0.25)',
  fontSize: 12,
  fontWeight: 600,
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <span style={kbdStyle}>{children}</span>
}

function healthColor(pct: number): string {
  if (pct > 0.5) return '#7bd88f'
  if (pct > 0.25) return '#e8c45a'
  return '#e87a7a'
}

export function HUD() {
  const fps = useGameStore((s) => s.fps)
  const paused = useGameStore((s) => s.paused)
  const locked = useGameStore((s) => s.locked)
  const deathReason = useGameStore((s) => s.deathReason)
  const multiplayerJoined = useGameStore((s) => s.multiplayerJoined)
  const killFeed = useGameStore((s) => s.killFeed)
  const health = useGameStore((s) => s.health)
  const dead = health <= 0

  const [touch, setTouch] = useState(false)
  useEffect(() => {
    setTouch(isTouchDevice())
  }, [])

  const active = !dead && !paused
  // Crosshair only when you can actually shoot: on desktop that's once
  // pointer-locked, so its appearance teaches the lock step.
  const showCrosshair = active && (touch || locked)

  return (
    <>
      {/* gameplay → sound + combat text + analytics */}
      <FeedbackSystem />

      <div
        style={{
          ...hudFont,
          position: 'absolute',
          top: 12,
          left: 14,
          fontSize: 13,
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      >
        {fps.toFixed(0)} fps
      </div>
      <MuteButton />

      {showCrosshair && <Crosshair />}
      <Hitmarker />

      <Presence />
      {multiplayerJoined && killFeed.length > 0 && <KillFeed entries={killFeed} />}

      <HealthBar />
      <Scoreboard />
      <Credit />
      <FloatingTexts />

      {dead && <RespawnOverlay reason={deathReason} />}
      {active && <ControlsPrompt touch={touch} locked={locked} />}
      {paused && !dead && <PauseOverlay />}

      {touch && active && <VirtualJoystick />}
      {touch && active && <TouchControls />}
    </>
  )
}

function HealthBar() {
  const health = useGameStore((s) => s.health)
  const pct = Math.max(0, Math.min(1, health / MAX_HEALTH))
  const color = healthColor(pct)
  const [flashKey, setFlashKey] = useState(0)
  const prev = useRef(health)

  useEffect(() => {
    if (health !== prev.current) {
      prev.current = health
      setFlashKey((k) => k + 1)
    }
  }, [health])

  return (
    <div
      style={{
        ...panel,
        position: 'absolute',
        left: 16,
        bottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <span style={{ color, fontSize: 18, lineHeight: 1 }}>♥</span>
      <div
        style={{
          width: 160,
          height: 12,
          borderRadius: 99,
          background: 'rgba(255,255,255,0.16)',
          overflow: 'hidden',
        }}
      >
        <div
          key={flashKey}
          className="ae-flash"
          style={{
            width: `${pct * 100}%`,
            height: '100%',
            background: color,
            borderRadius: 99,
            transition: 'width 220ms ease, background 220ms ease',
          }}
        />
      </div>
      <span
        style={{
          ...hudFont,
          fontSize: 13,
          fontWeight: 700,
          minWidth: 30,
          textAlign: 'right',
        }}
      >
        {Math.max(0, Math.ceil(health))}
      </span>
    </div>
  )
}

function Scoreboard() {
  const score = useGameStore((s) => s.score)
  const nearMiss = useGameStore((s) => s.nearMissCount)

  return (
    <div
      style={{
        ...panel,
        position: 'absolute',
        top: 12,
        right: 12,
        textAlign: 'right',
      }}
    >
      <div
        style={{
          ...hudFont,
          fontSize: 11,
          letterSpacing: '0.14em',
          opacity: 0.7,
          textTransform: 'uppercase',
        }}
      >
        Score
      </div>
      <div style={{ ...hudFont, fontSize: 26, fontWeight: 800, lineHeight: 1.05 }}>
        {score}
      </div>
      {nearMiss > 0 && (
        <div style={{ ...hudFont, fontSize: 12, opacity: 0.8, marginTop: 2 }}>
          🚲 {nearMiss} dodged
        </div>
      )}
    </div>
  )
}

function Presence() {
  const joined = useGameStore((s) => s.multiplayerJoined)
  const peers = useGameStore((s) => s.peers)
  const kills = useGameStore((s) => s.kills)
  const deaths = useGameStore((s) => s.deaths)

  if (!joined) return null
  const others = peers.length

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <div
        style={{
          ...hudFont,
          ...panel,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontSize: 12,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 99,
            background: others > 0 ? '#7bd88f' : '#9fb0b0',
            animation: others > 0 ? 'ae-pulse 2s ease-in-out infinite' : 'none',
          }}
        />
        {others + 1} online
      </div>
      {others > 0 && (
        <div
          style={{ ...hudFont, ...panel, fontSize: 13, letterSpacing: '0.06em' }}
        >
          <span style={{ color: '#a4e8a4' }}>{kills} K</span>
          <span style={{ opacity: 0.4, margin: '0 6px' }}>/</span>
          <span style={{ color: '#e8a4a4' }}>{deaths} D</span>
        </div>
      )}
    </div>
  )
}

function MuteButton() {
  const [muted, setMuted] = useState(false)
  useEffect(() => {
    setMuted(sfx.isMuted())
  }, [])

  return (
    <button
      onClick={() => setMuted(sfx.toggleMuted())}
      title={muted ? 'Unmute' : 'Mute'}
      aria-label={muted ? 'Unmute' : 'Mute'}
      style={{
        ...panel,
        position: 'absolute',
        top: 8,
        left: 62,
        padding: 6,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        cursor: 'pointer',
        pointerEvents: 'auto',
      }}
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  )
}

function Credit() {
  const iconLink: CSSProperties = {
    color: '#fff',
    opacity: 0.85,
    display: 'inline-flex',
    pointerEvents: 'auto',
  }
  return (
    <div
      style={{
        ...hudFont,
        position: 'absolute',
        bottom: 14,
        right: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 12,
        opacity: 0.82,
        pointerEvents: 'none',
      }}
    >
      <span style={{ fontWeight: 600 }}>Matthew Fainman</span>
      <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" style={iconLink}>
        <Github size={15} />
      </a>
      <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" style={iconLink}>
        <Linkedin size={15} />
      </a>
    </div>
  )
}

/**
 * One clear call-to-action per state:
 *  - desktop, not locked → "Click to aim & shoot" (clicking grabs pointer
 *    lock; the crosshair then appears, signalling you can fire)
 *  - touch → a brief controls hint that auto-dismisses
 */
function ControlsPrompt({ touch, locked }: { touch: boolean; locked: boolean }) {
  const [hintGone, setHintGone] = useState(false)
  useEffect(() => {
    if (!touch) return
    const t = window.setTimeout(() => setHintGone(true), 6000)
    return () => window.clearTimeout(t)
  }, [touch])

  if (touch) {
    if (hintGone) return null
    return (
      <div
        style={{
          ...hudFont,
          position: 'absolute',
          left: '50%',
          bottom: '20%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ ...panel, fontSize: 13, whiteSpace: 'nowrap' }}>
          Left stick to move · drag to look ·{' '}
          <b style={{ color: '#ffb4a0' }}>FIRE</b> to shoot
        </div>
      </div>
    )
  }

  // Desktop: the prompt is the lock affordance. Hide once locked.
  if (locked) return null
  return (
    <div
      style={{
        ...hudFont,
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        pointerEvents: 'none',
        textAlign: 'center',
      }}
    >
      <div style={{ ...panel, padding: '16px 22px' }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>🖱 Click to aim &amp; shoot</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8 }}>
          <Kbd>WASD</Kbd> move · <Kbd>Q</Kbd>/<Kbd>E</Kbd> turn ·{' '}
          <Kbd>Space</Kbd> jump · <Kbd>Esc</Kbd> release
        </div>
      </div>
    </div>
  )
}

/** Bottom-right thumb cluster on touch devices: JUMP + FIRE. A dedicated
 * FIRE button (vs tap-to-shoot) avoids fighting the drag-to-look gesture. */
function TouchControls() {
  return (
    <div
      style={{
        position: 'absolute',
        right: 22,
        bottom: 28,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 14,
        pointerEvents: 'none',
      }}
    >
      <ActionButton
        label="JUMP"
        size={64}
        onDown={() => {
          mobileInput.jumpPressed = true
        }}
        onUp={() => {
          mobileInput.jumpPressed = false
        }}
      />
      <ActionButton
        label="FIRE"
        size={92}
        accent
        onDown={() => {
          mobileInput.firePressed = true
        }}
        onUp={() => {
          mobileInput.firePressed = false
        }}
      />
    </div>
  )
}

function ActionButton({
  label,
  size,
  accent,
  onDown,
  onUp,
}: {
  label: string
  size: number
  accent?: boolean
  onDown: () => void
  onUp: () => void
}) {
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault()
        onDown()
      }}
      onPointerUp={(e) => {
        e.preventDefault()
        onUp()
      }}
      onPointerCancel={onUp}
      onPointerLeave={onUp}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        pointerEvents: 'auto',
        width: size,
        height: size,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.3)',
        background: accent ? 'rgba(232,122,122,0.4)' : 'rgba(255,255,255,0.14)',
        color: '#fff',
        fontWeight: 800,
        fontSize: 13,
        letterSpacing: '0.06em',
        backdropFilter: 'blur(6px)',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {label}
    </button>
  )
}

function Hitmarker() {
  const [tick, setTick] = useState(0)
  const [show, setShow] = useState(false)
  useEffect(() => {
    return onHit(() => {
      setTick((t) => t + 1)
      setShow(true)
      window.setTimeout(() => setShow(false), 200)
    })
  }, [])
  if (!show) return null
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      <span key={tick} className="ae-hit" style={{ color: '#ffe08a', fontSize: 24, fontWeight: 900 }}>
        ✕
      </span>
    </div>
  )
}

function FloatingTexts() {
  const [items, setItems] = useState<FloatTextEvent[]>([])

  useEffect(() => {
    return onFloat((e) => {
      setItems((prev) => [...prev, e])
      window.setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== e.id))
      }, 1100)
    })
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {items.map((it) => (
        <div
          key={it.id}
          className="ae-float"
          style={{
            position: 'absolute',
            left: '50%',
            top: '44%',
            color: it.color,
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontWeight: 800,
            fontSize: 20,
            textShadow: '0 2px 4px rgba(0,0,0,0.7)',
            whiteSpace: 'nowrap',
          }}
        >
          {it.text}
        </div>
      ))}
    </div>
  )
}

function Crosshair() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 14,
        height: 14,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: 0,
          width: 2,
          height: 14,
          background: 'rgba(255,255,255,0.8)',
          boxShadow: '0 0 2px rgba(0,0,0,0.7)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 6,
          width: 14,
          height: 2,
          background: 'rgba(255,255,255,0.8)',
          boxShadow: '0 0 2px rgba(0,0,0,0.7)',
        }}
      />
    </div>
  )
}

function KillFeed({ entries }: { entries: KillFeedEntry[] }) {
  return (
    <div
      style={{
        ...hudFont,
        position: 'absolute',
        top: 92,
        right: 16,
        fontSize: 13,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        textAlign: 'right',
        pointerEvents: 'none',
      }}
    >
      {entries.map((e) => (
        <div key={e.id} style={{ opacity: 0.85 }}>
          <span style={{ color: e.killer === 'You' ? '#a4e8a4' : '#e8d68a' }}>
            {e.killer}
          </span>
          <span style={{ opacity: 0.6 }}> → </span>
          <span style={{ color: e.victim === 'You' ? '#e8a4a4' : '#e8d68a' }}>
            {e.victim}
          </span>
        </div>
      ))}
    </div>
  )
}

function RespawnOverlay({ reason }: { reason: string | null }) {
  return (
    <div
      style={{
        ...hudFont,
        position: 'absolute',
        top: '38%',
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: 0.9,
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
        {deathReasonText(reason)}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          opacity: 0.85,
        }}
      >
        Respawning…
      </div>
    </div>
  )
}

function PauseOverlay() {
  return (
    <Overlay>
      <Title>Paused</Title>
      <Subtitle>
        Press <Kbd>Enter</Kbd> or click to resume.
      </Subtitle>
    </Overlay>
  )
}

function Overlay({ children }: { children: React.ReactNode }) {
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
        pointerEvents: 'none',
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
    <div style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.5 }}>{children}</div>
  )
}

function deathReasonText(reason: string | null): string {
  switch (reason) {
    case 'tram':
      return 'A tram ploughed through you'
    case 'car':
      return 'A car ran you down'
    case 'bike':
      return 'A cyclist took you out'
    case 'water':
      return 'You drowned in the gracht'
    case 'shot':
      return 'You got gunned down'
    default:
      return 'You went down'
  }
}
