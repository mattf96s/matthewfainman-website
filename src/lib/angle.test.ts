import { describe, expect, it } from 'vitest'

import { lerpAngle, wrapAngle } from './angle'

describe('wrapAngle', () => {
  it('leaves angles already in range untouched', () => {
    expect(wrapAngle(0)).toBe(0)
    expect(wrapAngle(1)).toBeCloseTo(1)
    expect(wrapAngle(-1)).toBeCloseTo(-1)
  })

  it('wraps past +π to the equivalent negative angle', () => {
    expect(wrapAngle(Math.PI * 1.5)).toBeCloseTo(-Math.PI / 2)
  })

  it('wraps past -π to the equivalent positive angle', () => {
    expect(wrapAngle(-Math.PI * 1.5)).toBeCloseTo(Math.PI / 2)
  })

  it('wraps through multiple full turns', () => {
    expect(wrapAngle(Math.PI * 4 + 0.3)).toBeCloseTo(0.3)
  })
})

describe('lerpAngle', () => {
  it('moves a fraction of the way toward the target', () => {
    expect(lerpAngle(0, 1, 0.5)).toBeCloseTo(0.5)
  })

  it('takes the short way around the +π/-π seam, not the long way', () => {
    const from = Math.PI - 0.1
    const to = -Math.PI + 0.1 // a 0.2-rad step across the seam, not ~2π
    const step = wrapAngle(lerpAngle(from, to, 0.5) - from)
    expect(Math.abs(step)).toBeLessThan(0.2)
  })

  it('alpha 0 stays put, alpha 1 lands on the target', () => {
    expect(lerpAngle(0.4, 1.2, 0)).toBeCloseTo(0.4)
    expect(lerpAngle(0.4, 1.2, 1)).toBeCloseTo(1.2)
  })
})
