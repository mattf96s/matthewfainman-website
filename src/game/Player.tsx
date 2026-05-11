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
import { mobileInput } from './mobileInput'
import { playerImpulse } from './playerImpulse'
import {
  GRAVITY,
  KEYBOARD_YAW_SPEED,
  PLAYER_HEIGHT,
  PLAYER_JUMP_SPEED,
  PLAYER_RADIUS,
  PLAYER_SPEED,
} from './constants'
import { X_NEAR_SIDEWALK } from './world/constants'

// offset off the lamp posts (which sit at X_NEAR_SIDEWALK, z = 0, 12, ...)
const SPAWN: [number, number, number] = [X_NEAR_SIDEWALK + 1.0, 2, 4]
/** If the player drops below this Y, the fall-off timer starts. */
const FALL_THRESHOLD_Y = -8
/** How long to keep falling before respawning at the title overlay. */
const FALL_RESET_MS = 1400

export function Player() {
  const body = useRef<RapierRigidBody>(null)
  const mesh = useRef<THREE.Group>(null)
  const [, getKeys] = useKeyboardControls()
  const { world } = useRapier()

  const controllerRef = useRef<ReturnType<typeof world.createCharacterController> | null>(null)
  const yVelocity = useRef(0)
  const wasJumpPressed = useRef(false)
  /** Set when the player drops past the threshold; cleared on respawn. */
  const fallingSince = useRef<number | null>(null)
  /** Last `playerImpulse.startedAt` we acted on, so we only apply the
   * upward pop once per knockback (not every frame inside it). */
  const lastImpulseAt = useRef(0)

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
    const now = performance.now()
    const knockback = now < playerImpulse.endsAt

    const keys = frozen || knockback
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

    if (knockback) {
      // On the frame a fresh knockback fires, pop the player up so they
      // arc through the air instead of sliding along the ground.
      if (playerImpulse.startedAt !== lastImpulseAt.current) {
        lastImpulseAt.current = playerImpulse.startedAt
        yVelocity.current = playerImpulse.vy
      }
      // Planar velocity decays linearly from full to zero over the duration.
      const remaining = (playerImpulse.endsAt - now) / playerImpulse.durationMs
      const t = Math.max(0, Math.min(1, remaining))
      planar.current.set(playerImpulse.vx * t, 0, playerImpulse.vz * t)
      planar.current.multiplyScalar(delta)
    } else {
      // axis values: +forward = into the scene (camera-forward), +right = camera-right.
      // Keyboard contributes ±1; gyro and on-screen joystick contribute
      // analog [-1, 1] and sum together. The combined vector clamps to
      // the unit disc so diagonals stay unit length and a small tilt /
      // small thumb-stick deflection produces a proportionally slow walk.
      const fKey = Number(forward) - Number(backward)
      const rKey = Number(right) - Number(left)
      const fMob = frozen
        ? 0
        : mobileInput.gyroForward + mobileInput.joystickForward
      const rMob = frozen
        ? 0
        : mobileInput.gyroRight + mobileInput.joystickRight
      const fRaw = fKey + fMob
      const rRaw = rKey + rMob
      const len = Math.hypot(fRaw, rRaw)
      const scale = len > 1 ? 1 / len : 1
      const forwardAxis = fRaw * scale
      const rightAxis = rRaw * scale

      // camera-forward in world space is (-sin yaw, 0, -cos yaw); camera-right is (cos, 0, -sin)
      const sin = Math.sin(cameraState.yaw)
      const cos = Math.cos(cameraState.yaw)
      planar.current.set(
        forwardAxis * -sin + rightAxis * cos,
        0,
        forwardAxis * -cos + rightAxis * -sin,
      )
      planar.current.multiplyScalar(PLAYER_SPEED * delta)
    }

    // vertical: gravity + jump on rising edge while grounded (jump
    // suppressed during knockback — we already set yVelocity on entry)
    const grounded = controller.computedGrounded()
    if (grounded && yVelocity.current < 0) yVelocity.current = 0
    if (!knockback && jump && !wasJumpPressed.current && grounded) {
      yVelocity.current = PLAYER_JUMP_SPEED
    }
    wasJumpPressed.current = !!jump
    yVelocity.current -= GRAVITY * delta

    move.current.set(planar.current.x, yVelocity.current * delta, planar.current.z)

    controller.computeColliderMovement(collider, move.current)
    const m = controller.computedMovement()

    const pos = rb.translation()
    const newY = pos.y + m.y
    rb.setNextKinematicTranslation({
      x: pos.x + m.x,
      y: newY,
      z: pos.z + m.z,
    })

    // fall-off-the-edge handling: drop below threshold → let them fall
    // for a moment → respawn at spawn and bring back the title overlay
    if (newY < FALL_THRESHOLD_Y) {
      const now = performance.now()
      if (fallingSince.current === null) {
        fallingSince.current = now
      } else if (now - fallingSince.current >= FALL_RESET_MS) {
        const store = useGameStore.getState()
        store.reset()
        store.setStarted(false)
        rb.setTranslation(
          { x: SPAWN[0], y: SPAWN[1], z: SPAWN[2] },
          true,
        )
        yVelocity.current = 0
        fallingSince.current = null
      }
    } else if (fallingSince.current !== null) {
      fallingSince.current = null
    }

    if (mesh.current) {
      if (knockback) {
        // tumble: lean steeply forward in the throw direction, spin a bit.
        const throwYaw = Math.atan2(playerImpulse.vx, playerImpulse.vz)
        mesh.current.rotation.y = throwYaw
        const remaining = (playerImpulse.endsAt - now) / playerImpulse.durationMs
        const t = Math.max(0, Math.min(1, 1 - remaining)) // 0→1 over duration
        // peak tilt around mid-flight, ease back at landing
        const tilt = Math.sin(t * Math.PI) * (Math.PI / 2)
        mesh.current.rotation.x = tilt
      } else {
        // ease the tumble tilt back to upright after a hit
        mesh.current.rotation.x = THREE.MathUtils.lerp(
          mesh.current.rotation.x,
          0,
          0.2,
        )
        // face the direction of horizontal motion
        if (planar.current.x !== 0 || planar.current.z !== 0) {
          const targetYaw = Math.atan2(planar.current.x, planar.current.z)
          mesh.current.rotation.y = THREE.MathUtils.lerp(
            mesh.current.rotation.y,
            targetYaw,
            0.2,
          )
        }
      }
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
