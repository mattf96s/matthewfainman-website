import { useGameStore } from '../state/useGameStore'

export function HUD() {
  const fps = useGameStore((s) => s.fps)
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        color: 'white',
        fontFamily: 'monospace',
        fontSize: 14,
        textShadow: '0 1px 2px rgba(0,0,0,0.6)',
        pointerEvents: 'none',
      }}
    >
      {fps.toFixed(0)} fps
    </div>
  )
}
