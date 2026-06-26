import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

import { FollowCamera } from './FollowCamera'
import { FpsTracker } from './FpsTracker'
import { Gun } from './Gun'
import { isTouchDevice } from './mobileInput'
import { MobileControlsBridge } from './MobileControlsBridge'
import { Player } from './Player'
import { PointerLockBridge } from './PointerLockBridge'
import { Sword } from './Sword'
import { Bikes } from './hazards/Bikes'
import { Cars } from './hazards/Cars'
import { Tram } from './hazards/Tram'
import { PlayerStateSync } from './multiplayer/PlayerStateSync'
import { TestApiBridge } from './TestApiBridge'
import { RemotePlayers } from './multiplayer/RemotePlayers'
import { Tracers } from './multiplayer/Tracers'
import { Rats } from './npcs/Rats'
import { Statiegeld } from './npcs/Statiegeld'
import { Tourists } from './npcs/Tourists'
import { Panados } from './pickups/Panados'
import { AutoRespawn } from './systems/AutoRespawn'
import { CanalWater } from './systems/CanalWater'
import { HealthRegen } from './systems/HealthRegen'
import { Block } from './world/Block'
import { CanalLife } from './world/CanalLife'
import { Rain } from './world/Rain'
import { SkyDome } from './world/SkyDome'
import { StraightTramTracks } from './world/TramTracks'
import {
  BLOCK_LENGTH,
  TRAM_STOP_Z,
  X_TRAM_EAST,
  X_TRAM_WEST,
} from './world/constants'

const keyMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'yawLeft', keys: ['KeyQ'] },
  { name: 'yawRight', keys: ['KeyE'] },
]

export function Game() {
  // Phones run hot: skip the whole shadow pass (its own render of every
  // caster, every frame), skip MSAA, and cap the render resolution a
  // little lower. Desktop keeps the full look.
  const touch = isTouchDevice()
  return (
    <KeyboardControls map={keyMap}>
      <Canvas
        // 'percentage' = PCFShadowMap. R3F's bare `shadows` flag asks for
        // PCFSoftShadowMap, which three r184 deprecated — it logs a
        // warning and falls back to PCFShadowMap anyway, so this renders
        // identically minus the console noise.
        shadows={touch ? false : 'percentage'}
        camera={{ position: [0, 5, 12], fov: 60 }}
        dpr={touch ? [1, 1.25] : [1, 1.5]}
        gl={{ antialias: !touch }}
      >
        {/* fallback behind the SkyDome; matched to its horizon haze so any
          * uncovered pixel reads as sky, and to the fog so distant buildings
          * dissolve into the skyline rather than a hard band */}
        <color attach="background" args={['#dfe1d8']} />
        <fog attach="fog" args={['#dfe1d8', 60, 150]} />
        <Suspense fallback={null}>
          <Physics gravity={[0, -30, 0]}>
            <SkyDome />
            {/* warm key + cool fill: the directional sun stays warm while the
              * ambient/hemisphere fill is tinted cool, so sun-facing faces go
              * golden and shadow faces go blue-grey — the contrast that makes
              * the low-poly gables read. Costs nothing at runtime. */}
            <hemisphereLight args={['#fff0d5', '#4b5a64', 0.5]} />
            <ambientLight intensity={0.16} color="#9fb6c9" />
            <directionalLight
              position={[30, 40, 20]}
              intensity={1.85}
              color="#fff4d6"
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-camera-left={-40}
              shadow-camera-right={40}
              shadow-camera-top={40}
              shadow-camera-bottom={-40}
              shadow-camera-near={1}
              shadow-camera-far={80}
              shadow-bias={-0.0005}
            />
            <Block />
            <CanalLife />
            <Bikes />
            <Cars />
            {/* two-way tram line — straight tracks down both lanes */}
            <StraightTramTracks
              x={X_TRAM_WEST}
              z1={-BLOCK_LENGTH / 2}
              z2={BLOCK_LENGTH / 2}
            />
            <StraightTramTracks
              x={X_TRAM_EAST}
              z1={-BLOCK_LENGTH / 2}
              z2={BLOCK_LENGTH / 2}
            />
            {/* a single tram that pauses at the stop on the west median */}
            <Tram
              x={X_TRAM_WEST}
              startZ={10}
              startDirection={-1}
              stopZ={TRAM_STOP_Z}
            />
            <Tourists />
            <Statiegeld />
            <Rats />
            <Panados />
            <Rain />
            <Player />
            <Gun />
            <Sword />
            <RemotePlayers />
            <Tracers />
            <PlayerStateSync />
            <FollowCamera />
            <CanalWater />
            <HealthRegen />
            <AutoRespawn />
            <FpsTracker />
            <PointerLockBridge />
            <MobileControlsBridge />
            <TestApiBridge />
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}
