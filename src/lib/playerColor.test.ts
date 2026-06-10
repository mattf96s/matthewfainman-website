import { describe, expect, it } from 'vitest'

import { colorForId, LOCAL_PLAYER_COLOR, PEER_COLORS } from './playerColor'

describe('colorForId', () => {
  it('is deterministic for the same id', () => {
    expect(colorForId('abc123')).toBe(colorForId('abc123'))
  })

  it('always picks from the peer palette', () => {
    for (let i = 0; i < 200; i++) {
      const c = colorForId(`player-${i}`)
      expect(PEER_COLORS).toContain(c)
    }
  })

  it('never returns the local hotdog colour', () => {
    expect(PEER_COLORS).not.toContain(LOCAL_PLAYER_COLOR)
    for (let i = 0; i < 200; i++) {
      expect(colorForId(`player-${i}`)).not.toBe(LOCAL_PLAYER_COLOR)
    }
  })

  it('spreads ids across more than one colour', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 50; i++) seen.add(colorForId(`id-${i}`))
    expect(seen.size).toBeGreaterThan(3)
  })
})
