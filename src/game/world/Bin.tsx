import { CuboidCollider, RigidBody } from '@react-three/rapier'

interface BinProps {
  position: [number, number]
}

const BIN_W = 0.55
const BIN_H = 1.05
const BIN_D = 0.55

/** A green-grey street rubbish bin on a small post. */
export function Bin({ position: [x, z] }: BinProps) {
  return (
    <RigidBody type="fixed" colliders={false} position={[x, 0, z]}>
      <CuboidCollider
        args={[BIN_W / 2, BIN_H / 2, BIN_D / 2]}
        position={[0, BIN_H / 2 + 0.2, 0]}
      />

      {/* post */}
      <mesh castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#1c1c1c" />
      </mesh>

      {/* bin body */}
      <mesh castShadow position={[0, 0.2 + BIN_H / 2, 0]}>
        <boxGeometry args={[BIN_W, BIN_H, BIN_D]} />
        <meshStandardMaterial color="#2e3f33" roughness={0.85} />
      </mesh>

      {/* opening — dark slot near the top */}
      <mesh position={[0, 0.2 + BIN_H - 0.15, BIN_D / 2 + 0.001]}>
        <planeGeometry args={[BIN_W * 0.7, 0.18]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* hint of bag inside */}
      <mesh position={[0, 0.2 + BIN_H - 0.4, BIN_D / 2 + 0.002]}>
        <planeGeometry args={[BIN_W * 0.55, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </RigidBody>
  )
}
