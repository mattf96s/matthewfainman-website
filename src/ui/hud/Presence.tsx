import { useGameStore } from '../../state/useGameStore'

interface PresenceProps {
  touch?: boolean
}

export function Presence({ touch }: PresenceProps) {
  const joined = useGameStore((s) => s.multiplayerJoined)
  const peers = useGameStore((s) => s.peers)
  const kills = useGameStore((s) => s.kills)
  const deaths = useGameStore((s) => s.deaths)

  if (!joined) return null
  const others = peers.length
  // Solo on a phone, the "1 online" pill is just clutter in the crowded
  // top band — only surface presence once there's actually someone else.
  if (touch && others === 0) return null

  return (
    <div className="absolute left-1/2 top-3 flex -translate-x-1/2 flex-col items-center gap-1.5">
      <div className="hud-panel hud-text pointer-events-none flex items-center gap-1.75 text-xs">
        <span
          className={`h-2 w-2 rounded-full ${
            others > 0
              ? 'animate-[ae-pulse_2s_ease-in-out_infinite] bg-[#7bd88f]'
              : 'bg-[#9fb0b0]'
          }`}
        />
        {others + 1} online
      </div>
      {others > 0 && (
        <div className="hud-panel hud-text pointer-events-none text-[13px] tracking-[0.06em]">
          <span className="text-[#a4e8a4]">{kills} K</span>
          <span className="mx-1.5 opacity-40">/</span>
          <span className="text-[#e8a4a4]">{deaths} D</span>
        </div>
      )}
    </div>
  )
}
