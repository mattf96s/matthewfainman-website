import { beforeEach, describe, expect, it } from 'vitest'

import { MAX_HEALTH, useGameStore } from './useGameStore'

/** Reset the bits of store state these tests touch. */
beforeEach(() => {
  useGameStore.setState({
    health: MAX_HEALTH,
    deathReason: null,
    weapon: 'gun',
    lastHealSource: 'pickup',
    score: 0,
    nearMissCount: 0,
    kills: 0,
    deaths: 0,
    killFeed: [],
    multiplayerJoined: false,
  })
})

describe('health invariants', () => {
  it('damage floors at 0 and records the death reason', () => {
    useGameStore.getState().takeDamage(MAX_HEALTH + 50, 'tram')
    const s = useGameStore.getState()
    expect(s.health).toBe(0)
    expect(s.deathReason).toBe('tram')
  })

  it('damage is a no-op while dead — no double-death', () => {
    useGameStore.getState().takeDamage(MAX_HEALTH, 'tram')
    useGameStore.getState().takeDamage(25, 'sword')
    const s = useGameStore.getState()
    expect(s.health).toBe(0)
    expect(s.deathReason).toBe('tram')
  })

  it('heal clamps at MAX_HEALTH and is a no-op while dead', () => {
    useGameStore.getState().takeDamage(10, 'bike')
    useGameStore.getState().heal(999)
    expect(useGameStore.getState().health).toBe(MAX_HEALTH)

    useGameStore.getState().takeDamage(MAX_HEALTH, 'tram')
    useGameStore.getState().heal(50)
    expect(useGameStore.getState().health).toBe(0)
  })

  it('records the heal source so regen stays silent in the HUD', () => {
    useGameStore.getState().takeDamage(40, 'car')
    useGameStore.getState().heal(1, 'regen')
    expect(useGameStore.getState().lastHealSource).toBe('regen')
    useGameStore.getState().heal(25)
    expect(useGameStore.getState().lastHealSource).toBe('pickup')
  })

  it('respawn restores full health and clears the death reason', () => {
    useGameStore.getState().takeDamage(MAX_HEALTH, 'water')
    useGameStore.getState().respawn()
    const s = useGameStore.getState()
    expect(s.health).toBe(MAX_HEALTH)
    expect(s.deathReason).toBeNull()
  })
})

describe('weapon switching', () => {
  it('toggles between gun and sword', () => {
    expect(useGameStore.getState().weapon).toBe('gun')
    useGameStore.getState().toggleWeapon()
    expect(useGameStore.getState().weapon).toBe('sword')
    useGameStore.getState().toggleWeapon()
    expect(useGameStore.getState().weapon).toBe('gun')
  })

  it('survives respawn — loadout is not progress', () => {
    useGameStore.getState().setWeapon('sword')
    useGameStore.getState().takeDamage(MAX_HEALTH, 'tram')
    useGameStore.getState().respawn()
    expect(useGameStore.getState().weapon).toBe('sword')
  })
})

describe('scoring + kill feed', () => {
  it('addNearMiss awards the bonus and counts the pass', () => {
    useGameStore.getState().addNearMiss()
    expect(useGameStore.getState().score).toBe(5)
    expect(useGameStore.getState().nearMissCount).toBe(1)
  })

  it('addKill awards score, counts the kill, and feeds it newest-first', () => {
    useGameStore.getState().addKill('rival')
    const s = useGameStore.getState()
    expect(s.kills).toBe(1)
    expect(s.score).toBe(100)
    expect(s.killFeed[0]).toMatchObject({ killer: 'You', victim: 'rival' })
  })

  it('caps the kill feed at five, newest first', () => {
    for (let i = 0; i < 8; i++) useGameStore.getState().addDeath(`k${i}`)
    const feed = useGameStore.getState().killFeed
    expect(feed).toHaveLength(5)
    expect(feed[0]).toMatchObject({ killer: 'k7', victim: 'You' })
  })
})

describe('reset', () => {
  it('clears score and health but keeps the chosen weapon', () => {
    useGameStore.getState().addNearMiss()
    useGameStore.getState().setWeapon('sword')
    useGameStore.getState().reset()
    const s = useGameStore.getState()
    expect(s.score).toBe(0)
    expect(s.health).toBe(MAX_HEALTH)
    expect(s.weapon).toBe('sword')
  })

  it('zeroes kills/deaths solo but preserves them in multiplayer', () => {
    useGameStore.setState({ kills: 3, deaths: 2, multiplayerJoined: false })
    useGameStore.getState().reset()
    expect(useGameStore.getState().kills).toBe(0)
    expect(useGameStore.getState().deaths).toBe(0)

    useGameStore.setState({ kills: 3, deaths: 2, multiplayerJoined: true })
    useGameStore.getState().reset()
    expect(useGameStore.getState().kills).toBe(3)
    expect(useGameStore.getState().deaths).toBe(2)
  })
})
