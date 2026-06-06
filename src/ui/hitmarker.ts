/**
 * Tiny pub/sub for hitmarkers — the flash of an ✕ at the crosshair when
 * your shot lands on someone. The Gun emits; the HUD's <Hitmarker> shows.
 * Kept out of Zustand because it's a transient visual cue, not state.
 */
type Listener = () => void

const listeners = new Set<Listener>()

export function emitHit(): void {
  listeners.forEach((l) => l())
}

export function onHit(cb: Listener): () => void {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}
