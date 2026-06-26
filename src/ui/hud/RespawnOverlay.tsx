import { deathReasonText } from '../../lib/deathReason'

interface RespawnOverlayProps {
  reason: string | null
}

export function RespawnOverlay({ reason }: RespawnOverlayProps) {
  return (
    <div className="hud-text pointer-events-none absolute inset-x-0 top-[38%] text-center opacity-90">
      <div className="mb-2 text-[22px] font-semibold">
        {deathReasonText(reason)}
      </div>
      <div className="text-2xl font-bold uppercase tracking-widest opacity-85">
        Respawning…
      </div>
    </div>
  )
}
