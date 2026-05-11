/** Mutable weather flag — read by Rain particles and (optionally) other
 * scene elements that want to react to rain. */
export const weatherState = {
  raining: false,
  /** performance.now() timestamp at which `raining` next flips. */
  nextChangeAt: 0,
}
