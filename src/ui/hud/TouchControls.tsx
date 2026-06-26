import { useRef } from 'react'

import { cameraState } from '../../game/cameraState'
import {
  CAMERA_PITCH_MAX,
  CAMERA_PITCH_MIN,
  TOUCH_LOOK_SENSITIVITY,
} from '../../game/constants'
import { mobileInput } from '../../game/mobileInput'
import { useGameStore } from '../../state/useGameStore'

/**
 * Bottom-right thumb cluster on touch devices: JUMP + FIRE, with the
 * weapon-swap chip stacked above FIRE (the mobile-shooter convention:
 * weapon slot lives by the trigger thumb).
 * Fixed-positioned with safe-area insets, like the joystick — anchoring
 * inside the (100vh-tall) page container put it under Safari's toolbar.
 */
export function TouchControls() {
  return (
    <div className="pointer-events-none fixed bottom-[max(24px,env(safe-area-inset-bottom))] right-[max(20px,env(safe-area-inset-right))] z-20 flex items-end gap-3.5">
      <ActionButton
        label="JUMP"
        size={64}
        onDown={() => {
          mobileInput.jumpPressed = true
        }}
        onUp={() => {
          mobileInput.jumpPressed = false
        }}
      />
      <div className="flex flex-col items-center gap-3">
        <WeaponSwapButton />
        <ActionButton
          label="FIRE"
          size={96}
          accent
          onDown={() => {
            mobileInput.firePressed = true
          }}
          onUp={() => {
            mobileInput.firePressed = false
          }}
          // The CoD-mobile trick: the held FIRE thumb also steers the aim,
          // so move (left thumb) + aim + shoot (right thumb) works with
          // just two thumbs. Same sensitivity as the canvas look-drag.
          onDrag={(dx, dy) => {
            cameraState.yaw -= dx * TOUCH_LOOK_SENSITIVITY
            cameraState.pitch = Math.max(
              CAMERA_PITCH_MIN,
              Math.min(
                CAMERA_PITCH_MAX,
                cameraState.pitch + dy * TOUCH_LOOK_SENSITIVITY,
              ),
            )
          }}
        />
      </div>
    </div>
  )
}

/** Tap to swap between gun and sword. Shows the weapon currently held —
 * the FIRE button below it always attacks with whatever this shows. */
function WeaponSwapButton() {
  const weapon = useGameStore((s) => s.weapon)
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault()
        useGameStore.getState().toggleWeapon()
      }}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={`Holding ${weapon} — tap to swap`}
      className="pointer-events-auto h-13 w-13 touch-none select-none rounded-full border border-white/40 bg-white/16 text-2xl leading-none backdrop-blur-md [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] [box-shadow:0_2px_10px_rgba(0,0,0,0.25)]"
    >
      {weapon === 'gun' ? '🔫' : '🗡️'}
    </button>
  )
}

interface ActionButtonProps {
  label: string
  size: number
  accent?: boolean
  onDown: () => void
  onUp: () => void
  /** Pointer movement (CSS px) while the button is held — pointer
   * capture keeps the drag alive well outside the button's bounds. */
  onDrag?: (dx: number, dy: number) => void
}

function ActionButton({
  label,
  size,
  accent,
  onDown,
  onUp,
  onDrag,
}: ActionButtonProps) {
  const last = useRef<{ x: number; y: number } | null>(null)
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault()
        // Capture so a thumb sliding off the button still delivers the
        // pointerup here instead of stranding the input "held".
        e.currentTarget.setPointerCapture(e.pointerId)
        last.current = { x: e.clientX, y: e.clientY }
        // First tap might land here before the canvas ever sees a touch —
        // mirror the canvas handler so the button works immediately.
        const store = useGameStore.getState()
        if (!store.started) store.setStarted(true)
        else if (store.paused) store.setPaused(false)
        onDown()
      }}
      onPointerMove={(e) => {
        if (!onDrag || !last.current) return
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
        onDrag(e.clientX - last.current.x, e.clientY - last.current.y)
        last.current = { x: e.clientX, y: e.clientY }
      }}
      onPointerUp={(e) => {
        e.preventDefault()
        last.current = null
        onUp()
      }}
      onPointerCancel={() => {
        last.current = null
        onUp()
      }}
      onLostPointerCapture={() => {
        last.current = null
        onUp()
      }}
      onContextMenu={(e) => e.preventDefault()}
      style={{ width: size, height: size }}
      className={`pointer-events-auto touch-none select-none rounded-full font-extrabold tracking-[0.06em] text-white backdrop-blur-md [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] ${
        accent
          ? 'border-2 border-white/60 bg-[#e23a3a]/62 text-[15px] [box-shadow:0_0_18px_rgba(226,58,58,0.45),0_4px_14px_rgba(0,0,0,0.3)]'
          : 'border border-white/30 bg-white/[0.14] text-[13px] [box-shadow:0_2px_10px_rgba(0,0,0,0.25)]'
      }`}
    >
      {label}
    </button>
  )
}
