import type { Page } from '@playwright/test'

/** Minimal mirror of the shape exposed by src/game/TestApiBridge.tsx —
 * kept local so the e2e folder doesn't pull src/ into its TS graph. */
export interface TestApiShape {
  rendererInfo: () => {
    drawCalls: number
    triangles: number
    geometries: number
    textures: number
  }
  playerPosition: { x: number; y: number; z: number; ready: boolean }
  cameraState: { yaw: number; pitch: number }
  mobileInput: { firePressed: boolean }
  spawnPeer: (id: string, x: number, y: number, z: number) => void
  despawnPeer: (id: string) => void
  store: {
    getState: () => {
      respawn: () => void
      health: number
      weapon: 'gun' | 'sword'
      setWeapon: (weapon: 'gun' | 'sword') => void
      takeDamage: (amount: number, reason: string) => void
    }
  }
}

declare global {
  interface Window {
    __testApi?: TestApiShape
  }
}

/** A unique Playroom room per test run, so tests never meet real
 * visitors in the public room — or each other. */
export function randomRoom(): string {
  return `e2e-${Math.random().toString(36).slice(2, 10)}`
}

export function gameUrl(room: string): string {
  return `/?e2e&room=${room}`
}

/** Wait until the canvas exists, the test API is mounted, and the
 * player controller has produced its first frame. */
export async function waitForGameReady(page: Page): Promise<void> {
  await page.waitForSelector('canvas', { timeout: 20_000 })
  await page.waitForFunction(
    () => window.__testApi?.playerPosition.ready === true,
    undefined,
    { timeout: 20_000 },
  )
}
