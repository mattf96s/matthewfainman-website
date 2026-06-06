import posthog from 'posthog-js'

/**
 * Typed thin wrapper over PostHog capture. Keeps event names in one place
 * so the product funnel is legible and we never typo an event string.
 * Safe to call anywhere: no-ops on the server and swallows errors if
 * PostHog isn't configured (no VITE_POSTHOG_KEY in dev).
 */
export type GameEvent =
  | 'game_loaded'
  | 'first_interaction'
  | 'multiplayer_connected'
  | 'peer_joined'
  | 'peer_left'
  | 'player_killed'
  | 'player_died'
  | 'pickup_collected'
  | 'near_miss'
  | 'session_end'

export function track(event: GameEvent, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  try {
    posthog.capture(event, props)
  } catch {
    /* analytics must never break gameplay */
  }
}
