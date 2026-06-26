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

import { lerpAngle } from '../lib/angle'
import { walkDirection } from '../lib/movement'
import { LOCAL_PLAYER_COLOR } from '../lib/playerColor'
import { useGameStore } from '../state/useGameStore'
import { cameraState } from './cameraState'
import { mobileInput } from './mobileInput'
import { PlayerNose } from './PlayerNose'
import { playerImpulse } from './playerImpulse'
import { playerPosition } from './playerPosition'
import {
  GRAVITY,
  KEYBOARD_YAW_SPEED,
  PLAYER_HEIGHT,
  PLAYER_JUMP_SPEED,
  PLAYER_RADIUS,
  PLAYER_SPEED,
} from './constants'
import { INITIAL_SPAWN, randomSpawn } from './spawnPoints'

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

  // teleport to a fresh spawn whenever the respawn tick bumps (solo and
  // multiplayer both respawn by incrementing it after a death). Random,
  // away from the death spot, so deaths don't replay the same ambush.
  useEffect(() => {
    let prevTick = useGameStore.getState().respawnTick
    return useGameStore.subscribe((state) => {
      if (state.respawnTick !== prevTick && body.current) {
        const pos = body.current.translation()
        const [x, y, z] = randomSpawn(pos.x, pos.z)
        body.current.setTranslation({ x, y, z }, true)
        // publish immediately — the frame loop normally does this, but
        // it's paused while the tab is hidden, and the multiplayer
        // bridge pushes a respawn snapshot right after this subscriber
        playerPosition.x = x
        playerPosition.y = y
        playerPosition.z = z
        yVelocity.current = 0
      }
      prevTick = state.respawnTick
    })
  }, [])

  useFrame((_state, delta) => {
    const rb = body.current
    const controller = controllerRef.current
    if (!rb || !controller) return
    const collider = rb.collider(0)
    if (!collider) return

    const { health, paused, started } = useGameStore.getState()
    const frozen = paused || !started || health <= 0
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
      // +forward = into the scene (camera-forward), +right = camera-right.
      // Keyboard contributes ±1; the joystick contributes analog [-1, 1].
      const fRaw = Number(forward) - Number(backward) +
        (frozen ? 0 : mobileInput.joystickForward)
      const rRaw = Number(right) - Number(left) +
        (frozen ? 0 : mobileInput.joystickRight)
      walkDirection(fRaw, rRaw, cameraState.yaw, planar.current)
      planar.current.y = 0
      planar.current.multiplyScalar(PLAYER_SPEED * delta)
    }

    // vertical: gravity + jump on rising edge while grounded (jump
    // suppressed during knockback — we already set yVelocity on entry)
    const grounded = controller.computedGrounded()
    if (grounded && yVelocity.current < 0) yVelocity.current = 0
    const jumpInput = jump || (!frozen && !knockback && mobileInput.jumpPressed)
    if (!knockback && jumpInput && !wasJumpPressed.current && grounded) {
      yVelocity.current = PLAYER_JUMP_SPEED
    }
    wasJumpPressed.current = !!jumpInput
    yVelocity.current -= GRAVITY * delta

    move.current.set(planar.current.x, yVelocity.current * delta, planar.current.z)

    controller.computeColliderMovement(collider, move.current)
    const m = controller.computedMovement()

    const pos = rb.translation()
    const newY = pos.y + m.y
    const newX = pos.x + m.x
    const newZ = pos.z + m.z
    rb.setNextKinematicTranslation({
      x: newX,
      y: newY,
      z: newZ,
    })

    // publish the player position for hazards to read; they do their
    // own AABB hit detection because Rapier sensor events don't fire
    // reliably for the kinematic-character-controlled body
    playerPosition.x = newX
    playerPosition.y = newY
    playerPosition.z = newZ
    playerPosition.ready = true

    // fall-off-the-edge handling: drop below threshold → let them fall
    // for a moment → respawn at spawn and bring back the title overlay
    if (newY < FALL_THRESHOLD_Y) {
      const now = performance.now()
      if (fallingSince.current === null) {
        fallingSince.current = now
      } else if (now - fallingSince.current >= FALL_RESET_MS) {
        // Fell off the world — just pop back at a spawn point. Death is
        // never terminal and there's no title screen to return to, so
        // don't reset score or freeze the player.
        const [x, y, z] = randomSpawn(newX, newZ)
        rb.setTranslation({ x, y, z }, true)
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
        // face camera-forward (= aim direction) so the gun on the
        // player's shoulder lines up with the crosshair. Mesh local +Z
        // points "forward"; the camera looks from yaw rotated +π behind
        // the player, so player faces yaw + π in world space.
        const targetYaw = cameraState.yaw + Math.PI
        mesh.current.rotation.y = lerpAngle(
          mesh.current.rotation.y,
          targetYaw,
          0.25,
        )
      }
    }
  })

  return (
    <RigidBody
      ref={body}
      name="player"
      type="kinematicPosition"
      colliders={false}
      position={INITIAL_SPAWN}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[PLAYER_HEIGHT / 2, PLAYER_RADIUS]} />
      <group ref={mesh}>
        <mesh castShadow>
          <capsuleGeometry args={[PLAYER_RADIUS, PLAYER_HEIGHT, 4, 8]} />
          {/* always the terracotta hotdog — remote palettes exclude it */}
          <meshStandardMaterial color={LOCAL_PLAYER_COLOR} />
        </mesh>
        {/* nose: facing indicator, shared with remote avatars */}
        <PlayerNose color="#3c2f29" />
      </group>
    </RigidBody>
  )
}
