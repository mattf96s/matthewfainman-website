import { describe, expect, it } from 'vitest'

import { rayCapsuleT, raySphereT } from './raycast'

const ORIGIN = { x: 0, y: 1, z: 0 }
const FORWARD = { x: 0, y: 0, z: -1 } // straight down -Z

describe('raySphereT', () => {
  it('hits a sphere dead ahead at the near surface', () => {
    const t = raySphereT(ORIGIN, FORWARD, { x: 0, y: 1, z: -10 }, 0.5)
    expect(t).toBeCloseTo(9.5, 5)
  })

  it('misses a sphere offset beyond its radius', () => {
    const t = raySphereT(ORIGIN, FORWARD, { x: 1, y: 1, z: -10 }, 0.5)
    expect(t).toBeNull()
  })

  it('ignores spheres behind the ray origin', () => {
    const t = raySphereT(ORIGIN, FORWARD, { x: 0, y: 1, z: 10 }, 0.5)
    expect(t).toBeNull()
  })

  it('returns the exit t when the origin is inside the sphere', () => {
    const t = raySphereT(ORIGIN, FORWARD, { x: 0, y: 1, z: -0.2 }, 1)
    expect(t).not.toBeNull()
    expect(t!).toBeGreaterThan(0)
  })
})

describe('rayCapsuleT', () => {
  // capsule matching the player avatar: centre y=1, halfSeg=0.5, r=0.55
  const HALF = 0.5
  const R = 0.55

  it('hits the cylinder wall of a capsule dead ahead', () => {
    const t = rayCapsuleT(ORIGIN, FORWARD, 0, 1, -10, HALF, R)
    expect(t).toBeCloseTo(10 - R, 5)
  })

  it('misses when offset beyond the radius', () => {
    const t = rayCapsuleT(ORIGIN, FORWARD, 2, 1, -10, HALF, R)
    expect(t).toBeNull()
  })

  it('hits within the radius even when not dead-centre', () => {
    const t = rayCapsuleT(ORIGIN, FORWARD, 0.4, 1, -10, HALF, R)
    expect(t).not.toBeNull()
  })

  it('rejects cylinder-wall entries above the segment, then catches the cap', () => {
    // slope chosen so the ray crosses the cylinder wall above the
    // segment (y≈1.9 > 1.5) but still clips the top cap sphere
    const dir = norm({ x: 0, y: 0.095, z: -1 })
    const t = rayCapsuleT(ORIGIN, dir, 0, 1, -10, HALF, R)
    expect(t).not.toBeNull()
  })

  it('misses entirely above the head', () => {
    const dir = norm({ x: 0, y: 0.5, z: -1 })
    const t = rayCapsuleT(ORIGIN, dir, 0, 1, -10, HALF, R)
    expect(t).toBeNull()
  })

  it('handles near-vertical rays via the cap spheres', () => {
    const down = { x: 0, y: -1, z: 0 }
    const t = rayCapsuleT({ x: 0, y: 10, z: 0 }, down, 0, 1, 0, HALF, R)
    expect(t).not.toBeNull()
    // first contact is the top cap: y = 1 + 0.5 + 0.55 = 2.05 → t = 7.95
    expect(t!).toBeCloseTo(10 - (1 + HALF + R), 5)
  })

  it('ignores capsules behind the ray', () => {
    const t = rayCapsuleT(ORIGIN, FORWARD, 0, 1, 10, HALF, R)
    expect(t).toBeNull()
  })
})

function norm(v: { x: number; y: number; z: number }) {
  const l = Math.hypot(v.x, v.y, v.z)
  return { x: v.x / l, y: v.y / l, z: v.z / l }
}
