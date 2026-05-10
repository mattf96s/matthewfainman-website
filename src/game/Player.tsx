import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import {
  CapsuleCollider,
  RigidBody,
  type RapierRigidBody,
} from '@react-three/rapier'
import * as THREE from 'three'

import { PLAYER_HEIGHT, PLAYER_RADIUS, PLAYER_SPEED } from './constants'

export function Player() {
  const body = useRef<RapierRigidBody>(null)
  const [, getKeys] = useKeyboardControls()

  const direction = useRef(new THREE.Vector3())
  const frontVector = useRef(new THREE.Vector3())
  const sideVector = useRef(new THREE.Vector3())

  useFrame((_state, delta) => {
    if (!body.current) return
    const { forward, backward, left, right } = getKeys()

    frontVector.current.set(0, 0, Number(backward) - Number(forward))
    sideVector.current.set(Number(left) - Number(right), 0, 0)
    direction.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()

    if (direction.current.lengthSq() === 0) return

    direction.current.multiplyScalar(PLAYER_SPEED * delta)

    const pos = body.current.translation()
    body.current.setNextKinematicTranslation({
      x: pos.x + direction.current.x,
      y: pos.y,
      z: pos.z + direction.current.z,
    })
  })

  return (
    <RigidBody
      ref={body}
      name="player"
      type="kinematicPosition"
      colliders={false}
      position={[0, 2, 0]}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[PLAYER_HEIGHT / 2, PLAYER_RADIUS]} />
      <mesh castShadow>
        <capsuleGeometry args={[PLAYER_RADIUS, PLAYER_HEIGHT, 4, 8]} />
        <meshStandardMaterial color="#e07a5f" />
      </mesh>
    </RigidBody>
  )
}
