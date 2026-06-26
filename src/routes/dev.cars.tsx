import { useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { Group } from 'three'

import { ClientOnly } from '../components/ClientOnly'
import { CarBody, type CarShape } from '../game/hazards/CarBodies'

/**
 * A tiny model showroom (not linked anywhere) for iterating on the
 * procedural car designs in isolation: studio lighting, a turntable, and
 * a neutral backdrop. Drag to orbit. The Playwright `model-shots` spec
 * drives it with `?model=&view=&spin=0` to capture deterministic stills.
 */
type View = 'front' | 'side' | 'rear' | 'top'

const VIEWS: readonly View[] = ['front', 'side', 'rear', 'top']

const CAMERAS: Record<View, [number, number, number]> = {
  front: [4.8, 2.6, 5.6],
  side: [7.8, 1.6, 0.3],
  rear: [4.8, 2.6, -5.6],
  top: [3.6, 5.8, 4.2],
}

interface CarsSearch {
  model: CarShape | 'both'
  view: View
  spin: boolean
}

export const Route = createFileRoute('/dev/cars')({
  validateSearch: (search: Record<string, unknown>): CarsSearch => ({
    model:
      search.model === 'microcar' || search.model === 'both'
        ? search.model
        : 'tesla',
    view: VIEWS.includes(search.view as View) ? (search.view as View) : 'front',
    spin: !(search.spin === '0' || search.spin === false),
  }),
  component: DevCars,
})

function DevCars() {
  const { model, view, spin } = Route.useSearch()
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#2b2e33' }}>
      <ClientOnly>
        <Canvas
          shadows
          camera={{ position: CAMERAS[view], fov: 32 }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#2b2e33']} />
          <Studio />
          <Turntable spin={spin}>
            {model === 'both' ? (
              <>
                <group position={[-1.7, 0, 0]}>
                  <CarBody shape="tesla" color="#e9e9ec" registerTailMat={NOOP} />
                </group>
                <group position={[2.0, 0, 0]}>
                  <CarBody shape="microcar" color="#8f9478" registerTailMat={NOOP} />
                </group>
              </>
            ) : (
              <CarBody
                shape={model}
                color={model === 'microcar' ? '#8f9478' : '#e9e9ec'}
                registerTailMat={NOOP}
              />
            )}
          </Turntable>
          <Ground />
          <OrbitControls target={[0, 0.6, 0]} makeDefault />
        </Canvas>
      </ClientOnly>
    </div>
  )
}

const NOOP = () => {}

function Studio() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <hemisphereLight args={['#ffffff', '#3a3d42', 0.45]} />
      <directionalLight
        position={[5, 8, 6]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.6} color="#cfe0ff" />
    </>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#35383d" roughness={0.95} />
    </mesh>
  )
}

function Turntable({ spin, children }: { spin: boolean; children: React.ReactNode }) {
  const ref = useRef<Group>(null)
  useFrame((_, dt) => {
    if (spin && ref.current) ref.current.rotation.y += dt * 0.4
  })
  return <group ref={ref}>{children}</group>
}
