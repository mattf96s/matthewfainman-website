import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { cameraState } from './cameraState'
import {
  CAMERA_DISTANCE,
  CAMERA_HEIGHT,
  CAMERA_LERP,
} from './constants'

export function FollowCamera() {
  const { camera, scene } = useThree()
  const target = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())

  useFrame(() => {
    const player = scene.getObjectByName('player')
    if (!player) return

    const { yaw, pitch } = cameraState

    // orbit point: a bit above the player's feet so the camera looks at the chest
    target.current.set(
      player.position.x,
      player.position.y + 0.5,
      player.position.z,
    )

    // place camera on a sphere around the orbit point, parameterised by yaw + pitch
    const horizDist = CAMERA_DISTANCE * Math.cos(pitch)
    const vertOffset = CAMERA_HEIGHT + CAMERA_DISTANCE * Math.sin(pitch)

    desired.current.set(
      target.current.x + horizDist * Math.sin(yaw),
      target.current.y + vertOffset,
      target.current.z + horizDist * Math.cos(yaw),
    )

    camera.position.lerp(desired.current, CAMERA_LERP)
    camera.lookAt(target.current)
  })

  return null
}
