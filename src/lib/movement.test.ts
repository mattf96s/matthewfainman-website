import { describe, expect, it } from 'vitest'

import { walkDirection } from './movement'

const out = { x: 0, z: 0 }

describe('walkDirection', () => {
  it('forward at yaw 0 walks into the scene (-Z)', () => {
    walkDirection(1, 0, 0, out)
    expect(out.x).toBeCloseTo(0)
    expect(out.z).toBeCloseTo(-1)
  })

  it('right at yaw 0 walks toward +X', () => {
    walkDirection(0, 1, 0, out)
    expect(out.x).toBeCloseTo(1)
    expect(out.z).toBeCloseTo(0)
  })

  it('clamps a full diagonal to the unit disc', () => {
    walkDirection(1, 1, 0, out)
    expect(Math.hypot(out.x, out.z)).toBeCloseTo(1)
  })

  it('leaves sub-unit input unscaled, so the analog stick walks slowly', () => {
    walkDirection(0.3, 0, 0, out)
    expect(Math.hypot(out.x, out.z)).toBeCloseTo(0.3)
  })

  it('rotates the walk direction by camera yaw', () => {
    walkDirection(1, 0, Math.PI / 2, out) // forward becomes -X
    expect(out.x).toBeCloseTo(-1)
    expect(out.z).toBeCloseTo(0)
  })
})
