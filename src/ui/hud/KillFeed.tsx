import { type KillFeedEntry } from '../../state/useGameStore'

interface KillFeedProps {
  entries: KillFeedEntry[]
}

export function KillFeed({ entries }: KillFeedProps) {
  return (
    // clear of the minimap column on the right edge
    <div className="hud-text pointer-events-none absolute right-26 top-23 flex flex-col gap-1 text-right text-[13px]">
      {entries.map((e) => (
        <div key={e.id} className="opacity-85">
          <span className={e.killer === 'You' ? 'text-[#a4e8a4]' : 'text-[#e8d68a]'}>
            {e.killer}
          </span>
          <span className="opacity-60"> → </span>
          <span className={e.victim === 'You' ? 'text-[#e8a4a4]' : 'text-[#e8d68a]'}>
            {e.victim}
          </span>
        </div>
      ))}
    </div>
  )
}
