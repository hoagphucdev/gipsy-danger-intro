import { Color } from 'three'
import { NO_PART, partId } from './parts'
import { patchShader } from './shaderPatch'

/**
 * After splitByParts: give every draw group a material copy for its part (the originals are
 * shared across parts), patched with a fresnel rim glow driven by `uniforms.uHighlight` (0..1).
 * Returns { [partId]: uniforms[] } for animating the glow.
 */
export function isolatePartMaterials(root, { color }) {
  const copies = new Map() // `${part}|${uuid}` -> material
  const byPart = {}

  const copyFor = (part, base) => {
    const key = `${part}|${base.uuid}`
    if (!copies.has(key)) {
      const material = base.clone()
      const uniforms = { uHighlight: { value: 0 }, uHighlightColor: { value: new Color(color) } }
      addRimGlow(material, uniforms)
      copies.set(key, material)
      ;(byPart[part] ??= []).push(uniforms)
    }
    return copies.get(key)
  }

  root.traverse((mesh) => {
    const groupParts = mesh.isMesh && mesh.geometry.userData.groupParts
    if (!groupParts) return
    const base = mesh.material
    mesh.material = groupParts.map((p) => (p === NO_PART ? base : copyFor(partId(p), base)))
  })
  return byPart
}

function addRimGlow(material, uniforms) {
  patchShader(material, 'part-highlight', (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uHighlight;\nuniform vec3 uHighlightColor;')
      .replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
        float rim = 1.0 - abs(dot(normalize(normal), normalize(vViewPosition)));
        gl_FragColor.rgb += uHighlightColor * (0.12 + rim * rim) * uHighlight;`,
      )
  })
}
