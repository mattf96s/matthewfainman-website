import { useEffect, useState } from 'react'

/** Brief touch controls hint that auto-dismisses after a few seconds. */
export function TouchHint() {
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setGone(true), 6000)
    return () => window.clearTimeout(t)
  }, [])

  if (gone) return null
  return (
    // clear of the bottom thumb buttons; wraps instead of running off the
    // screen edge like the old single nowrap line did
    <div className="hud-text pointer-events-none absolute bottom-[32%] left-1/2 w-[min(76vw,260px)] -translate-x-1/2">
      <div className="hud-panel text-center text-[13px] leading-normal">
        Left stick to move · drag to look · hold{' '}
        <b className="text-[#ffb4a0]">FIRE</b> to shoot
      </div>
    </div>
  )
}
