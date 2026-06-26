import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

/**
 * Restarts the render loop when it comes back from a hidden tab.
 *
 * Game drives the `frameloop` prop: `'never'` while the tab is hidden so a
 * backgrounded tab costs ~0 CPU, `'always'` when visible. The catch is that
 * `'never'` makes R3F *cancel* its requestAnimationFrame once nothing
 * invalidates the frame — and flipping the prop back to `'always'` only
 * resets the flag, it doesn't reschedule the dead loop. So when the loop
 * goes live again we `invalidate()` once to kick rAF back into motion.
 *
 * Reading `frameloop` from the store (not a prop) means this effect runs
 * *after* R3F has applied the new value, avoiding a race where invalidate
 * fires while the store still reads `'never'` (which it would ignore).
 */
export function FrameloopGovernor() {
  const frameloop = useThree((s) => s.frameloop)
  const invalidate = useThree((s) => s.invalidate)

  useEffect(() => {
    if (frameloop !== 'never') invalidate()
  }, [frameloop, invalidate])

  return null
}
