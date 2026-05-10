import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { CAMERA_DISTANCE, CAMERA_HEIGHT, CAMERA_LERP } from './constants'

export function FollowCamera() {
  const { camera, scene } = useThree()
  const target = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())

  useFrame(() => {
    const player = scene.getObjectByName('player')
    if (!player) return

    target.current.copy(player.position)
    desired.current.set(
      player.position.x,
      player.position.y + CAMERA_HEIGHT,
      player.position.z + CAMERA_DISTANCE,
    )

    camera.position.lerp(desired.current, CAMERA_LERP)
    camera.lookAt(target.current)
  })

  return null
}
