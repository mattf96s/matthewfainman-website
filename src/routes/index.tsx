import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { ClientOnly } from '../components/ClientOnly'
import { GameKeybinds } from '../components/GameKeybinds'
import { Game } from '../game/Game'
import { seo } from '../lib/seo'
import { HUD } from '../ui/HUD'

// Lazy — playroomkit is ~1.5 MB. Code-splitting it keeps the initial
// bundle light so the scene paints fast; multiplayer connects a beat
// later in its own chunk.
const PlayroomProvider = lazy(() =>
  import('../multiplayer/PlayroomProvider').then((m) => ({
    default: m.PlayroomProvider,
  })),
)

export const Route = createFileRoute('/')({
  component: App,
  head: () => seo({ path: '/' }),
})

function App() {
  return (
    <div
      style={{
        // Sized by inset alone (no 100vh): on mobile Safari 100vh is the
        // *large* viewport and pushes bottom-anchored HUD under the
        // browser toolbar. inset: 0 tracks the visible layout viewport.
        position: 'fixed',
        inset: 0,
        background: '#111',
        zIndex: 100,
      }}
    >
      <ClientOnly>
        <Game />
        <HUD />
        <GameKeybinds />
        <Suspense fallback={null}>
          <PlayroomProvider />
        </Suspense>
      </ClientOnly>
    </div>
  )
}
