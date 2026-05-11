interface RedLightWindowProps {
  x: number
  y: number
  width: number
  height: number
  /** Z of the front-of-house plane (windows render just in front). */
  zFront: number
}

/**
 * A ground-floor window styled after De Wallen: an emissive red plane
 * with a stylised dark silhouette (head + body) overlaid. Stylised,
 * low-poly, no detail beyond the recognisable shape.
 */
export function RedLightWindow({
  x,
  y,
  width,
  height,
  zFront,
}: RedLightWindowProps) {
  const headRadius = height * 0.1
  const bodyW = width * 0.4
  const bodyH = height * 0.5
  const headY = bodyH / 2 + headRadius * 0.6
  const bodyY = -headRadius * 0.2

  return (
    <group position={[x, y, zFront]}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#3a0712"
          emissive="#ff1a2e"
          emissiveIntensity={1.6}
          roughness={0.4}
        />
      </mesh>

      {/* silhouette body */}
      <mesh position={[0, bodyY, 0.002]}>
        <planeGeometry args={[bodyW, bodyH]} />
        <meshStandardMaterial color="#150207" />
      </mesh>

      {/* silhouette head */}
      <mesh position={[0, headY, 0.002]}>
        <circleGeometry args={[headRadius, 18]} />
        <meshStandardMaterial color="#150207" />
      </mesh>
    </group>
  )
}
