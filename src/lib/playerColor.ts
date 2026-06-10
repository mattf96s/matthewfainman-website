/**
 * Avatar colours. On your own screen you are always the terracotta
 * "hotdog" — that's the player identity. Every OTHER player gets a
 * colour hashed from their Playroom id out of a palette that
 * deliberately excludes terracotta, so nobody on screen ever looks
 * like you. Remote colours are deterministic from the id, so any two
 * observers still see the same player in the same colour.
 */
export const LOCAL_PLAYER_COLOR = '#e07a5f' // the hotdog

/** Remote-player palette — terracotta excluded on purpose. */
export const PEER_COLORS = [
  '#5b8dd9', // cornflower
  '#66b96a', // green
  '#e0b341', // amber
  '#9b7ede', // violet
  '#e26a9a', // pink
  '#45bdc4', // teal
  '#a3b138', // olive
] as const

/** Deterministic palette pick — djb2 hash of the player id. */
export function colorForId(id: string): string {
  let h = 5381
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) + h + id.charCodeAt(i)) | 0
  }
  return PEER_COLORS[Math.abs(h) % PEER_COLORS.length]!
}
