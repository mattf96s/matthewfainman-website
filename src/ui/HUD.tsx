import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Github, Linkedin, Volume2, VolumeX } from 'lucide-react'

import { cameraState } from '../game/cameraState'
import {
  CAMERA_PITCH_MAX,
  CAMERA_PITCH_MIN,
  TOUCH_LOOK_SENSITIVITY,
} from '../game/constants'
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
import { Minimap } from './Minimap'
import { NameEditor } from './NameEditor'
import { VirtualJoystick } from './VirtualJoystick'

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-px inline-block rounded-md border border-white/25 bg-white/16 px-1.5 py-px font-[inherit] text-xs font-semibold">
      {children}
    </kbd>
  )
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
  const weapon = useGameStore((s) => s.weapon)
  const dead = health <= 0

  const [touch, setTouch] = useState(false)
  useEffect(() => {
    setTouch(isTouchDevice())
  }, [])

  const active = !dead && !paused
  // While playing on a phone the thumb zones (joystick left, buttons
  // right) must stay clear, so the social credit — which lives bottom-
  // right and would sit under the FIRE button — is dropped during play.
  // On desktop it stays put (incl. the start screen, where it's the
  // bottom-right GitHub/LinkedIn corner).
  const showMobilePlay = active && touch
  // Crosshair only when you can actually shoot: on desktop that's once
  // pointer-locked, so its appearance teaches the lock step. The sword
  // doesn't aim down the crosshair (it's a body-centred arc), so showing
  // one would wrongly suggest you can stab at range.
  const showCrosshair = active && weapon === 'gun' && (touch || locked)

  return (
    <>
      {/* gameplay → sound + combat text + analytics */}
      <FeedbackSystem />

      {/* FPS is dev-facing noise — desktop only, never on a phone HUD */}
      {!touch && (
        <div className="hud-text pointer-events-none absolute left-3.5 top-3 text-[13px] opacity-60">
          {fps.toFixed(0)} fps
        </div>
      )}
      <MuteButton compact={touch} />

      {showCrosshair && <Crosshair />}
      <Hitmarker />

      <Presence touch={touch} />
      {multiplayerJoined && killFeed.length > 0 && <KillFeed entries={killFeed} />}

      <HealthBar compact={touch} />
      <Scoreboard compact={touch} />
      {active && <Minimap compact={touch} />}
      {!showMobilePlay && <Credit />}
      <FloatingTexts />

      {dead && <RespawnOverlay reason={deathReason} />}
      {active && touch && <TouchHint />}
      {active && !touch && !locked && <StartPrompt />}
      {paused && !dead && <PauseOverlay />}

      {touch && active && <VirtualJoystick />}
      {touch && active && <TouchControls />}
      {/* touch has no start overlay to host the name input, so it gets a
        * persistent tap-to-edit chip next to the mute button instead */}
      {touch && active && (
        <div className="absolute left-13 top-2">
          <NameEditor compact />
        </div>
      )}
    </>
  )
}

function HealthBar({ compact }: { compact?: boolean }) {
  const health = useGameStore((s) => s.health)
  const pct = Math.max(0, Math.min(1, health / MAX_HEALTH))
  const color = healthColor(pct)
  const [flashKey, setFlashKey] = useState(0)
  const prev = useRef(health)

  useEffect(() => {
    // flash on damage only — regen ticks every fraction of a second and
    // a constantly-pulsing bar would read as taking damage
    if (health < prev.current) {
      setFlashKey((k) => k + 1)
    }
    prev.current = health
  }, [health])

  // On a phone the bottom-left is the joystick's thumb zone, so health
  // lives top-left (under the mute/name row) and shrinks. Desktop keeps
  // it in the bottom-left corner where there's nothing to collide with.
  return (
    <div
      className={`hud-panel pointer-events-none absolute flex items-center ${
        compact
          ? 'left-3 top-11 gap-1.75 px-2.25 py-1.25'
          : 'bottom-4 left-4 gap-2.5 px-3 py-2'
      }`}
    >
      <span
        className={`leading-none ${compact ? 'text-sm' : 'text-lg'}`}
        style={{ color }}
      >
        ♥
      </span>
      <div
        className={`overflow-hidden rounded-full bg-white/16 ${
          compact ? 'h-2 w-27' : 'h-3 w-40'
        }`}
      >
        <div
          key={flashKey}
          className="ae-flash h-full rounded-full duration-220 [transition-property:width,background]"
          style={{ width: `${pct * 100}%`, background: color }}
        />
      </div>
      <span
        className={`hud-text text-right font-bold ${
          compact ? 'min-w-6 text-xs' : 'min-w-7.5 text-[13px]'
        }`}
      >
        {Math.max(0, Math.ceil(health))}
      </span>
    </div>
  )
}

function Scoreboard({ compact }: { compact?: boolean }) {
  const score = useGameStore((s) => s.score)
  const nearMiss = useGameStore((s) => s.nearMissCount)

  return (
    <div
      className={`hud-panel pointer-events-none absolute right-3 top-3 text-right ${
        compact ? 'px-2.5 py-1.25' : 'px-3 py-2'
      }`}
    >
      <div
        className={`hud-text uppercase tracking-[0.14em] opacity-70 ${
          compact ? 'text-[9px]' : 'text-[11px]'
        }`}
      >
        Score
      </div>
      <div
        className={`hud-text font-extrabold leading-[1.05] ${
          compact ? 'text-lg' : 'text-[26px]'
        }`}
      >
        {score}
      </div>
      {nearMiss > 0 && (
        <div
          className={`hud-text mt-0.5 opacity-80 ${
            compact ? 'text-[11px]' : 'text-xs'
          }`}
        >
          🚲 {nearMiss} dodged
        </div>
      )}
    </div>
  )
}

function Presence({ touch }: { touch?: boolean }) {
  const joined = useGameStore((s) => s.multiplayerJoined)
  const peers = useGameStore((s) => s.peers)
  const kills = useGameStore((s) => s.kills)
  const deaths = useGameStore((s) => s.deaths)

  if (!joined) return null
  const others = peers.length
  // Solo on a phone, the "1 online" pill is just clutter in the crowded
  // top band — only surface presence once there's actually someone else.
  if (touch && others === 0) return null

  return (
    <div className="absolute left-1/2 top-3 flex -translate-x-1/2 flex-col items-center gap-1.5">
      <div className="hud-panel hud-text pointer-events-none flex items-center gap-1.75 text-xs">
        <span
          className={`h-2 w-2 rounded-full ${
            others > 0
              ? 'animate-[ae-pulse_2s_ease-in-out_infinite] bg-[#7bd88f]'
              : 'bg-[#9fb0b0]'
          }`}
        />
        {others + 1} online
      </div>
      {others > 0 && (
        <div className="hud-panel hud-text pointer-events-none text-[13px] tracking-[0.06em]">
          <span className="text-[#a4e8a4]">{kills} K</span>
          <span className="mx-1.5 opacity-40">/</span>
          <span className="text-[#e8a4a4]">{deaths} D</span>
        </div>
      )}
    </div>
  )
}

function MuteButton({ compact }: { compact?: boolean }) {
  const [muted, setMuted] = useState(false)
  useEffect(() => {
    setMuted(sfx.isMuted())
  }, [])

  return (
    <button
      onClick={() => setMuted(sfx.toggleMuted())}
      title={muted ? 'Unmute' : 'Mute'}
      aria-label={muted ? 'Unmute' : 'Mute'}
      // desktop sits right of the FPS readout; mobile has no FPS, so it
      // takes the corner and the name chip sits next to it
      className={`hud-panel pointer-events-auto absolute top-2 inline-flex cursor-pointer items-center justify-center p-1.5 text-white ${
        compact ? 'left-3' : 'left-15.5'
      }`}
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  )
}

function Credit() {
  return (
    <div className="hud-text pointer-events-none absolute bottom-3.5 right-4 flex items-center gap-2.5 text-xs opacity-[0.82]">
      <span className="font-semibold">Matthew Fainman</span>
      <Link
        to="/about"
        className="pointer-events-auto font-semibold text-white no-underline opacity-85"
      >
        about
      </Link>
      <a
        href={profile.github}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="pointer-events-auto inline-flex text-white opacity-85"
      >
        <Github size={15} />
      </a>
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
        className="pointer-events-auto inline-flex text-white opacity-85"
      >
        <Linkedin size={15} />
      </a>
    </div>
  )
}

/**
 * Desktop pre-lock call-to-action. Clicking the canvas grabs pointer lock
 * (the crosshair then appears, signalling you can fire), so this is the
 * lock affordance: the welcome title leads, the name entry is the clear
 * secondary action, and the controls recede to a single dim line of fine
 * print. Socials live bottom-right in the always-on Credit. The HUD only
 * mounts this while unlocked, so there's no in-play locked branch here.
 */
function StartPrompt() {
  return (
    <div className="hud-text pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
      <div className="hud-panel flex flex-col items-center px-6.5 py-4.5">
        <h1 className="text-[28px] font-bold leading-none tracking-tight">
          Welcome to Amsterdam
        </h1>
        <p className="mt-2 text-base font-medium opacity-80">
          🖱 Click to aim &amp; shoot
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="opacity-80">playing as</span>
          <NameEditor />
        </div>

        <div className="mt-4 text-xs opacity-50">
          <Kbd>WASD</Kbd> move · mouse to look · <Kbd>Tab</Kbd> swap weapons ·{' '}
          <Kbd>Esc</Kbd> pause
        </div>
      </div>
    </div>
  )
}

/** Brief touch controls hint that auto-dismisses after a few seconds. */
function TouchHint() {
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setGone(true), 6000)
    return () => window.clearTimeout(t)
  }, [])

  if (gone) return null
  return (
    // clear of the bottom thumb buttons; wraps instead of running off the
    // screen edge like the old single nowrap line did
    <div className="hud-text pointer-events-none absolute bottom-[32%] left-1/2 w-[min(76vw,260px)] -translate-x-1/2">
      <div className="hud-panel text-center text-[13px] leading-normal">
        Left stick to move · drag to look · hold{' '}
        <b className="text-[#ffb4a0]">FIRE</b> to shoot
      </div>
    </div>
  )
}

/** Bottom-right thumb cluster on touch devices: JUMP + FIRE, with the
 * weapon-swap chip stacked above FIRE (the mobile-shooter convention:
 * weapon slot lives by the trigger thumb).
 * Fixed-positioned with safe-area insets, like the joystick — anchoring
 * inside the (100vh-tall) page container put it under Safari's toolbar. */
function TouchControls() {
  return (
    <div className="pointer-events-none fixed bottom-[max(24px,env(safe-area-inset-bottom))] right-[max(20px,env(safe-area-inset-right))] z-20 flex items-end gap-3.5">
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
      <div className="flex flex-col items-center gap-3">
        <WeaponSwapButton />
        <ActionButton
          label="FIRE"
          size={96}
          accent
          onDown={() => {
            mobileInput.firePressed = true
          }}
          onUp={() => {
            mobileInput.firePressed = false
          }}
          // The CoD-mobile trick: the held FIRE thumb also steers the aim,
          // so move (left thumb) + aim + shoot (right thumb) works with
          // just two thumbs. Same sensitivity as the canvas look-drag.
          onDrag={(dx, dy) => {
            cameraState.yaw -= dx * TOUCH_LOOK_SENSITIVITY
            cameraState.pitch = Math.max(
              CAMERA_PITCH_MIN,
              Math.min(
                CAMERA_PITCH_MAX,
                cameraState.pitch + dy * TOUCH_LOOK_SENSITIVITY,
              ),
            )
          }}
        />
      </div>
    </div>
  )
}

/** Tap to swap between gun and sword. Shows the weapon currently held —
 * the FIRE button below it always attacks with whatever this shows. */
function WeaponSwapButton() {
  const weapon = useGameStore((s) => s.weapon)
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault()
        useGameStore.getState().toggleWeapon()
      }}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={`Holding ${weapon} — tap to swap`}
      className="pointer-events-auto h-13 w-13 touch-none select-none rounded-full border border-white/40 bg-white/16 text-2xl leading-none backdrop-blur-md [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] [box-shadow:0_2px_10px_rgba(0,0,0,0.25)]"
    >
      {weapon === 'gun' ? '🔫' : '🗡️'}
    </button>
  )
}

function ActionButton({
  label,
  size,
  accent,
  onDown,
  onUp,
  onDrag,
}: {
  label: string
  size: number
  accent?: boolean
  onDown: () => void
  onUp: () => void
  /** Pointer movement (CSS px) while the button is held — pointer
   * capture keeps the drag alive well outside the button's bounds. */
  onDrag?: (dx: number, dy: number) => void
}) {
  const last = useRef<{ x: number; y: number } | null>(null)
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault()
        // Capture so a thumb sliding off the button still delivers the
        // pointerup here instead of stranding the input "held".
        e.currentTarget.setPointerCapture(e.pointerId)
        last.current = { x: e.clientX, y: e.clientY }
        // First tap might land here before the canvas ever sees a touch —
        // mirror the canvas handler so the button works immediately.
        const store = useGameStore.getState()
        if (!store.started) store.setStarted(true)
        else if (store.paused) store.setPaused(false)
        onDown()
      }}
      onPointerMove={(e) => {
        if (!onDrag || !last.current) return
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
        onDrag(e.clientX - last.current.x, e.clientY - last.current.y)
        last.current = { x: e.clientX, y: e.clientY }
      }}
      onPointerUp={(e) => {
        e.preventDefault()
        last.current = null
        onUp()
      }}
      onPointerCancel={() => {
        last.current = null
        onUp()
      }}
      onLostPointerCapture={() => {
        last.current = null
        onUp()
      }}
      onContextMenu={(e) => e.preventDefault()}
      style={{ width: size, height: size }}
      className={`pointer-events-auto touch-none select-none rounded-full font-extrabold tracking-[0.06em] text-white backdrop-blur-md [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] ${
        accent
          ? 'border-2 border-white/60 bg-[#e23a3a]/62 text-[15px] [box-shadow:0_0_18px_rgba(226,58,58,0.45),0_4px_14px_rgba(0,0,0,0.3)]'
          : 'border border-white/30 bg-white/[0.14] text-[13px] [box-shadow:0_2px_10px_rgba(0,0,0,0.25)]'
      }`}
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
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <span key={tick} className="ae-hit text-2xl font-black text-[#ffe08a]">
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
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it) => (
        <div
          key={it.id}
          className="ae-float absolute left-1/2 top-[44%] whitespace-nowrap text-xl font-extrabold [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]"
          style={{ color: it.color }}
        >
          {it.text}
        </div>
      ))}
    </div>
  )
}

function Crosshair() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2">
      <div className="absolute left-1.5 top-0 h-3.5 w-0.5 bg-white/80 [box-shadow:0_0_2px_rgba(0,0,0,0.7)]" />
      <div className="absolute left-0 top-1.5 h-0.5 w-3.5 bg-white/80 [box-shadow:0_0_2px_rgba(0,0,0,0.7)]" />
    </div>
  )
}

function KillFeed({ entries }: { entries: KillFeedEntry[] }) {
  return (
    // clear of the minimap column on the right edge
    <div className="hud-text pointer-events-none absolute right-26 top-23 flex flex-col gap-1 text-right text-[13px]">
      {entries.map((e) => (
        <div key={e.id} className="opacity-85">
          <span className={e.killer === 'You' ? 'text-[#a4e8a4]' : 'text-[#e8d68a]'}>
            {e.killer}
          </span>
          <span className="opacity-60"> → </span>
          <span className={e.victim === 'You' ? 'text-[#e8a4a4]' : 'text-[#e8d68a]'}>
            {e.victim}
          </span>
        </div>
      ))}
    </div>
  )
}

function RespawnOverlay({ reason }: { reason: string | null }) {
  return (
    <div className="hud-text pointer-events-none absolute inset-x-0 top-[38%] text-center opacity-90">
      <div className="mb-2 text-[22px] font-semibold">
        {deathReasonText(reason)}
      </div>
      <div className="text-2xl font-bold uppercase tracking-widest opacity-85">
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
    <div className="hud-text pointer-events-none absolute inset-0 flex items-center justify-center [background:radial-gradient(circle_at_center,rgba(0,0,0,0.25),rgba(0,0,0,0.6))]">
      <div className="max-w-105 px-6 text-center">{children}</div>
    </div>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3.5 text-[44px] font-bold leading-none tracking-[-0.01em]">
      {children}
    </div>
  )
}

function Subtitle({ children }: { children: React.ReactNode }) {
  return <div className="text-[15px] leading-normal opacity-90">{children}</div>
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
    case 'sword':
      return 'You got skewered'
    default:
      return 'You went down'
  }
}
