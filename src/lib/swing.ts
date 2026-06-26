/**
 * The sword's overhead-chop animation, as a pure function of time since
 * the swing started. Dependency-free so it unit-tests without three.js;
 * `Sword.tsx` just applies the returned pose to the mesh.
 *
 * The blade winds up past vertical, then accelerates down-and-forward
 * through the arc, lunging the whole sword toward the strike so it
 * visibly sweeps through whoever it hits.
 */

const SWING_ANIM_MS = 300
/** Fraction of the animation spent raising the blade overhead. */
const WINDUP_END = 0.3
/** Pitch is rotation about local X: negative = raised, positive = buried. */
const IDLE_PITCH = -0.35
const WINDUP_PITCH = -2.1
const FOLLOW_PITCH = 1.05
/** How far the whole sword lifts (m) at the top of the windup. */
const SWING_LIFT = 0.18
/** How far the blade lunges forward (m) at the peak of the chop. */
const SWING_LUNGE = 0.5
/** Animation fraction at which the blade is mid-chop and "connects". */
const STRIKE_AT = 0.5

/**
 * ms from swing start to the strike frame. The hit is resolved here (not
 * at input) so damage lands exactly as the blade sweeps through — what
 * you see is what you hit.
 */
export const SWING_STRIKE_MS = STRIKE_AT * SWING_ANIM_MS

export interface SwingPose {
  /** Blade pitch, radians (rotation about local X). */
  pitch: number
  /** Vertical lift of the whole sword, metres. */
  lift: number
  /** Forward lunge of the blade, metres. */
  lunge: number
}

/**
 * The chop pose `sinceSwing` ms after the swing began. `swingIntervalMs`
 * is the cooldown between swings — the blade eases back to idle across
 * whatever time is left after the chop completes.
 */
export function swingPose(sinceSwing: number, swingIntervalMs: number): SwingPose {
  if (sinceSwing < SWING_ANIM_MS) {
    const p = sinceSwing / SWING_ANIM_MS
    if (p < WINDUP_END) {
      // ease-out raise — fast off idle, settling at the top
      const w = p / WINDUP_END
      return {
        pitch: IDLE_PITCH + (WINDUP_PITCH - IDLE_PITCH) * w * (2 - w),
        lift: SWING_LIFT * w,
        lunge: 0,
      }
    }
    // ease-in chop — the blade accelerates as it falls; the lunge peaks
    // mid-chop (a stab into the strike) then pulls back
    const s = (p - WINDUP_END) / (1 - WINDUP_END)
    return {
      pitch: WINDUP_PITCH + (FOLLOW_PITCH - WINDUP_PITCH) * s * s,
      lift: SWING_LIFT * (1 - s),
      lunge: SWING_LUNGE * Math.sin(s * Math.PI),
    }
  }
  if (sinceSwing < swingIntervalMs) {
    // recover to idle across the rest of the cooldown
    const r = (sinceSwing - SWING_ANIM_MS) / (swingIntervalMs - SWING_ANIM_MS)
    return { pitch: FOLLOW_PITCH + (IDLE_PITCH - FOLLOW_PITCH) * r, lift: 0, lunge: 0 }
  }
  return { pitch: IDLE_PITCH, lift: 0, lunge: 0 }
}
