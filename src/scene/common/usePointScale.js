import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

/**
 * Keeps `uScale` (pixels per metre at distance 1) and advances `uTime` on point materials,
 * so their shaders can size particles in world metres: gl_PointSize = size * uScale / depth.
 */
export function usePointScale(materials, timeScale = 1) {
  useFrame(({ camera, size }, dt) => {
    const scale = size.height / (2 * Math.tan(MathUtils.degToRad(camera.fov) / 2))
    for (const m of [].concat(materials)) {
      m.uniforms.uScale.value = scale
      if (m.uniforms.uTime) m.uniforms.uTime.value += dt * timeScale
    }
  })
}
