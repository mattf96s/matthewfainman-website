import { useGameStore } from '../state/useGameStore'

export function HUD() {
  const fps = useGameStore((s) => s.fps)
  const locked = useGameStore((s) => s.locked)

  return (
    <>
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

      {!locked && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.35)',
            color: 'white',
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
            pointerEvents: 'none',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 360 }}>
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: '0.02em',
                marginBottom: 12,
              }}
            >
              Click to play
            </div>
            <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5 }}>
              WASD to walk, mouse to look, space to jump.
              <br />
              Press <kbd>Esc</kbd> to release the cursor.
            </div>
          </div>
        </div>
      )}
    </>
  )
}
