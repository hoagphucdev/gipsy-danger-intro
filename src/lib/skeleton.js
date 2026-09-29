import { Quaternion, Vector3 } from 'three'

export const AXIS = { X: new Vector3(1, 0, 0), Y: new Vector3(0, 1, 0), Z: new Vector3(0, 0, 1) }

/** Find bones by regex. patterns: { key: RegExp } -> { key: Bone } */
export function findBones(root, patterns) {
  const bones = {}
  root.traverse((o) => {
    if (!o.isBone) return
    for (const [key, re] of Object.entries(patterns)) if (!bones[key] && re.test(o.name)) bones[key] = o
  })
  const missing = Object.keys(patterns).filter((k) => !bones[k])
  if (missing.length) console.warn('[skeleton] missing bones:', missing)
  return bones
}

export function captureRest(bones) {
  return Object.fromEntries(
    Object.entries(bones).map(([k, b]) => [k, { quaternion: b.quaternion.clone(), position: b.position.clone() }]),
  )
}

export function resetToRest(bones, rest) {
  for (const [k, b] of Object.entries(bones)) {
    b.quaternion.copy(rest[k].quaternion)
    b.position.copy(rest[k].position)
  }
}

const _q = new Quaternion()
const _pq = new Quaternion()
const _v = new Vector3()

/**
 * Rotate a bone about a WORLD axis through its pivot, on top of its current rotation.
 * Works regardless of how each bone's local axes are oriented in the rig.
 */
export function rotateWorld(bone, worldAxis, angle) {
  if (!angle) return
  bone.parent.getWorldQuaternion(_pq)
  _v.copy(worldAxis).applyQuaternion(_pq.invert())
  bone.quaternion.premultiply(_q.setFromAxisAngle(_v, angle))
}

const _from = new Vector3()
const _to = new Vector3()
const _wq = new Quaternion()

/** Rotate a bone (about its pivot) so that world direction `from` turns into world direction `to`. */
export function aimWorld(bone, from, to) {
  _wq.setFromUnitVectors(_from.copy(from).normalize(), _to.copy(to).normalize())
  bone.parent.getWorldQuaternion(_pq)
  // world delta -> parent space: P^-1 * delta * P, applied before the bone's own rotation
  _q.copy(_pq).invert().multiply(_wq).multiply(_pq)
  bone.quaternion.premultiply(_q)
}
