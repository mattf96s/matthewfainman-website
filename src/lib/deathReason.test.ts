import { describe, expect, it } from 'vitest'

import { deathReasonText } from './deathReason'

describe('deathReasonText', () => {
  it('maps known causes to specific flavour text', () => {
    expect(deathReasonText('tram')).toMatch(/tram/i)
    expect(deathReasonText('water')).toMatch(/gracht/i)
    expect(deathReasonText('sword')).toMatch(/skewered/i)
  })

  it('falls back to a generic line for unknown or null causes', () => {
    expect(deathReasonText(null)).toBe('You went down')
    expect(deathReasonText('meteor')).toBe('You went down')
  })
})
