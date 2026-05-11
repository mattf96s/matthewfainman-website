import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

import { FollowCamera } from './FollowCamera'
import { FpsTracker } from './FpsTracker'
import { Player } from './Player'
import { PointerLockBridge } from './PointerLockBridge'
import { Bikes } from './hazards/Bikes'
import { Cars } from './hazards/Cars'
import { PathTram, type TramPath } from './hazards/PathTram'
import { Tram } from './hazards/Tram'
import { Statiegeld } from './npcs/Statiegeld'
import { Tourists } from './npcs/Tourists'
import { ScoreTimer } from './systems/ScoreTimer'
import { Block } from './world/Block'
import { CanalLife } from './world/CanalLife'
import { Rain } from './world/Rain'
import { StraightTramTracks, TramTracks } from './world/TramTracks'
import {
  BLOCK_LENGTH,
  X_TRAM_EAST,
  X_TRAM_WEST,
  Z_CROSS_LANE_SOUTH,
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

// Tram that takes the corner: north up the east tram lane of the main
// road, arcs right at the intersection, continues east on the cross-
// street's south lane. Reverses at the end for the return trip.
const TURN_RADIUS = 8
const L_PATH: TramPath = [
  {
    kind: 'straight',
    x1: X_TRAM_EAST,
    z1: -46,
    x2: X_TRAM_EAST,
    z2: Z_CROSS_LANE_SOUTH - TURN_RADIUS,
  },
  {
    kind: 'arc',
    cx: X_TRAM_EAST + TURN_RADIUS,
    cz: Z_CROSS_LANE_SOUTH - TURN_RADIUS,
    radius: TURN_RADIUS,
    startAngle: Math.PI,
    endAngle: Math.PI / 2,
  },
  {
    kind: 'straight',
    x1: X_TRAM_EAST + TURN_RADIUS,
    z1: Z_CROSS_LANE_SOUTH,
    x2: 18,
    z2: Z_CROSS_LANE_SOUTH,
  },
]

export function Game() {
  return (
    <KeyboardControls map={keyMap}>
      <Canvas shadows camera={{ position: [0, 5, 12], fov: 60 }}>
        <color attach="background" args={['#cdd9d5']} />
        <fog attach="fog" args={['#cdd9d5', 60, 140]} />
        <Suspense fallback={null}>
          <Physics gravity={[0, -30, 0]}>
            <hemisphereLight args={['#ffe6c2', '#3a3e3a', 0.45]} />
            <ambientLight intensity={0.15} />
            <directionalLight
              position={[30, 40, 20]}
              intensity={1.7}
              color="#fff4d6"
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-camera-left={-40}
              shadow-camera-right={40}
              shadow-camera-top={40}
              shadow-camera-bottom={-40}
              shadow-camera-near={1}
              shadow-camera-far={120}
              shadow-bias={-0.0005}
            />
            <Block />
            <CanalLife />
            <Bikes />
            <Cars />
            {/* tram tracks */}
            <StraightTramTracks
              x={X_TRAM_WEST}
              z1={-BLOCK_LENGTH / 2}
              z2={BLOCK_LENGTH / 2}
            />
            <TramTracks path={L_PATH} />
            {/* west tram lane: bouncing N-S */}
            <Tram x={X_TRAM_WEST} startZ={10} startDirection={-1} />
            {/* east tram lane: takes the corner onto the cross-street */}
            <PathTram path={L_PATH} speed={7} endDwell={10} startOffset={5} />
            <Tourists />
            <Statiegeld />
            <Rain />
            <Player />
            <FollowCamera />
            <ScoreTimer />
            <FpsTracker />
            <PointerLockBridge />
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}
