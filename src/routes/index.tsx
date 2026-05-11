import { createFileRoute } from '@tanstack/react-router'

import { ClientOnly } from '../components/ClientOnly'
import { GameKeybinds } from '../components/GameKeybinds'
import { Game } from '../game/Game'
import { HUD } from '../ui/HUD'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: '#111',
        zIndex: 100,
      }}
    >
      <ClientOnly>
        <Game />
        <HUD />
        <GameKeybinds />
      </ClientOnly>
    </div>
  )
}
