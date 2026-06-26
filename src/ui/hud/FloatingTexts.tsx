import { useEffect, useState } from 'react'

import { onFloat, type FloatTextEvent } from '../floatText'

/** Transient combat/heal text that rises and fades near screen centre. */
export function FloatingTexts() {
  const [items, setItems] = useState<FloatTextEvent[]>([])

  useEffect(() => {
    return onFloat((e) => {
      setItems((prev) => [...prev, e])
      window.setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== e.id))
      }, 1100)
    })
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it) => (
        <div
          key={it.id}
          className="ae-float absolute left-1/2 top-[44%] whitespace-nowrap text-xl font-extrabold [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]"
          style={{ color: it.color }}
        >
          {it.text}
        </div>
      ))}
    </div>
  )
}
