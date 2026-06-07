import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import {
  activeShots,
  pruneShots,
  TRACER_LIFETIME_MS,
} from '../../multiplayer/shots'

const POOL = 16
const UP = new THREE.Vector3(0, 1, 0)
const A = new THREE.Vector3()
const B = new THREE.Vector3()
const DIR = new THREE.Vector3()
const Q = new THREE.Quaternion()

/** A soft radial glow texture so the muzzle flash reads as a round burst,
 * not a hard white square (a Sprite with no map renders as a quad). */
function makeGlowTexture(): THREE.Texture | null {
  if (typeof document === 'undefined') return null
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const g = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2,
  )
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,236,180,0.85)')
  g.addColorStop(1, 'rgba(255,210,130,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

/**
 * Visible shot feedback: a glowing beam (a real cylinder, so it has
 * thickness — unlike a 1px GL line) plus a soft muzzle flash at the
 * origin, for every active shot. Reuses a fixed pool of meshes/sprites and
 * drives them imperatively each frame so firing never re-renders React.
 */
export function Tracers() {
  const pool = useMemo(() => {
    // base→tip along +Y, unit length, so we can scale Y to the beam length
    const beamGeo = new THREE.CylinderGeometry(0.06, 0.06, 1, 6, 1, true)
    beamGeo.translate(0, 0.5, 0)
    const glow = makeGlowTexture()

    const items = Array.from({ length: POOL }, () => {
      const beamMat = new THREE.MeshBasicMaterial({
        color: '#ffe9a8',
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
      const beam = new THREE.Mesh(beamGeo, beamMat)
      beam.frustumCulled = false
      beam.visible = false
      beam.renderOrder = 998

      const flashMat = new THREE.SpriteMaterial({
        map: glow ?? undefined,
        color: '#ffffff',
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false, // always pops — never hidden behind the player body
        blending: THREE.AdditiveBlending,
      })
      const flash = new THREE.Sprite(flashMat)
      flash.frustumCulled = false
      flash.visible = false
      flash.renderOrder = 999

      return { beam, beamMat, flash, flashMat }
    })

    return { beamGeo, glow, items }
  }, [])

  useEffect(
    () => () => {
      pool.beamGeo.dispose()
      pool.glow?.dispose()
      pool.items.forEach((p) => {
        p.beamMat.dispose()
        p.flashMat.dispose()
      })
    },
    [pool],
  )

  useFrame(() => {
    const now = performance.now()
    pruneShots(now)

    const count = Math.min(activeShots.length, POOL)
    for (let i = 0; i < POOL; i++) {
      const p = pool.items[i]!
      if (i >= count) {
        p.beam.visible = false
        p.flash.visible = false
        continue
      }

      const s = activeShots[i]!
      const age = (now - s.startedAt) / TRACER_LIFETIME_MS
      const fade = Math.max(0, 1 - age)

      A.set(s.ox, s.oy, s.oz)
      B.set(s.hx, s.hy, s.hz)
      DIR.subVectors(B, A)
      const len = DIR.length() || 0.001
      DIR.normalize()
      Q.setFromUnitVectors(UP, DIR)

      // beam
      const radius = 0.6 + fade * 0.5 // thins slightly as it fades
      p.beam.visible = true
      p.beam.position.copy(A)
      p.beam.quaternion.copy(Q)
      p.beam.scale.set(radius, len, radius)
      p.beamMat.opacity = 0.85 * fade

      // muzzle flash — bright, brief, soft round pop at the origin
      const flashFade = Math.max(0, 1 - age * 2.6)
      if (flashFade > 0) {
        const sc = 0.5 + 1.1 * flashFade
        p.flash.visible = true
        p.flash.position.copy(A)
        p.flash.scale.set(sc, sc, 1)
        p.flashMat.opacity = flashFade
      } else {
        p.flash.visible = false
      }
    }
  })

  return (
    <group>
      {pool.items.map((p, i) => (
        <group key={i}>
          <primitive object={p.beam} />
          <primitive object={p.flash} />
        </group>
      ))}
    </group>
  )
}
