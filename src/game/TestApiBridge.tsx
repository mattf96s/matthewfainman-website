import { useEffect } from 'react'
import { useStore, useThree } from '@react-three/fiber'

import { colorForId } from '../lib/playerColor'
import {
  remoteRendered,
  remoteSnapshots,
} from '../multiplayer/playroomState'
import { useGameStore } from '../state/useGameStore'
import { cameraState } from './cameraState'
import { mobileInput } from './mobileInput'
import { playerPosition } from './playerPosition'

export interface TestApi {
  /** THREE renderer stats for the last rendered frame — deterministic,
   * which makes them ideal perf-budget metrics (fps on CI is noise). */
  rendererInfo: () => {
    drawCalls: number
    triangles: number
    geometries: number
    textures: number
    /** Monotonic render counter (`gl.info.render.frame`). Only advances
     * when a frame is actually rendered, so a flat count over time means
     * the loop is paused — used to assert the idle-tab CPU guard. */
    frame: number
    /** Live `useFrame` subscriber count. A deterministic proxy for
     * per-frame CPU work: every active callback runs once per rendered
     * frame, so a runaway here is a CPU regression even if draw calls
     * hold steady. */
    frameCallbacks: number
  }
  playerPosition: typeof playerPosition
  cameraState: typeof cameraState
  mobileInput: typeof mobileInput
  store: typeof useGameStore
  /** Inject a fake remote player (rendered + shootable) for E2E tests. */
  spawnPeer: (id: string, x: number, y: number, z: number) => void
  /** Refresh a fake peer's snapshot so it doesn't go stale mid-test. */
  tickPeer: (id: string, x: number, y: number, z: number) => void
  despawnPeer: (id: string) => void
}

/**
 * Exposes `window.__testApi` for Playwright (and manual debugging).
 * Mounted inside the Canvas so it can reach the renderer for draw-call
 * and memory stats. Only active in dev or when the page is loaded with
 * `?e2e` — production visitors never get it.
 */
export function TestApiBridge() {
  const gl = useThree((s) => s.gl)
  const store = useStore()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const enabled =
      import.meta.env.DEV ||
      new URLSearchParams(window.location.search).has('e2e')
    if (!enabled) return

    const api: TestApi = {
      rendererInfo: () => ({
        drawCalls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
        frame: gl.info.render.frame,
        frameCallbacks: store.getState().internal.subscribers.length,
      }),
      playerPosition,
      cameraState,
      mobileInput,
      store: useGameStore,
      spawnPeer: (id, x, y, z) => {
        useGameStore.getState().addPeer({ id, name: id, color: colorForId(id) })
        api.tickPeer(id, x, y, z)
      },
      tickPeer: (id, x, y, z) => {
        remoteSnapshots.set(id, {
          x,
          y,
          z,
          yaw: 0,
          hp: 100,
          dead: false,
          t: performance.now(),
          receivedAt: performance.now(),
        })
      },
      despawnPeer: (id) => {
        useGameStore.getState().removePeer(id)
        remoteSnapshots.delete(id)
        remoteRendered.delete(id)
      },
    }
    ;(window as Window & { __testApi?: TestApi }).__testApi = api
    return () => {
      delete (window as Window & { __testApi?: TestApi }).__testApi
    }
  }, [gl, store])

  return null
}
