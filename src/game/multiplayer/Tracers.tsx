import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import {
  activeShots,
  pruneShots,
  TRACER_LIFETIME_MS,
} from '../../multiplayer/shots'

const MAX_TRACERS = 32
const VERTS_PER_TRACER = 2

/**
 * Renders short, decaying beam segments for every active shot. Reuses
 * a single LineSegments / BufferGeometry across the lifetime — we
 * write into a fixed-size attribute each frame and slice it via
 * `setDrawRange` to skip unused capacity.
 */
export function Tracers() {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const positions = new Float32Array(MAX_TRACERS * VERTS_PER_TRACER * 3)
    const colors = new Float32Array(MAX_TRACERS * VERTS_PER_TRACER * 3)
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    g.setDrawRange(0, 0)
    return g
  }, [])

  const linesRef = useRef<THREE.LineSegments>(null)

  useFrame(() => {
    const now = performance.now()
    pruneShots(now)

    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute
    const colAttr = geom.getAttribute('color') as THREE.BufferAttribute
    const pos = posAttr.array as Float32Array
    const col = colAttr.array as Float32Array

    const count = Math.min(activeShots.length, MAX_TRACERS)
    for (let i = 0; i < count; i++) {
      const s = activeShots[i]!
      const t = (now - s.startedAt) / TRACER_LIFETIME_MS
      const fade = Math.max(0, 1 - t)
      const off = i * 6
      pos[off + 0] = s.ox
      pos[off + 1] = s.oy
      pos[off + 2] = s.oz
      pos[off + 3] = s.hx
      pos[off + 4] = s.hy
      pos[off + 5] = s.hz
      // warm yellow-white tracer, fades to red
      col[off + 0] = 1 * fade
      col[off + 1] = 0.85 * fade
      col[off + 2] = 0.3 * fade
      col[off + 3] = 1 * fade
      col[off + 4] = 0.3 * fade
      col[off + 5] = 0.1 * fade
    }
    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
    geom.setDrawRange(0, count * VERTS_PER_TRACER)
  })

  return (
    <lineSegments ref={linesRef} geometry={geom} frustumCulled={false}>
      <lineBasicMaterial vertexColors transparent />
    </lineSegments>
  )
}
