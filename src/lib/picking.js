import { BufferAttribute, BufferGeometry, DoubleSide, Mesh, MeshBasicMaterial, Raycaster, Vector3 } from 'three'
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'
import { partId } from './parts'

const proxyMaterial = new MeshBasicMaterial({ side: DoubleSide })

/**
 * Fast part picking for the (standing) robot.
 * Raycasting a SkinnedMesh re-skins every triangle on every test, and three.js also tests hidden meshes.
 * Instead, each part-split mesh is baked once, in its current pose, into a static world-space proxy
 * with a BVH; picking only tests proxies whose source mesh is currently shown.
 * The part comes from the hit triangle (geometry.userData.faceParts, see splitByParts).
 */
export function createPicker(root) {
  // updateMatrixWorld (not updateWorldMatrix): SkinnedMesh refreshes its bindMatrixInverse only there
  root.parent?.updateWorldMatrix(true, false)
  root.updateMatrixWorld(true)
  const proxies = []
  root.traverse((mesh) => {
    if (mesh.isMesh && mesh.geometry.userData.faceParts) proxies.push(bakeProxy(mesh))
  })

  const raycaster = new Raycaster()
  raycaster.firstHitOnly = true
  const hits = []

  const nearestHit = () => {
    let best = null
    for (const proxy of proxies) {
      if (!isShown(proxy.userData.source)) continue
      hits.length = 0
      proxy.raycast(raycaster, hits)
      if (hits[0] && (!best || hits[0].distance < best.distance)) best = hits[0]
    }
    return best
  }
  const partOf = (hit) => partId(hit.object.userData.faceParts[hit.faceIndex])

  return {
    /** Part id under a pointer in normalized device coordinates, or null. */
    pick(ndc, camera) {
      raycaster.setFromCamera(ndc, camera)
      const hit = nearestHit()
      return hit ? partOf(hit) : null
    },
    /** First surface hit along a world-space ray: { point, normal (facing the ray), part } or null. */
    intersect(origin, direction) {
      raycaster.set(origin, direction)
      const hit = nearestHit()
      if (!hit) return null
      const normal = hit.face.normal.clone()
      if (normal.dot(direction) > 0) normal.negate()
      return { point: hit.point.clone(), normal, part: partOf(hit) }
    },
    dispose() {
      for (const proxy of proxies) proxy.geometry.dispose()
    },
  }
}

const v = new Vector3()

function bakeProxy(mesh) {
  const source = mesh.geometry.attributes.position
  const baked = new Float32Array(source.count * 3)
  for (let i = 0; i < source.count; i++) {
    v.fromBufferAttribute(source, i)
    if (mesh.isSkinnedMesh) mesh.applyBoneTransform(i, v) // -> mesh local space, posed
    v.applyMatrix4(mesh.matrixWorld)
    baked[i * 3] = v.x
    baked[i * 3 + 1] = v.y
    baked[i * 3 + 2] = v.z
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(baked, 3))
  if (mesh.geometry.index) geometry.setIndex(mesh.geometry.index)
  // indirect: keep the triangle order, so faceIndex still matches faceParts
  geometry.boundsTree = new MeshBVH(geometry, { indirect: true })

  const proxy = new Mesh(geometry, proxyMaterial)
  proxy.raycast = acceleratedRaycast
  proxy.userData = { faceParts: mesh.geometry.userData.faceParts, source: mesh }
  return proxy
}

function isShown(object) {
  for (let o = object; o; o = o.parent) if (!o.visible) return false
  return true
}
