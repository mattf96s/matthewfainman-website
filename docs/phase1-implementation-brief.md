# Amsterdam Explorer — Phase 1 Implementation Brief

**Starting point:** Existing React + Vite + pnpm + TypeScript project.

**Goal of Phase 1:** A walkable player capsule on a flat plane, third-person
follow camera, WASD + mouse-look, basic HUD showing FPS. No city yet — just a
solid movement foundation we can build on.

---

## Step 1 — Install dependencies

```bash
pnpm add three @react-three/fiber @react-three/drei @react-three/rapier zustand
pnpm add -D @types/three
```

Verify versions are compatible:
- three: ^0.169+
- @react-three/fiber: ^9.x (works with React 19)
- @react-three/drei: ^9.x
- @react-three/rapier: ^2.x

If on React 18, use @react-three/fiber ^8.x instead.

---

## Step 2 — Folder structure

Create:

```
src/
  game/
    Game.tsx              ← top-level R3F <Canvas> wrapper
    Player.tsx            ← player capsule + character controller
    Ground.tsx            ← the flat plane
    FollowCamera.tsx      ← third-person camera rig
    constants.ts          ← shared tunables (speed, jump height, etc.)
  state/
    useGameStore.ts       ← Zustand store (paused, fps, etc.)
  ui/
    HUD.tsx               ← FPS counter, eventually score
  hooks/
    useKeyboard.ts        ← keyboard input (wraps Drei's KeyboardControls)
```

Wire `Game` into your existing `App.tsx`. The Canvas should fill the viewport.

---

## Step 3 — The Canvas

`src/game/Game.tsx`:

```tsx
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Suspense } from 'react';

import { Player } from './Player';
import { Ground } from './Ground';
import { FollowCamera } from './FollowCamera';

const keyMap = [
  { name: 'forward',  keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left',     keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right',    keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump',     keys: ['Space'] },
];

export function Game() {
  return (
    <KeyboardControls map={keyMap}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <Physics gravity={[0, -30, 0]}>
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 20, 10]}
              intensity={1.5}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <Ground />
            <Player />
            <FollowCamera />
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}
```

`App.tsx` becomes:

```tsx
import { Game } from './game/Game';
import { HUD } from './ui/HUD';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Game />
      <HUD />
    </div>
  );
}
```

Make sure `body { margin: 0 }` in your global CSS.

---

## Step 4 — Ground

`src/game/Ground.tsx`:

```tsx
import { RigidBody } from '@react-three/rapier';

export function Ground() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[200, 1, 200]} />
        <meshStandardMaterial color="#8a8a7a" />
      </mesh>
    </RigidBody>
  );
}
```

A box, not a plane — gives the player something to walk on with thickness, so
the character controller doesn't have edge-case issues.

---

## Step 5 — Player

This is the highest-risk part of Phase 1. Use a `RigidBody` with `type="kinematicPosition"`
and Rapier's character controller. Two reasons not to use a dynamic body:

1. Dynamic + WASD = sliding, drift, weird tipping
2. Kinematic position = you have full control over movement; Rapier handles
   slope/step/wall resolution

`src/game/Player.tsx`:

```tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, CapsuleCollider, type RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';

import { PLAYER_SPEED, PLAYER_HEIGHT, PLAYER_RADIUS } from './constants';

export function Player() {
  const body = useRef<RapierRigidBody>(null);
  const [, getKeys] = useKeyboardControls();

  // reusable vectors to avoid GC pressure
  const direction = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!body.current) return;
    const { forward, backward, left, right } = getKeys();

    frontVector.current.set(0, 0, Number(backward) - Number(forward));
    sideVector.current.set(Number(left) - Number(right), 0, 0);
    direction.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()
      .multiplyScalar(PLAYER_SPEED * delta);

    const pos = body.current.translation();
    body.current.setNextKinematicTranslation({
      x: pos.x + direction.current.x,
      y: pos.y, // gravity handled by Rapier if we switch to dynamic later
      z: pos.z + direction.current.z,
    });
  });

  return (
    <RigidBody
      ref={body}
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
  );
}
```

`src/game/constants.ts`:

```ts
export const PLAYER_SPEED = 8;          // metres per second
export const PLAYER_HEIGHT = 1.0;       // capsule body height (not total)
export const PLAYER_RADIUS = 0.3;
export const CAMERA_DISTANCE = 6;
export const CAMERA_HEIGHT = 3;
export const CAMERA_LERP = 0.08;
```

**Note:** This Phase 1 player has no gravity and no jump yet. We're proving
movement first. We'll add gravity in Phase 2 once there's varied terrain.

---

## Step 6 — Follow camera

`src/game/FollowCamera.tsx`:

```tsx
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { CAMERA_DISTANCE, CAMERA_HEIGHT, CAMERA_LERP } from './constants';

export function FollowCamera() {
  const { camera, scene } = useThree();
  const target = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());

  useFrame(() => {
    // find the player by name; alternative is to pass a ref
    const player = scene.getObjectByName('player');
    if (!player) return;

    target.current.copy(player.position);
    desired.current.set(
      player.position.x,
      player.position.y + CAMERA_HEIGHT,
      player.position.z + CAMERA_DISTANCE,
    );

    camera.position.lerp(desired.current, CAMERA_LERP);
    camera.lookAt(target.current);
  });

  return null;
}
```

Add `name="player"` to the player's `<RigidBody>` so the camera can find it.

This is a basic chase camera — no rotation, no mouse look yet. Once movement
feels right, we'll layer on PointerLockControls for mouse-controlled yaw in
Phase 2.

---

## Step 7 — HUD with FPS

`src/state/useGameStore.ts`:

```ts
import { create } from 'zustand';

interface GameState {
  fps: number;
  setFps: (fps: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  fps: 0,
  setFps: (fps) => set({ fps }),
}));
```

`src/ui/HUD.tsx`:

```tsx
import { useGameStore } from '../state/useGameStore';

export function HUD() {
  const fps = useGameStore((s) => s.fps);
  return (
    <div style={{
      position: 'absolute',
      top: 12, left: 12,
      color: 'white',
      fontFamily: 'monospace',
      fontSize: 14,
      textShadow: '0 1px 2px rgba(0,0,0,0.6)',
      pointerEvents: 'none',
    }}>
      {fps.toFixed(0)} fps
    </div>
  );
}
```

FPS tracker — add a small component inside `<Canvas>`:

```tsx
// in Game.tsx, inside <Physics>
<FpsTracker />
```

```tsx
// src/game/FpsTracker.tsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { useGameStore } from '../state/useGameStore';

export function FpsTracker() {
  const setFps = useGameStore((s) => s.setFps);
  const frames = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frames.current++;
    const now = performance.now();
    if (now - lastTime.current >= 1000) {
      setFps(frames.current);
      frames.current = 0;
      lastTime.current = now;
    }
  });

  return null;
}
```

---

## Acceptance criteria for Phase 1

- [ ] Page loads, shows a grey plane and a salmon-coloured capsule
- [ ] WASD moves the capsule smoothly, no stutter
- [ ] Camera follows behind at a fixed offset
- [ ] FPS counter shows ~60 in the top left
- [ ] No console errors, no Rapier warnings
- [ ] Movement feels consistent regardless of frame rate

---

## Common gotchas

- **`useKeyboardControls` only works inside `<KeyboardControls>`.** If you
  get a null hook return, check the provider wrap.
- **Rapier WASM loading**: first load takes a moment. Add a Suspense
  fallback, even if it's just a black screen.
- **Camera at origin looking at origin**: nothing visible. Set camera
  initial position to something like `[0, 5, 10]` and verify lookAt works.
- **Shadows look bad / banded**: bump shadow-mapSize, adjust the directional
  light's shadow camera frustum so it tightly fits the scene.
- **Player falls through ground**: the ground RigidBody must be `type="fixed"`
  and the collider must be set up before Player mounts. Suspense handles this
  if both are inside it.

---

## What we're explicitly skipping until later

- Jumping and gravity (Phase 2 — needs varied terrain to be meaningful)
- Mouse-look / camera rotation (Phase 2)
- Animations (Phase 4+ — the capsule is fine for now)
- Sound (Phase 5)
- Touch controls (Phase 6, mobile pass)

Keep these out of Phase 1 even if tempted. The point is a clean, debuggable
movement foundation.
