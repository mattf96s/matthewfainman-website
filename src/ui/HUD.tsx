import { useEffect, useState } from 'react'

import { isTouchDevice } from '../game/mobileInput'
import { useGameStore } from '../state/useGameStore'
import { FeedbackSystem } from './FeedbackSystem'
import { Minimap } from './Minimap'
import { NameEditor } from './NameEditor'
import { VirtualJoystick } from './VirtualJoystick'
import { Credit } from './hud/Credit'
import { Crosshair } from './hud/Crosshair'
import { FloatingTexts } from './hud/FloatingTexts'
import { HealthBar } from './hud/HealthBar'
import { Hitmarker } from './hud/Hitmarker'
import { KillFeed } from './hud/KillFeed'
import { MuteButton } from './hud/MuteButton'
import { PauseOverlay } from './hud/PauseOverlay'
import { Presence } from './hud/Presence'
import { RespawnOverlay } from './hud/RespawnOverlay'
import { Scoreboard } from './hud/Scoreboard'
import { StartPrompt } from './hud/StartPrompt'
import { TouchControls } from './hud/TouchControls'
import { TouchHint } from './hud/TouchHint'

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

      {/* FPS is dev-facing noise — desktop only, never on a phone HUD.
        * Monospace + tabular figures so it reads as a data readout and the
        * width doesn't jitter as the number changes. */}
      {!touch && (
        <div className="hud-text pointer-events-none absolute left-3.5 top-3 font-mono text-[13px] tabular-nums opacity-60">
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
