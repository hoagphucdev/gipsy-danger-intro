import { Quaternion, Vector3 } from 'three'

const _dir = new Vector3()
const _axis = new Vector3()
const _q = new Quaternion()

/**
 * Two-bone IK: where the elbow goes so that shoulder->elbow (upper) and elbow->wrist (fore)
 * reach `wrist`, bending towards `pole`. Unreachable targets are clamped to full stretch.
 */
export function solveTwoBone(shoulder, wrist, upper, fore, pole, outElbow) {
  _dir.subVectors(wrist, shoulder)
  const d = Math.min(Math.max(_dir.length(), 1e-4), upper + fore - 1e-4)
  _dir.normalize()
  const cos = (upper * upper + d * d - fore * fore) / (2 * upper * d)
  const angle = Math.acos(Math.min(1, Math.max(-1, cos)))
  _axis.crossVectors(_dir, pole)
  if (_axis.lengthSq() < 1e-8) _axis.set(1, 0, 0)
  _q.setFromAxisAngle(_axis.normalize(), angle) // rotates the reach direction towards the pole
  return outElbow.copy(_dir).applyQuaternion(_q).multiplyScalar(upper).add(shoulder)
}

const _up = new Vector3(0, 1, 0)

/** Orient a unit (1 m along Y) mesh so it spans a -> b with the given thickness. */
export function placeBetween(object, a, b, thickness) {
  _dir.subVectors(b, a)
  const length = _dir.length()
  object.position.addVectors(a, b).multiplyScalar(0.5)
  object.quaternion.setFromUnitVectors(_up, _dir.divideScalar(length || 1))
  object.scale.set(thickness, length, thickness)
}
