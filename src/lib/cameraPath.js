import { CatmullRomCurve3, Vector3 } from 'three'

/** Smooth camera move through keyframes { position, target }. at(t) with t in [0, 1]. */
export function createCameraPath(keys) {
  const curve = (field) => new CatmullRomCurve3(keys.map((k) => new Vector3(...k[field])), false, 'centripetal')
  const positions = curve('position')
  const targets = curve('target')
  return {
    at(t, position, target) {
      positions.getPoint(t, position)
      targets.getPoint(t, target)
    },
  }
}
