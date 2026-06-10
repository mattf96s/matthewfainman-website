import { describe, expect, it } from 'vitest'

import { NAME_MAX_LENGTH, sanitizePlayerName } from './playerName'

describe('sanitizePlayerName', () => {
  it('collapses internal whitespace runs to single spaces', () => {
    expect(sanitizePlayerName('jan   de\t\nvries')).toBe('jan de vries')
  })

  it('trims leading and trailing whitespace', () => {
    expect(sanitizePlayerName('  matt  ')).toBe('matt')
  })

  it('clamps to the max length', () => {
    const long = 'a'.repeat(NAME_MAX_LENGTH + 10)
    expect(sanitizePlayerName(long)).toHaveLength(NAME_MAX_LENGTH)
  })

  it('returns empty string for whitespace-only input', () => {
    expect(sanitizePlayerName(' \t\n ')).toBe('')
  })
})
