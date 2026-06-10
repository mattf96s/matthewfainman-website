/**
 * Shared avatar palette. Each player's colour derives from their
 * Playroom id, so every client computes the same colour for the same
 * player without syncing anything — and your own avatar matches what
 * everyone else sees. Collisions are possible past 8 players; for a
 * meme toy that's fine.
 */
export const PLAYER_COLORS = [
  '#e07a5f', // terracotta — also the solo/pre-join default
  '#5b8dd9', // cornflower
  '#66b96a', // green
  '#e0b341', // amber
  '#9b7ede', // violet
  '#e26a9a', // pink
  '#45bdc4', // teal
  '#a3b138', // olive
] as const

/** Body colour before multiplayer connects (and in solo play). */
export const DEFAULT_PLAYER_COLOR: string = PLAYER_COLORS[0]

/** Deterministic palette pick — djb2 hash of the player id. */
export function colorForId(id: string): string {
  let h = 5381
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) + h + id.charCodeAt(i)) | 0
  }
  return PLAYER_COLORS[Math.abs(h) % PLAYER_COLORS.length]!
}
