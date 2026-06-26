import { PLAYER_RADIUS } from './constants'

interface PlayerNoseProps {
  /** Nose colour — the local player and remote avatars use different tints. */
  color: string
}

/**
 * Small forward-pointing box (+Z in local space) that shows which way an
 * avatar is facing. Shared by the local player and remote avatars.
 */
export function PlayerNose({ color }: PlayerNoseProps) {
  return (
    <mesh position={[0, 0.3, PLAYER_RADIUS + 0.05]}>
      <boxGeometry args={[0.12, 0.12, 0.12]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
