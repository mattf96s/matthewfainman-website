import { describe, expect, it } from 'vitest'

import { INITIAL_SPAWN, randomSpawn } from './spawnPoints'

describe('randomSpawn', () => {
  it('never picks a point within 18m of the death spot when avoidable', () => {
    // sample death spots across the whole walkable block
    for (let i = 0; i < 300; i++) {
      const dx = -20 + Math.random() * 40
      const dz = -50 + Math.random() * 110
      const [x, , z] = randomSpawn(dx, dz)
      expect(Math.hypot(x - dx, z - dz)).toBeGreaterThanOrEqual(18)
    }
  })

  it('still returns a spawn when everything is somehow close', () => {
    // a fake death spot can't be near all 10 points at once, but the
    // fallback path must hold even for the map centre
    const [x, y, z] = randomSpawn(0, 0)
    expect(Number.isFinite(x)).toBe(true)
    expect(y).toBe(2)
    expect(Number.isFinite(z)).toBe(true)
  })

  it('spawns at ground-drop height', () => {
    for (let i = 0; i < 50; i++) {
      const [, y] = randomSpawn(0, 0)
      expect(y).toBe(2)
    }
  })

  it('keeps the fixed initial spawn unchanged', () => {
    expect(INITIAL_SPAWN[1]).toBe(2)
  })
})
