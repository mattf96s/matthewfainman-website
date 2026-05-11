/**
 * Amsterdam Explorer world coordinate system.
 *
 * - 1 unit = 1 metre
 * - +Z = north (street runs along the Z axis)
 * - +X = east
 * - +Y = up
 *
 * Cross-section, west → east:
 *   far-bank sidewalk → canal → canal-side sidewalk →
 *   west car lane → west median (waiting platform) →
 *   west tram lane → east tram lane →
 *   east median (waiting platform) → east car lane →
 *   fietspad → house-side sidewalk → houses
 *
 * Centred on x = 0 (after laying out all strips).
 */

export const BLOCK_LENGTH = 100

/** Canal length — independent of block length so it can extend past
 * the cross-streets and out beyond the visible block edges. */
export const CANAL_LENGTH = 140

/** Z of the perpendicular cross-street (past the north end of the block). */
export const CROSS_STREET_Z = 55
export const CROSS_STREET_WIDTH = 14
/** X half-extent of the cross-street. */
export const CROSS_STREET_X_HALF = 20

// surface thickness (Y depth of the cuboid colliders)
export const SURFACE_THICKNESS = 0.4

// lane widths, west → east
export const FAR_SIDEWALK_WIDTH = 4
export const CANAL_WIDTH = 8
export const NEAR_SIDEWALK_WIDTH = 4
export const CAR_LANE_WIDTH = 3
export const MEDIAN_WIDTH = 2.2
export const TRAM_LANE_WIDTH = 3
export const FIETSPAD_WIDTH = 2.5
export const HOUSE_SIDEWALK_WIDTH = 4

const lanes = [
  FAR_SIDEWALK_WIDTH,
  CANAL_WIDTH,
  NEAR_SIDEWALK_WIDTH,
  CAR_LANE_WIDTH, // west car lane
  MEDIAN_WIDTH, // west median (tram-stop platform)
  TRAM_LANE_WIDTH, // west-bound tram
  TRAM_LANE_WIDTH, // east-bound tram
  MEDIAN_WIDTH, // east median
  CAR_LANE_WIDTH, // east car lane
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
export const X_CAR_WEST = centres[3]!
export const X_MEDIAN_WEST = centres[4]!
export const X_TRAM_WEST = centres[5]!
export const X_TRAM_EAST = centres[6]!
export const X_MEDIAN_EAST = centres[7]!
export const X_CAR_EAST = centres[8]!
export const X_FIETSPAD = centres[9]!
export const X_HOUSE_SIDEWALK = centres[10]!

/** Centre between the two tram lanes — handy for shop/zebra-crossing geometry. */
export const X_ROAD = (X_TRAM_WEST + X_TRAM_EAST) / 2
/** Full width from west car lane outer edge to east car lane outer edge. */
export const ROAD_WIDTH =
  CAR_LANE_WIDTH * 2 + MEDIAN_WIDTH * 2 + TRAM_LANE_WIDTH * 2

/** Cross-street road depth (Z). */
export const CROSS_ROAD_DEPTH = 8
/** Lane centres on the cross-street (Z). */
export const Z_CROSS_LANE_SOUTH = CROSS_STREET_Z - CROSS_ROAD_DEPTH / 4
export const Z_CROSS_LANE_NORTH = CROSS_STREET_Z + CROSS_ROAD_DEPTH / 4

export const X_HOUSE_FRONT = X_HOUSE_SIDEWALK + HOUSE_SIDEWALK_WIDTH / 2

export const CANAL_DEPTH = 1.2

// colours
export const COLOR_SIDEWALK = '#bdb9ad'
/** Warmer brick tone for the gracht-side pavement — Amsterdam streets
 * along the canals are paved in red-brown klinkers, not grey slabs. */
export const COLOR_CANAL_PAVEMENT = '#9c7355'
export const COLOR_MEDIAN = '#a8a59a'
export const COLOR_ROAD = '#3f3f3f'
export const COLOR_TRAM_LANE = '#363535'
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
