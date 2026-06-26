/**
 * The little shoulder gun mesh, shared by the local player's `Gun` and
 * remote avatars so they always look identical. Mirrors `SwordModel`.
 */
export function GunModel() {
  return (
    <mesh>
      <boxGeometry args={[0.12, 0.14, 0.55]} />
      <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.4} />
    </mesh>
  )
}
