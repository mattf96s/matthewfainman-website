import { useGameKeybinds } from '../hooks/useGameKeybinds'

/** Sentinel component that mounts the global game keybinds hook. */
export function GameKeybinds() {
  useGameKeybinds()
  return null
}
