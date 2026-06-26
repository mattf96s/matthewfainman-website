import { useEffect, useRef, useState } from 'react'

import { MAX_HEALTH, useGameStore } from '../../state/useGameStore'

interface HealthBarProps {
  compact?: boolean
}

function healthColor(pct: number): string {
  if (pct > 0.5) return '#7bd88f'
  if (pct > 0.25) return '#e8c45a'
  return '#e87a7a'
}

export function HealthBar({ compact }: HealthBarProps) {
  const health = useGameStore((s) => s.health)
  const pct = Math.max(0, Math.min(1, health / MAX_HEALTH))
  const color = healthColor(pct)
  const [flashKey, setFlashKey] = useState(0)
  const prev = useRef(health)

  useEffect(() => {
    // flash on damage only — regen ticks every fraction of a second and
    // a constantly-pulsing bar would read as taking damage
    if (health < prev.current) {
      setFlashKey((k) => k + 1)
    }
    prev.current = health
  }, [health])

  // On a phone the bottom-left is the joystick's thumb zone, so health
  // lives top-left (under the mute/name row) and shrinks. Desktop keeps
  // it in the bottom-left corner where there's nothing to collide with.
  return (
    <div
      className={`hud-panel pointer-events-none absolute flex items-center ${
        compact
          ? 'left-3 top-11 gap-1.75 px-2.25 py-1.25'
          : 'bottom-4 left-4 gap-2.5 px-3 py-2'
      }`}
    >
      <span
        className={`leading-none ${compact ? 'text-sm' : 'text-lg'}`}
        style={{ color }}
      >
        ♥
      </span>
      <div
        className={`overflow-hidden rounded-full bg-white/16 ${
          compact ? 'h-2 w-27' : 'h-3 w-40'
        }`}
      >
        <div
          key={flashKey}
          className="ae-flash h-full rounded-full duration-220 [transition-property:width,background]"
          style={{ width: `${pct * 100}%`, background: color }}
        />
      </div>
      <span
        className={`hud-text text-right font-bold ${
          compact ? 'min-w-6 text-xs' : 'min-w-7.5 text-[13px]'
        }`}
      >
        {Math.max(0, Math.ceil(health))}
      </span>
    </div>
  )
}
