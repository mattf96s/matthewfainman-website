import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import {
  CapsuleCollider,
  RigidBody,
  useRapier,
  type RapierRigidBody,
} from '@react-three/rapier'
import * as THREE from 'three'

import { useGameStore } from '../state/useGameStore'
import { cameraState } from './cameraState'
import {
  GRAVITY,
  KEYBOARD_YAW_SPEED,
  PLAYER_HEIGHT,
  PLAYER_JUMP_SPEED,
  PLAYER_RADIUS,
  PLAYER_SPEED,
} from './constants'
import { X_NEAR_SIDEWALK } from './world/constants'

const SPAWN: [number, number, number] = [X_NEAR_SIDEWALK, 2, 0]

export function Player() {
  const body = useRef<RapierRigidBody>(null)
  const mesh = useRef<THREE.Group>(null)
  const [, getKeys] = useKeyboardControls()
  const { world } = useRapier()

  const controllerRef = useRef<ReturnType<typeof world.createCharacterController> | null>(null)
  const yVelocity = useRef(0)
  const wasJumpPressed = useRef(false)

  const move = useRef(new THREE.Vector3())
  const planar = useRef(new THREE.Vector3())

  useEffect(() => {
    const c = world.createCharacterController(0.05)
    c.enableAutostep(0.4, 0.2, true)
    c.enableSnapToGround(0.3)
    c.setApplyImpulsesToDynamicBodies(false)
    controllerRef.current = c
    return () => {
      if (controllerRef.current) {
        world.removeCharacterController(controllerRef.current)
        controllerRef.current = null
      }
    }
  }, [world])

  // teleport back to spawn when the game resets (gameOver: true → false)
  useEffect(() => {
    let prev = useGameStore.getState().gameOver
    return useGameStore.subscribe((state) => {
      if (prev && !state.gameOver && body.current) {
        body.current.setTranslation(
          { x: SPAWN[0], y: SPAWN[1], z: SPAWN[2] },
          true,
        )
        yVelocity.current = 0
      }
      prev = state.gameOver
    })
  }, [])

  useFrame((_state, delta) => {
    const rb = body.current
    const controller = controllerRef.current
    if (!rb || !controller) return
    const collider = rb.collider(0)
    if (!collider) return

    const { gameOver, paused, started } = useGameStore.getState()
    const frozen = gameOver || paused || !started
    const keys = frozen
      ? {
          forward: false,
          backward: false,
          left: false,
          right: false,
          jump: false,
          yawLeft: false,
          yawRight: false,
        }
      : getKeys()
    const { forward, backward, left, right, jump, yawLeft, yawRight } = keys

    // keyboard yaw rotation (Q/E) — works without pointer lock
    const yawInput = Number(yawLeft) - Number(yawRight)
    if (yawInput !== 0) {
      cameraState.yaw += yawInput * KEYBOARD_YAW_SPEED * delta
    }

    // axis values: +forward = into the scene (camera-forward), +right = camera-right
    const forwardAxis = Number(forward) - Number(backward)
    const rightAxis = Number(right) - Number(left)

    // camera-forward in world space is (-sin yaw, 0, -cos yaw); camera-right is (cos, 0, -sin)
    const sin = Math.sin(cameraState.yaw)
    const cos = Math.cos(cameraState.yaw)
    planar.current.set(
      forwardAxis * -sin + rightAxis * cos,
      0,
      forwardAxis * -cos + rightAxis * -sin,
    )
    if (planar.current.lengthSq() > 0) planar.current.normalize()
    planar.current.multiplyScalar(PLAYER_SPEED * delta)

    // vertical: gravity + jump on rising edge while grounded
    const grounded = controller.computedGrounded()
    if (grounded && yVelocity.current < 0) yVelocity.current = 0
    if (jump && !wasJumpPressed.current && grounded) {
      yVelocity.current = PLAYER_JUMP_SPEED
    }
    wasJumpPressed.current = !!jump
    yVelocity.current -= GRAVITY * delta

    move.current.set(planar.current.x, yVelocity.current * delta, planar.current.z)

    controller.computeColliderMovement(collider, move.current)
    const m = controller.computedMovement()

    const pos = rb.translation()
    rb.setNextKinematicTranslation({
      x: pos.x + m.x,
      y: pos.y + m.y,
      z: pos.z + m.z,
    })

    // face the direction of horizontal motion
    if (mesh.current && (planar.current.x !== 0 || planar.current.z !== 0)) {
      const targetYaw = Math.atan2(planar.current.x, planar.current.z)
      mesh.current.rotation.y = THREE.MathUtils.lerp(
        mesh.current.rotation.y,
        targetYaw,
        0.2,
      )
    }
  })

  return (
    <RigidBody
      ref={body}
      name="player"
      type="kinematicPosition"
      colliders={false}
      position={SPAWN}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[PLAYER_HEIGHT / 2, PLAYER_RADIUS]} />
      <group ref={mesh}>
        <mesh castShadow>
          <capsuleGeometry args={[PLAYER_RADIUS, PLAYER_HEIGHT, 4, 8]} />
          <meshStandardMaterial color="#e07a5f" />
        </mesh>
        {/* small "nose" pointing forward (+Z in local space) — helps see facing */}
        <mesh castShadow position={[0, 0.3, PLAYER_RADIUS + 0.05]}>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshStandardMaterial color="#3c2f29" />
        </mesh>
      </group>
    </RigidBody>
  )
}
