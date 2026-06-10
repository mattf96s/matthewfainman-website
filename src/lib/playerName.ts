/**
 * Persistence for the player's chosen display name. localStorage-backed
 * so the name survives sessions; all access is SSR-safe and wrapped
 * against storage being unavailable (private mode, blocked cookies).
 */

const STORAGE_KEY = 'ae:player-name'

export const NAME_MAX_LENGTH = 16

/** Collapse whitespace and clamp to the nametag-friendly max length. */
export function sanitizePlayerName(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim().slice(0, NAME_MAX_LENGTH)
}

/** The saved name, or '' when unset (callers fall back to the
 * Playroom-generated profile name). */
export function loadPlayerName(): string {
  if (typeof window === 'undefined') return ''
  try {
    return sanitizePlayerName(window.localStorage.getItem(STORAGE_KEY) ?? '')
  } catch {
    return ''
  }
}

export function savePlayerName(name: string): void {
  if (typeof window === 'undefined') return
  try {
    const clean = sanitizePlayerName(name)
    if (clean) window.localStorage.setItem(STORAGE_KEY, clean)
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable — name just won't persist */
  }
}
