import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { cameraState } from './cameraState'
import {
  CAMERA_DISTANCE,
  CAMERA_HEIGHT,
  CAMERA_LERP,
  CAMERA_LOOK_AHEAD,
} from './constants'

export function FollowCamera() {
  const { camera, scene } = useThree()
  const target = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())
  const lookTarget = useRef(new THREE.Vector3())

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

    // shake offset — decays over the remaining shake window
    const now = performance.now()
    if (now < cameraState.shakeUntil && cameraState.shakeMagnitude > 0) {
      const remaining = (cameraState.shakeUntil - now) / 350
      const k = cameraState.shakeMagnitude * Math.max(0, Math.min(1, remaining))
      camera.position.x += (Math.random() - 0.5) * k * 2
      camera.position.y += (Math.random() - 0.5) * k * 2
      camera.position.z += (Math.random() - 0.5) * k * 2
    }

    // Look along the aim direction, past the player, instead of at the
    // player. Screen centre (= the crosshair) then sits on the world
    // ahead and tracks the mouse 1:1, with the player at lower-centre —
    // standard third-person-shooter framing. The Gun's hit ray goes from
    // the camera through screen centre, so crosshair and hits agree.
    const cosP = Math.cos(pitch)
    lookTarget.current.set(
      target.current.x - Math.sin(yaw) * cosP * CAMERA_LOOK_AHEAD,
      target.current.y - Math.sin(pitch) * CAMERA_LOOK_AHEAD,
      target.current.z - Math.cos(yaw) * cosP * CAMERA_LOOK_AHEAD,
    )
    camera.lookAt(lookTarget.current)
  })

  return null
}
