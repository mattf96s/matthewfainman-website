import { useEffect, useState } from 'react'

import { onHit } from '../hitmarker'

/** Brief ✕ flash at screen centre when one of your shots connects. */
export function Hitmarker() {
  const [tick, setTick] = useState(0)
  const [show, setShow] = useState(false)
  useEffect(() => {
    return onHit(() => {
      setTick((t) => t + 1)
      setShow(true)
      window.setTimeout(() => setShow(false), 200)
    })
  }, [])
  if (!show) return null
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <span key={tick} className="ae-hit text-2xl font-black text-[#ffe08a]">
        ✕
      </span>
    </div>
  )
}
