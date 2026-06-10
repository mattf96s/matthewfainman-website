import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Pencil } from 'lucide-react'

import { NAME_MAX_LENGTH } from '../lib/playerName'
import { useGameStore } from '../state/useGameStore'

interface NameEditorProps {
  /** Render as a small tap-to-edit chip (touch HUD) instead of an
   * always-open input (desktop start overlay). */
  compact?: boolean
}

const inputStyle: CSSProperties = {
  pointerEvents: 'auto',
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.35)',
  borderRadius: 8,
  padding: '4px 10px',
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: 'inherit',
  outline: 'none',
  textAlign: 'center',
}

/**
 * Edits the player's display name, persisted via the store to
 * localStorage and pushed to the multiplayer room. The empty value is
 * valid — others then see the Playroom-generated name.
 */
export function NameEditor({ compact }: NameEditorProps) {
  const playerName = useGameStore((s) => s.playerName)
  const setPlayerName = useGameStore((s) => s.setPlayerName)
  const [editing, setEditing] = useState(false)

  if (compact && !editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        aria-label="Edit player name"
        style={{
          pointerEvents: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(15,20,24,0.5)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8,
          padding: '5px 9px',
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
          backdropFilter: 'blur(6px)',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <Pencil size={11} style={{ opacity: 0.7 }} />
        {playerName || 'set name'}
      </button>
    )
  }

  return (
    <input
      // remount on external change so defaultValue stays honest
      key={playerName}
      defaultValue={playerName}
      placeholder="your name"
      maxLength={NAME_MAX_LENGTH}
      autoFocus={compact}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      enterKeyHint="done"
      onKeyDown={(e) => {
        // keep WASD/Space/Enter/Esc from reaching the game while typing
        // (movement + pause keybinds listen on window). keyup still
        // propagates so a key held before focusing doesn't stick.
        e.stopPropagation()
        if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur()
      }}
      onBlur={(e) => {
        setPlayerName(e.currentTarget.value)
        setEditing(false)
      }}
      style={{ ...inputStyle, width: compact ? 120 : 150 }}
    />
  )
}
