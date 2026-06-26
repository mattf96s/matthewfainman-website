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

  it('never assigns a peer the local hotdog colour', () => {
    // the palette excludes it, so no id can hash to it
    expect(PEER_COLORS).not.toContain(LOCAL_PLAYER_COLOR)
  })

  it('returns a valid palette colour for edge-case ids', () => {
    // empty / single-char / unicode ids must not crash the non-null
    // assertion or fall outside the palette
    expect(PEER_COLORS).toContain(colorForId(''))
    expect(PEER_COLORS).toContain(colorForId('x'))
    expect(PEER_COLORS).toContain(colorForId('日本語'))
  })

  it('spreads ids across more than one colour', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 50; i++) seen.add(colorForId(`id-${i}`))
    expect(seen.size).toBeGreaterThan(3)
  })
})
