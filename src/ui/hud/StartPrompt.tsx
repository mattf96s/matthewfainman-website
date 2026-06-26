import { NameEditor } from '../NameEditor'
import { Kbd } from './Kbd'

/**
 * Desktop pre-lock call-to-action. Clicking the canvas grabs pointer lock
 * (the crosshair then appears, signalling you can fire), so this is the
 * lock affordance: the welcome title leads, the name entry is the clear
 * secondary action, and the controls recede to a single dim line of fine
 * print. Socials live bottom-right in the always-on Credit. The HUD only
 * mounts this while unlocked, so there's no in-play locked branch here.
 */
export function StartPrompt() {
  return (
    <div className="hud-text pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
      <div className="hud-panel flex flex-col items-center px-6.5 py-4.5">
        <h1 className="text-[28px] font-bold leading-none tracking-tight">
          Welcome to Amsterdam
        </h1>
        <p className="mt-2 text-base font-medium opacity-80">
          🖱 Click to aim &amp; shoot
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="opacity-80">playing as</span>
          <NameEditor />
        </div>

        <div className="mt-4 text-xs opacity-50">
          <Kbd>WASD</Kbd> move · mouse to look · <Kbd>Tab</Kbd> swap weapons ·{' '}
          <Kbd>Esc</Kbd> pause
        </div>
      </div>
    </div>
  )
}
