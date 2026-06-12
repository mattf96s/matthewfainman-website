/**
 * The sword's geometry, shared by the local first-person weapon and
 * remote avatars so everyone sees the same blade. Pure visuals — no
 * positioning, no behaviour. Points down +Z (same convention as the
 * gun model) so holders orient it with the same yaw math.
 */
export function SwordModel() {
  return (
    <group>
      {/* blade */}
      <mesh position={[0, 0, 0.42]}>
        <boxGeometry args={[0.045, 0.1, 0.62]} />
        <meshStandardMaterial color="#cfd6dd" roughness={0.35} metalness={0.7} />
      </mesh>
      {/* crossguard */}
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[0.22, 0.06, 0.05]} />
        <meshStandardMaterial color="#c9a227" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* grip */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[0.07, 0.08, 0.18]} />
        <meshStandardMaterial color="#3b2a1a" roughness={0.8} />
      </mesh>
    </group>
  )
}
