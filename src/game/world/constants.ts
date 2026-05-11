/**
 * Amsterdam Explorer world coordinate system.
 *
 * - 1 unit = 1 metre
 * - +Z = north (street runs along the Z axis)
 * - +X = east
 * - +Y = up
 *
 * The block is laid out as parallel strips along the +Z axis. From -X
 * (canal side) to +X (house side):
 *
 *   canal water    →    far-bank sidewalk    →    canal    →
 *   canal-side sidewalk → road → fietspad → sidewalk → houses
 *
 * Centred on x = 0 so the player spawns roughly mid-block.
 */

export const BLOCK_LENGTH = 60

/** Canal length is independent of block length so it can extend past
 * cross-streets and out beyond the visible block edges. */
export const CANAL_LENGTH = 100

/** Z of the perpendicular cross-street (north end of the block). */
export const CROSS_STREET_Z = 35
export const CROSS_STREET_WIDTH = 6
/** X half-extent of the cross-street — spans the canal and into the
 * houseside terrain. */
export const CROSS_STREET_X_HALF = 20

// surface thickness (Y depth of the cuboid colliders)
export const SURFACE_THICKNESS = 0.4

// lane widths, west → east
export const FAR_SIDEWALK_WIDTH = 2
export const CANAL_WIDTH = 8
export const NEAR_SIDEWALK_WIDTH = 2
export const ROAD_WIDTH = 4
export const FIETSPAD_WIDTH = 2
export const HOUSE_SIDEWALK_WIDTH = 2

// cross-section X coordinates of the strip *centres* (west → east)
const lanes = [
  FAR_SIDEWALK_WIDTH,
  CANAL_WIDTH,
  NEAR_SIDEWALK_WIDTH,
  ROAD_WIDTH,
  FIETSPAD_WIDTH,
  HOUSE_SIDEWALK_WIDTH,
] as const
const totalWidth = lanes.reduce((a, b) => a + b, 0)
let cursor = -totalWidth / 2
const centres: number[] = []
for (const w of lanes) {
  centres.push(cursor + w / 2)
  cursor += w
}
export const X_FAR_SIDEWALK = centres[0]!
export const X_CANAL = centres[1]!
export const X_NEAR_SIDEWALK = centres[2]!
export const X_ROAD = centres[3]!
export const X_FIETSPAD = centres[4]!
export const X_HOUSE_SIDEWALK = centres[5]!

// X of the building front line (just past the house-side sidewalk)
export const X_HOUSE_FRONT = X_HOUSE_SIDEWALK + HOUSE_SIDEWALK_WIDTH / 2

// canal water surface sits below the bank
export const CANAL_DEPTH = 1.2

// colours — warm Amsterdam-ish palette
export const COLOR_SIDEWALK = '#bdb9ad'
export const COLOR_ROAD = '#3f3f3f'
export const COLOR_FIETSPAD = '#9a3a2a'
export const COLOR_CANAL = '#3d6470'
export const COLOR_BRIDGE = '#7a6a55'

// brick / house palette
export const HOUSE_BRICKS = [
  '#a04a3b',
  '#7a3a2c',
  '#b86b48',
  '#5e3526',
  '#8c4a36',
] as const
