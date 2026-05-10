import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

import { FollowCamera } from './FollowCamera'
import { FpsTracker } from './FpsTracker'
import { Player } from './Player'
import { PointerLockBridge } from './PointerLockBridge'
import { Block } from './world/Block'

const keyMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
]

export function Game() {
  return (
    <KeyboardControls map={keyMap}>
      <Canvas shadows camera={{ position: [0, 5, 12], fov: 60 }}>
        <color attach="background" args={['#cdd9d5']} />
        <fog attach="fog" args={['#cdd9d5', 60, 140]} />
        <Suspense fallback={null}>
          <Physics gravity={[0, -30, 0]}>
            <hemisphereLight
              args={['#ffe6c2', '#3a3e3a', 0.45]}
            />
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
            <Player />
            <FollowCamera />
            <FpsTracker />
            <PointerLockBridge />
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}
