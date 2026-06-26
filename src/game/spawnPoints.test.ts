import { describe, expect, it } from 'vitest'

import { INITIAL_SPAWN, randomSpawn, SPAWN_POINTS } from './spawnPoints'

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

  it('only ever returns a curated, collision-checked spawn point', () => {
    // guards the "never respawn inside a collider" promise — and exercises
    // the fallback path (no point can be 18m from every death spot)
    for (let i = 0; i < 300; i++) {
      const p = randomSpawn(Math.random() * 40 - 20, Math.random() * 110 - 50)
      expect(SPAWN_POINTS).toContainEqual(p)
    }
  })

  it('every spawn drops in from the same ground height', () => {
    expect(SPAWN_POINTS.every(([, y]) => y === 2)).toBe(true)
  })

  it('pins the fixed first-load spawn as the head of the pool', () => {
    expect(INITIAL_SPAWN).toEqual(SPAWN_POINTS[0])
  })
})
