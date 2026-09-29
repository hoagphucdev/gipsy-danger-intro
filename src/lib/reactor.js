import { ShaderChunk, Vector2 } from 'three'
import { REACTOR } from '../config/model'
import { patchShader } from './shaderPatch'

/**
 * The chest reactor is painted into the body texture, so it spins in UV space: every texture
 * lookup inside the reactor disc is rotated around its centre. The angle fades to zero at the
 * rim, so the housing stays still and there is no seam (the fade reads as a vortex).
 * Returns the shared uniforms ({ uReactorAngle, ... }) of all patched materials.
 */
export function addReactorSpin(root) {
  const uniforms = {
    uReactorAngle: { value: 0 },
    uReactorCenter: { value: new Vector2(...REACTOR.uvCenter) },
    uReactorRadius: { value: REACTOR.uvRadius },
  }
  const done = new Set()
  root.traverse((mesh) => {
    if (!mesh.isMesh) return
    for (const material of [].concat(mesh.material)) {
      if (material.name !== REACTOR.material || done.has(material)) continue
      done.add(material)
      patchShader(material, 'reactor-spin', (shader) => spinUvs(shader, uniforms))
    }
  })
  return uniforms
}

const ROTATE_UV = /* glsl */ `
uniform float uReactorAngle;
uniform vec2 uReactorCenter;
uniform float uReactorRadius;
vec2 reactorUv(vec2 uv) {
  vec2 d = uv - uReactorCenter;
  float a = uReactorAngle * (1.0 - smoothstep(0.8, 1.0, length(d) / uReactorRadius));
  float s = sin(a), c = cos(a);
  return uReactorCenter + mat2(c, -s, s, c) * d;
}`

// texture lookups to rotate: [chunk, uv varying it samples with]
const LOOKUPS = [
  ['map_fragment', 'vMapUv'],
  ['emissivemap_fragment', 'vEmissiveMapUv'],
  ['normal_fragment_maps', 'vNormalMapUv'],
]

function spinUvs(shader, uniforms) {
  Object.assign(shader.uniforms, uniforms)
  let fs = shader.fragmentShader.replace('#include <common>', `#include <common>\n${ROTATE_UV}`)
  for (const [chunk, uv] of LOOKUPS) {
    fs = fs.replace(`#include <${chunk}>`, ShaderChunk[chunk].replaceAll(uv, `reactorUv( ${uv} )`))
  }
  shader.fragmentShader = fs
}
