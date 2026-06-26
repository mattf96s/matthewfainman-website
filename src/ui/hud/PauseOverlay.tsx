import { Kbd } from './Kbd'

interface OverlayProps {
  children: React.ReactNode
}

function Overlay({ children }: OverlayProps) {
  return (
    <div className="hud-text pointer-events-none absolute inset-0 flex items-center justify-center [background:radial-gradient(circle_at_center,rgba(0,0,0,0.25),rgba(0,0,0,0.6))]">
      <div className="max-w-105 px-6 text-center">{children}</div>
    </div>
  )
}

function Title({ children }: OverlayProps) {
  return (
    <div className="mb-3.5 text-[44px] font-bold leading-none tracking-[-0.01em]">
      {children}
    </div>
  )
}

function Subtitle({ children }: OverlayProps) {
  return <div className="text-[15px] leading-normal opacity-90">{children}</div>
}

export function PauseOverlay() {
  return (
    <Overlay>
      <Title>Paused</Title>
      <Subtitle>
        Press <Kbd>Enter</Kbd> or click to resume.
      </Subtitle>
    </Overlay>
  )
}
