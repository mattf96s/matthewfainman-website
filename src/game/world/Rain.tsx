import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { weatherState } from '../weatherState'

const DROP_COUNT = 350
const DROP_AREA_X = 80
const DROP_AREA_Z = 110
const DROP_TOP = 22
const DROP_BOTTOM = 0
const FALL_SPEED = 22
/** Random rain duration range, seconds. */
const RAIN_MIN = 18
const RAIN_MAX = 60
/** Random dry duration range, seconds. */
const DRY_MIN = 50
const DRY_MAX = 180

const _matrix = new THREE.Matrix4()
const _pos = new THREE.Vector3()
const _quat = new THREE.Quaternion()
const _scale = new THREE.Vector3(1, 1, 1)

/**
 * Random rain controller + instanced raindrop particles. Updates a
 * shared weatherState singleton so other components can react.
 */
export function Rain() {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  // initialise weather state once (re-mounts in dev reset it)
  if (weatherState.nextChangeAt === 0) {
    weatherState.raining = false
    weatherState.nextChangeAt =
      performance.now() + (DRY_MIN + Math.random() * (DRY_MAX - DRY_MIN)) * 1000
  }

  const drops = useMemo(
    () =>
      Array.from({ length: DROP_COUNT }, () => ({
        x: Math.random() * DROP_AREA_X - DROP_AREA_X / 2,
        y: Math.random() * (DROP_TOP - DROP_BOTTOM) + DROP_BOTTOM,
        z: Math.random() * DROP_AREA_Z - DROP_AREA_Z / 2,
      })),
    [],
  )

  useFrame((_, delta) => {
    const now = performance.now()

    if (now >= weatherState.nextChangeAt) {
      weatherState.raining = !weatherState.raining
      const seconds = weatherState.raining
        ? RAIN_MIN + Math.random() * (RAIN_MAX - RAIN_MIN)
        : DRY_MIN + Math.random() * (DRY_MAX - DRY_MIN)
      weatherState.nextChangeAt = now + seconds * 1000
    }

    const mesh = meshRef.current
    if (!mesh) return
    mesh.visible = weatherState.raining
    if (!weatherState.raining) return

    for (let i = 0; i < drops.length; i++) {
      const d = drops[i]!
      d.y -= FALL_SPEED * delta
      if (d.y < DROP_BOTTOM) {
        d.y = DROP_TOP + Math.random() * 4
        d.x = Math.random() * DROP_AREA_X - DROP_AREA_X / 2
        d.z = Math.random() * DROP_AREA_Z - DROP_AREA_Z / 2
      }
      _pos.set(d.x, d.y, d.z)
      _matrix.compose(_pos, _quat, _scale)
      mesh.setMatrixAt(i, _matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, DROP_COUNT]}
      frustumCulled={false}
    >
      <cylinderGeometry args={[0.018, 0.018, 0.45, 4]} />
      <meshBasicMaterial
        color="#bcd4ec"
        transparent
        opacity={0.55}
      />
    </instancedMesh>
  )
}
