import { useGameStore } from '../../state/useGameStore'

interface ScoreboardProps {
  compact?: boolean
}

export function Scoreboard({ compact }: ScoreboardProps) {
  const score = useGameStore((s) => s.score)
  const nearMiss = useGameStore((s) => s.nearMissCount)

  return (
    <div
      className={`hud-panel pointer-events-none absolute right-3 top-3 text-right ${
        compact ? 'px-2.5 py-1.25' : 'px-3 py-2'
      }`}
    >
      <div
        className={`hud-text uppercase tracking-[0.14em] opacity-70 ${
          compact ? 'text-[9px]' : 'text-[11px]'
        }`}
      >
        Score
      </div>
      <div
        className={`hud-text font-extrabold leading-[1.05] ${
          compact ? 'text-lg' : 'text-[26px]'
        }`}
      >
        {score}
      </div>
      {nearMiss > 0 && (
        <div
          className={`hud-text mt-0.5 opacity-80 ${
            compact ? 'text-[11px]' : 'text-xs'
          }`}
        >
          🚲 {nearMiss} dodged
        </div>
      )}
    </div>
  )
}
