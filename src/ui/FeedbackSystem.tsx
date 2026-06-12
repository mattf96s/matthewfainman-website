import { useEffect } from 'react'

import { track } from '../lib/analytics'
import * as sfx from '../lib/sfx'
import { useGameStore } from '../state/useGameStore'
import { emitFloat } from './floatText'

/**
 * Central gameplay-feedback hub. Subscribes once to the game store and
 * turns meaningful state transitions into sound, floating combat text,
 * and product analytics. Keeping this in one place means each gameplay
 * system stays focused on mechanics — feedback is a cross-cutting concern
 * resolved here. Renders nothing.
 */
export function FeedbackSystem() {
  useEffect(() => {
    const loadedAt = performance.now()
    track('game_loaded')

    // First user gesture: unlock the audio context (browser autoplay
    // policy), start the street-ambience loop, and record activation
    // for the funnel. Once only.
    let activated = false
    const onFirstInput = () => {
      if (activated) return
      activated = true
      sfx.resume()
      sfx.startAmbience()
      track('first_interaction')
      window.removeEventListener('pointerdown', onFirstInput)
      window.removeEventListener('keydown', onFirstInput)
      window.removeEventListener('touchstart', onFirstInput)
    }
    window.addEventListener('pointerdown', onFirstInput)
    window.addEventListener('keydown', onFirstInput)
    window.addEventListener('touchstart', onFirstInput)

    const onLeave = () => {
      const s = useGameStore.getState()
      track('session_end', {
        durationMs: Math.round(performance.now() - loadedAt),
        score: s.score,
        kills: s.kills,
        deaths: s.deaths,
        nearMisses: s.nearMissCount,
      })
    }
    window.addEventListener('pagehide', onLeave)

    const unsub = useGameStore.subscribe((s, prev) => {
      // took damage but survived
      if (prev.health > 0 && s.health < prev.health && s.health > 0) {
        sfx.play('hurt')
        emitFloat(`-${prev.health - s.health}`, '#ff7a7a')
      }
      // died (health reached 0)
      if (prev.health > 0 && s.health <= 0) {
        sfx.play(s.deathReason === 'water' ? 'splash' : 'death')
        track('player_died', { reason: s.deathReason ?? 'unknown' })
      }
      // healed by a pickup — guard against the respawn 0→full jump.
      // Regen heals are deliberately silent: at a couple of points per
      // second they'd turn the pickup jingle into a metronome.
      if (
        prev.health > 0 &&
        s.health > prev.health &&
        s.lastHealSource === 'pickup'
      ) {
        sfx.play('pickup')
        emitFloat(`+${s.health - prev.health}`, '#9be38b')
        track('pickup_collected', { amount: s.health - prev.health })
      }
      // scored a kill
      if (s.kills > prev.kills) {
        sfx.play('kill')
        emitFloat('Eliminated!', '#ffd86b')
        track('player_killed')
      }
      // dodged a hazard
      if (s.nearMissCount > prev.nearMissCount) {
        sfx.play('nearMiss')
        emitFloat('Close call!', '#cfe8ff')
        track('near_miss')
      }
    })

    return () => {
      window.removeEventListener('pointerdown', onFirstInput)
      window.removeEventListener('keydown', onFirstInput)
      window.removeEventListener('touchstart', onFirstInput)
      window.removeEventListener('pagehide', onLeave)
      unsub()
    }
  }, [])

  return null
}
