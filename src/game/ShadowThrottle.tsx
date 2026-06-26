import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

/**
 * Caps how often the directional shadow map is re-rendered.
 *
 * By default THREE re-rasterises the whole shadow pass (a depth render of
 * every caster) on *every* frame — but the sun never moves and almost all
 * casters (houses, bridges, parked cars, trees, bollards) are static, so
 * 60 Hz of shadow rendering is wasted heat. Only a handful of things move
 * (cars, bikes, the tram, the player), and their low-poly shadows don't
 * need 60 Hz to look right.
 *
 * So we turn off auto-update and request a refresh on a timer instead.
 * With `autoUpdate = false` the renderer skips the entire shadow pass —
 * its draw calls and its fill — on any frame where `needsUpdate` is false,
 * then resets the flag after a render. Time-based (not every-Nth-frame) so
 * the rate is identical on a 60 Hz or 144 Hz display: the shadow work is
 * capped at SHADOW_FPS regardless of how fast the scene renders.
 *
 * Pairs with the 512² map (Game.tsx): smaller map × fewer updates.
 */
const SHADOW_FPS = 30
const SHADOW_INTERVAL = 1 / SHADOW_FPS

export function ShadowThrottle() {
  const gl = useThree((s) => s.gl)
  const since = useRef(0)

  useEffect(() => {
    // Touch builds disable shadows entirely; this is then a harmless no-op.
    gl.shadowMap.autoUpdate = false
    gl.shadowMap.needsUpdate = true // render the first shadow frame
    return () => {
      gl.shadowMap.autoUpdate = true
    }
  }, [gl])

  useFrame((_, delta) => {
    since.current += delta
    if (since.current >= SHADOW_INTERVAL) {
      since.current = 0
      gl.shadowMap.needsUpdate = true
    }
  })

  return null
}
