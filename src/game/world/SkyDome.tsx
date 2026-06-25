import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * A cheap atmospheric sky: one inverted sphere with a per-fragment vertical
 * ramp from a pale-blue zenith down to a warm horizon haze. The flat
 * background colour it replaces was the largest, dullest surface in the
 * scene; this costs a single draw call, no textures.
 *
 * Fog is disabled on the dome so the gradient survives at distance, and the
 * dome rides the camera so the horizon band stays put as the player moves.
 * The horizon colour is matched to the scene fog (see Game.tsx) so distant
 * buildings dissolve into the haze instead of a hard line.
 *
 * Both colours are deliberately tunable — nudge them to taste.
 */
const ZENITH = '#a9c6e0'
const HORIZON = '#dfe1d8'

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vDir;
  uniform vec3 zenith;
  uniform vec3 horizon;
  void main() {
    // horizon haze at the equator, fading up to the zenith blue; the 0.5
    // exponent keeps the warm band a thin strip near the skyline
    float t = pow(clamp(vDir.y, 0.0, 1.0), 0.5);
    gl_FragColor = vec4(mix(horizon, zenith, t), 1.0);
  }
`

export function SkyDome() {
  const ref = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          zenith: { value: new THREE.Color(ZENITH) },
          horizon: { value: new THREE.Color(HORIZON) },
        },
        vertexShader,
        fragmentShader,
      }),
    [],
  )

  // keep the dome centred on the camera so its centre never drifts off the
  // viewer; copy avoids a per-frame allocation
  useFrame(() => {
    if (ref.current) ref.current.position.copy(camera.position)
  })

  return (
    <mesh ref={ref} material={material} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[480, 32, 16]} />
    </mesh>
  )
}
