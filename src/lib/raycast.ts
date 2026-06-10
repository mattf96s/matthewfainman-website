/**
 * Ray-vs-primitive intersection math for hitscan shooting. Pure and
 * dependency-free: anything shaped like `{ x, y, z }` works, so
 * THREE.Vector3 values pass straight in without conversion.
 */

export interface Vec3 {
  x: number
  y: number
  z: number
}

// scratch object reused across calls — avoids per-shot allocation
const CAP: Vec3 = { x: 0, y: 0, z: 0 }

/**
 * Returns the t along (origin + t*dir) where the ray first enters an
 * upright capsule — vertical segment cy±halfSeg at (cx, cz), radius `r` —
 * or null if it misses. `dir` must be unit length.
 *
 * A capsule's surface is the side of a cylinder plus two cap spheres, so
 * testing cylinder entry (with the entry height clamped to the segment)
 * plus both caps covers every way in.
 */
export function rayCapsuleT(
  origin: Vec3,
  dir: Vec3,
  cx: number,
  cy: number,
  cz: number,
  halfSeg: number,
  r: number,
): number | null {
  // Side wall: the ray-circle problem on the XZ plane.
  const a = dir.x * dir.x + dir.z * dir.z
  if (a > 1e-8) {
    const ox = origin.x - cx
    const oz = origin.z - cz
    const b = ox * dir.x + oz * dir.z
    const c = ox * ox + oz * oz - r * r
    const disc = b * b - a * c
    if (disc >= 0) {
      const t = (-b - Math.sqrt(disc)) / a
      if (t >= 0) {
        const y = origin.y + dir.y * t
        if (y >= cy - halfSeg && y <= cy + halfSeg) return t
      }
    }
  }
  // Cap spheres (also handles near-vertical rays, where a ≈ 0).
  CAP.x = cx
  CAP.y = cy + halfSeg
  CAP.z = cz
  const tTop = raySphereT(origin, dir, CAP, r)
  CAP.y = cy - halfSeg
  const tBot = raySphereT(origin, dir, CAP, r)
  if (tTop !== null && tBot !== null) return Math.min(tTop, tBot)
  return tTop ?? tBot
}

/**
 * Returns the t along (origin + t*dir) where the ray first enters a
 * sphere centred at `c` with radius `r`, or null if it misses. `dir`
 * must be unit length.
 */
export function raySphereT(
  origin: Vec3,
  dir: Vec3,
  c: Vec3,
  r: number,
): number | null {
  const ox = origin.x - c.x
  const oy = origin.y - c.y
  const oz = origin.z - c.z
  const b = ox * dir.x + oy * dir.y + oz * dir.z
  const cc = ox * ox + oy * oy + oz * oz - r * r
  const disc = b * b - cc
  if (disc < 0) return null
  const sq = Math.sqrt(disc)
  const t1 = -b - sq
  const t2 = -b + sq
  if (t1 >= 0) return t1
  if (t2 >= 0) return t2
  return null
}
