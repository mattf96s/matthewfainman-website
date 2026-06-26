import { useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

import * as sfx from '../../lib/sfx'

interface MuteButtonProps {
  compact?: boolean
}

export function MuteButton({ compact }: MuteButtonProps) {
  const [muted, setMuted] = useState(false)
  useEffect(() => {
    setMuted(sfx.isMuted())
  }, [])

  return (
    <button
      onClick={() => setMuted(sfx.toggleMuted())}
      title={muted ? 'Unmute' : 'Mute'}
      aria-label={muted ? 'Unmute' : 'Mute'}
      // desktop sits right of the FPS readout; mobile has no FPS, so it
      // takes the corner and the name chip sits next to it
      className={`hud-panel pointer-events-auto absolute top-2 inline-flex cursor-pointer items-center justify-center p-1.5 text-white ${
        compact ? 'left-3' : 'left-15.5'
      }`}
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  )
}
