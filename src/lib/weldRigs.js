import { Vector3 } from 'three'
import { box, braceXY, braceYZ, poleX, poleY, poleZ } from './primitives'
import { createRandom } from './random'

/** Where the arm's base plate sits: on the tower's top carriage. */
export const armBaseOf = (rig) => new Vector3(rig.base.x, rig.height + 1, rig.base.z)

/**
 * Plan the welding rigs. For each target part: cast a ray from outside at the part (random height
 * and side angle) until it lands on that part; the tower stands back from the hit point and must
 * clear the robot, the other towers and the camera, with the arm able to reach.
 * picker: lib/picking.js (intersect); arm: measured arm (lib/weldArm measureArm).
 * Returns [{ part, point, normal, base, height }].
 */
export function planWeldRigs(picker, cfg, arm) {
  const rnd = createRandom(cfg.seed)
  const origin = new Vector3()
  const aim = new Vector3()
  const direction = new Vector3()
  const rigs = []

  cfg.targets.forEach((part, i) => {
    const side = i % 2 ? 1 : -1 // alternate sides for balance
    for (let attempt = 0; attempt < 80; attempt++) {
      const angle = side * rnd.range(...cfg.angles) // 0 = coming from straight in front (+Z)
      const y = rnd.range(...cfg.heights[part])
      aim.set(side * cfg.aim[part][0], y, cfg.aim[part][1])
      origin.set(aim.x + Math.sin(angle) * 80, y, aim.z + Math.cos(angle) * 80)
      direction.subVectors(aim, origin).normalize()
      const hit = picker.intersect(origin, direction)
      if (!hit || hit.part !== part) continue

      const base = hit.point.clone().addScaledVector(direction, -rnd.range(...cfg.standoff)).setY(0)
      const height = Math.max(0.8, hit.point.y + cfg.mountAbove) // low weld points get a short plinth
      const rig = { part, point: hit.point, normal: hit.normal, base, height }
      if (isClear(rig, rigs, picker, cfg, arm)) {
        rigs.push(rig)
        break
      }
    }
  })
  return rigs
}

const DOWN = new Vector3(0, -1, 0)

function isClear(rig, placed, picker, cfg, arm) {
  const { base, height } = rig
  if (Math.abs(base.x) > cfg.keepOut.x || base.z > cfg.keepOut.zFront) return false
  if (placed.some((r) => r.base.distanceTo(base) < cfg.truss.size * 3)) return false
  // arm must reach the wrist position in front of the weld point
  const wrist = rig.point.clone().addScaledVector(rig.normal, arm.flange + cfg.arm.torch)
  const shoulder = armBaseOf(rig).setY(rig.height + 1 + arm.shoulderHeight)
  if (shoulder.distanceTo(wrist) > arm.upper + arm.fore - 0.3) return false
  // the tower column (centre + corners) must not pass through the robot
  const h = cfg.truss.size
  for (const [dx, dz] of [[0, 0], [h, h], [h, -h], [-h, h], [-h, -h]]) {
    const top = new Vector3(base.x + dx, height + 3, base.z + dz)
    if (picker.intersect(top, DOWN)) return false
  }
  return true
}

/** Lattice towers under the rigs: 4 chords, a ring per segment, alternating face diagonals, plates. */
export function rigFrameLayout(rigs, { truss }) {
  const members = []
  const plates = []
  const { size, segment, chord, lace } = truss
  const h = size / 2

  for (const { base, height } of rigs) {
    const [x0, x1, z0, z1] = [base.x - h, base.x + h, base.z - h, base.z + h]
    for (const x of [x0, x1]) for (const z of [z0, z1]) members.push(poleY(x, 0, height, z, chord))

    const levels = Math.max(1, Math.round(height / segment))
    const step = height / levels
    for (let l = 1; l <= levels; l++) {
      const y = l * step
      const y0 = y - step
      members.push(poleX(x0, x1, y, z0, lace), poleX(x0, x1, y, z1, lace), poleZ(x0, y, z0, z1, lace), poleZ(x1, y, z0, z1, lace))
      const flip = l % 2
      members.push(
        braceXY(flip ? x0 : x1, flip ? x1 : x0, y0, y, z0, lace),
        braceXY(flip ? x1 : x0, flip ? x0 : x1, y0, y, z1, lace),
        braceYZ(x0, y0, y, flip ? z0 : z1, flip ? z1 : z0, lace),
        braceYZ(x1, y0, y, flip ? z1 : z0, flip ? z0 : z1, lace),
      )
    }
    plates.push(box([base.x, 0.2, base.z], [size * 2.2, 0.4, size * 2.2])) // floor plate
    plates.push(box([base.x, height + 0.5, base.z], [size * 1.4, 1, size * 1.4])) // top carriage
  }
  return { members, plates }
}

const _up = new Vector3(0, 1, 0)
const _seam = new Vector3()

/**
 * Torch tip offset from the rig's weld point at time t: travels back and forth along a
 * horizontal seam on the surface, and stands `lift` metres off it (lifted while idle).
 */
export function torchOffset(rig, index, t, lift, { seam }, out) {
  _seam.crossVectors(rig.normal, _up)
  if (_seam.lengthSq() < 1e-6) _seam.set(1, 0, 0)
  _seam.normalize()
  const travel = Math.sin(t * seam.speed * Math.PI * 2 + index * 1.7) * seam.length * 0.5
  return out.copy(_seam).multiplyScalar(travel).addScaledVector(rig.normal, lift)
}
