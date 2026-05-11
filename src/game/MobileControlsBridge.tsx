import { useMobileControls } from '../hooks/useMobileControls'

/**
 * Sits inside the Canvas so the mobile-controls hook can resolve the
 * canvas element via useThree. Does not render anything.
 */
export function MobileControlsBridge() {
  useMobileControls()
  return null
}
