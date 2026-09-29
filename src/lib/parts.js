import { BufferAttribute, Vector3 } from 'three'
import { PARTS, TOUR } from '../config/tour'
import { findBones } from './skeleton'

export const NO_PART = 255
export const partId = (index) => (index === NO_PART ? null : PARTS[index].id)

/** Part index owning a bone: the first part whose rule matches the bone or its nearest ancestor. */
function partOfBone(bone) {
  for (let b = bone; b?.isBone; b = b.parent) {
    const i = PARTS.findIndex((p) => p.owns.some((re) => re.test(b.name)))
    if (i >= 0) return i
  }
  return NO_PART
}

/**
 * Split every skinned mesh of the robot by part, per triangle:
 * each triangle goes to the part of the bone that drives most of its vertices.
 * Triangles are regrouped so each part is one draw group; the geometry then carries
 *  - userData.groupParts: part index per draw group (-> one material per group)
 *  - userData.faceParts:  part index per triangle   (-> picking)
 */
export function splitByParts(root) {
  const bonePart = new Map()
  root.traverse((mesh) => {
    if (!mesh.isSkinnedMesh || mesh.geometry.userData.faceParts) return // geometries can be shared
    const parts = mesh.skeleton.bones.map((bone) => {
      if (!bonePart.has(bone)) bonePart.set(bone, partOfBone(bone))
      return bonePart.get(bone)
    })
    regroup(mesh.geometry, vertexParts(mesh.geometry, parts))
  })
}

function vertexParts(geometry, bonePartByIndex) {
  const { skinIndex, skinWeight } = geometry.attributes
  const out = new Uint8Array(skinIndex.count)
  for (let v = 0; v < skinIndex.count; v++) {
    let best = 0
    for (let k = 1; k < 4; k++) if (skinWeight.getComponent(v, k) > skinWeight.getComponent(v, best)) best = k
    out[v] = bonePartByIndex[skinIndex.getComponent(v, best)]
  }
  return out
}

function regroup(geometry, vertexPart) {
  const src = geometry.index.array
  const faces = src.length / 3
  const facePart = new Uint8Array(faces)
  for (let f = 0; f < faces; f++) {
    const [a, b, c] = [vertexPart[src[f * 3]], vertexPart[src[f * 3 + 1]], vertexPart[src[f * 3 + 2]]]
    facePart[f] = b === c ? b : a // majority of the three vertices
  }

  const order = Array.from({ length: faces }, (_, f) => f).sort((x, y) => facePart[x] - facePart[y] || x - y)
  const index = new src.constructor(src.length)
  const faceParts = new Uint8Array(faces)
  order.forEach((f, i) => {
    index.set(src.subarray(f * 3, f * 3 + 3), i * 3)
    faceParts[i] = facePart[f]
  })
  geometry.setIndex(new BufferAttribute(index, 1))

  geometry.clearGroups()
  const groupParts = []
  for (let start = 0, i = 1; i <= faces; i++) {
    if (i < faces && faceParts[i] === faceParts[start]) continue
    geometry.addGroup(start * 3, (i - start) * 3, groupParts.length)
    groupParts.push(faceParts[start])
    start = i
  }
  geometry.userData.faceParts = faceParts
  geometry.userData.groupParts = groupParts
}

/** Camera stop per part, from bone world positions + config offsets. Call after the model is mounted. */
export function computeStops(root) {
  root.updateWorldMatrix(true, true)
  const bones = findBones(root, Object.fromEntries(PARTS.map((p) => [p.id, p.anchor])))
  return PARTS.map((p) => {
    const target = bones[p.id].getWorldPosition(new Vector3()).add(new Vector3(...p.target))
    return { target, position: target.clone().addScaledVector(new Vector3(...p.camera), TOUR.zoom) }
  })
}
