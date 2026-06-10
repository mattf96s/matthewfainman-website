import { useEffect, useRef } from 'react'

import { mobileInput } from '../game/mobileInput'

const PAD_DIAMETER = 130
const KNOB_DIAMETER = 60
const MAX_RADIUS = (PAD_DIAMETER - KNOB_DIAMETER) / 2

/**
 * Bottom-left thumb stick for touch devices. Touch and drag inside (or
 * out from) the pad to set an analog forward/right axis pair. Writes
 * to `mobileInput.joystick*`; the player controller sums these with
 * the keyboard inputs.
 */
export function VirtualJoystick() {
  const pad = useRef<HTMLDivElement>(null)
  const knob = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const padEl = pad.current
    const knobEl = knob.current
    if (!padEl || !knobEl) return

    let activeId: number | null = null

    const setKnob = (x: number, y: number) => {
      knobEl.style.transform = `translate(${x}px, ${y}px)`
      mobileInput.joystickRight = x / MAX_RADIUS
      mobileInput.joystickForward = -y / MAX_RADIUS
    }

    const resetKnob = () => {
      knobEl.style.transform = ''
      mobileInput.joystickRight = 0
      mobileInput.joystickForward = 0
    }

    const updateFrom = (t: Touch) => {
      const rect = padEl.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = t.clientX - cx
      const dy = t.clientY - cy
      const dist = Math.hypot(dx, dy)
      const scale = dist > MAX_RADIUS ? MAX_RADIUS / dist : 1
      setKnob(dx * scale, dy * scale)
    }

    const onStart = (e: TouchEvent) => {
      if (activeId !== null) return
      const t = e.changedTouches[0]
      if (!t) return
      activeId = t.identifier
      updateFrom(t)
    }

    const onMove = (e: TouchEvent) => {
      if (activeId === null) return
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]!
        if (t.identifier === activeId) {
          updateFrom(t)
          break
        }
      }
    }

    const onEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i]!.identifier === activeId) {
          activeId = null
          resetKnob()
          break
        }
      }
    }

    padEl.addEventListener('touchstart', onStart, { passive: true })
    padEl.addEventListener('touchmove', onMove, { passive: true })
    padEl.addEventListener('touchend', onEnd, { passive: true })
    padEl.addEventListener('touchcancel', onEnd, { passive: true })

    return () => {
      padEl.removeEventListener('touchstart', onStart)
      padEl.removeEventListener('touchmove', onMove)
      padEl.removeEventListener('touchend', onEnd)
      padEl.removeEventListener('touchcancel', onEnd)
      resetKnob()
    }
  }, [])

  return (
    <div
      ref={pad}
      style={{
        position: 'fixed',
        bottom: 'max(28px, env(safe-area-inset-bottom))',
        left: 'max(28px, env(safe-area-inset-left))',
        width: PAD_DIAMETER,
        height: PAD_DIAMETER,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.16)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        touchAction: 'none',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div
        ref={knob}
        style={{
          width: KNOB_DIAMETER,
          height: KNOB_DIAMETER,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.6)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
