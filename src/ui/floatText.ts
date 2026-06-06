/**
 * Lightweight pub/sub for floating combat text ("+25", "-20", "Close
 * call!"). Gameplay code calls `emitFloat`; the HUD's <FloatingTexts>
 * subscribes and animates them. Kept out of Zustand so a burst of pickups
 * doesn't churn React state across the whole HUD.
 */
export interface FloatTextEvent {
  id: number
  text: string
  color: string
}

type Listener = (event: FloatTextEvent) => void

const listeners = new Set<Listener>()
let nextId = 1

export function emitFloat(text: string, color = '#ffffff'): void {
  const event: FloatTextEvent = { id: nextId++, text, color }
  listeners.forEach((l) => l(event))
}

export function onFloat(cb: Listener): () => void {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}
