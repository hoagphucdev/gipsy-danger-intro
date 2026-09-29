import { EMISSIVE_INTENSITY, MATERIAL_OVERRIDES } from '../config/model'

/** One-time setup of meshes and materials after the GLB is loaded. Safe to call twice. */
export function prepareModel(root) {
  root.traverse((o) => {
    if (!o.isMesh) return
    o.castShadow = true
    o.receiveShadow = true
    // bind-pose bounds are wrong once bones move -> never cull skinned parts
    if (o.isSkinnedMesh) o.frustumCulled = false
    for (const mat of [].concat(o.material)) prepareMaterial(mat)
  })
}

function prepareMaterial(mat) {
  Object.assign(mat, MATERIAL_OVERRIDES[mat.name])
  if (mat.emissiveMap) mat.emissiveIntensity = EMISSIVE_INTENSITY
  // glow cards / glass must not hide what is behind them
  if (mat.transparent) mat.depthWrite = false
}
