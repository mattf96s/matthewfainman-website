/**
 * Mutable world position of the currently active health pickup, mirrored
 * here so the DOM-side minimap can read it each frame without routing
 * per-frame data through Zustand (which would re-render the HUD).
 */
export const pickupState = {
  /** True while a pickup is spawned and uncollected. */
  active: false,
  x: 0,
  z: 0,
}
