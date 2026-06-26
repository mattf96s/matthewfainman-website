/** Centre-screen aiming reticle. Shown only when the gun can actually fire. */
export function Crosshair() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2">
      <div className="absolute left-1.5 top-0 h-3.5 w-0.5 bg-white/80 [box-shadow:0_0_2px_rgba(0,0,0,0.7)]" />
      <div className="absolute left-0 top-1.5 h-0.5 w-3.5 bg-white/80 [box-shadow:0_0_2px_rgba(0,0,0,0.7)]" />
    </div>
  )
}
