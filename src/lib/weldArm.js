import { Group, Vector3 } from 'three'
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { solveTwoBone } from './ik'
import { aimWorld, captureRest, findBones, resetToRest } from './skeleton'

// KUKA arm rig (assets-src/weld-arm, names sanitized by GLTFLoader).
// Rest pose: swivel base at the origin, upper arm up, forearm pointing along -X.
const JOINTS = {
  shoulder: /^Bone002_/,
  elbow: /^Bone003_/,
  wrist: /^Bone004_/,
  flange: /^Bone006_/,
}
const GRIPPER = /^(1|2|3|scale)(\d{3})?_Armature$/ // finger bones: collapsed, a torch replaces the gripper

const UP = new Vector3(0, 1, 0)
// scratch vectors (poseArm runs every frame for every arm)
const at = { shoulder: new Vector3(), elbow: new Vector3(), wrist: new Vector3(), flange: new Vector3() }
const goal = { elbow: new Vector3(), wrist: new Vector3(), tool: new Vector3() }
const from = new Vector3()
const to = new Vector3()

/** Arm dimensions in metres at `scale`, measured from the rest pose. */
export function measureArm(template, scale) {
  template.updateMatrixWorld(true)
  const bones = findBones(template, JOINTS)
  const pos = (b) => b.getWorldPosition(new Vector3()).multiplyScalar(scale)
  const [s, e, w, f] = [pos(bones.shoulder), pos(bones.elbow), pos(bones.wrist), pos(bones.flange)]
  return {
    shoulderHeight: s.y, // above the base plate
    upper: s.distanceTo(e),
    fore: e.distanceTo(w),
    flange: w.distanceTo(f), // wrist -> tool flange
  }
}

/** An independent, posable copy of the arm. */
export function createArm(template, scale) {
  const model = cloneSkinned(template)
  model.scale.setScalar(scale)
  model.traverse((o) => {
    if (o.isSkinnedMesh) {
      o.frustumCulled = false // bind-pose bounds are wrong once posed
      o.castShadow = true
    }
    if (o.isBone && GRIPPER.test(o.name)) o.scale.setScalar(1e-3)
  })
  const group = new Group()
  group.add(model)
  const bones = findBones(model, JOINTS)
  return { group, bones, rest: captureRest(bones) }
}

/**
 * Pose the arm standing at `base` (world position of its base plate) so the torch tip touches `tip`,
 * pointing into the surface (-normal). Yaw at the base, 2-bone IK for shoulder/elbow, wrist aims the tool.
 * Writes the flange world position into `outFlange` (where the torch starts).
 */
export function poseArm(arm, spec, base, tip, normal, torch, outFlange) {
  const { group, bones, rest } = arm
  group.position.copy(base)
  group.rotation.y = Math.atan2(tip.z - base.z, -(tip.x - base.x)) // rest forearm points along -X
  group.updateMatrixWorld(true)
  resetToRest(bones, rest)

  goal.wrist.copy(tip).addScaledVector(normal, spec.flange + torch)
  bones.shoulder.getWorldPosition(at.shoulder)
  bones.elbow.getWorldPosition(at.elbow)
  solveTwoBone(at.shoulder, goal.wrist, spec.upper, spec.fore, UP, goal.elbow)

  // shoulder: upper arm towards the IK elbow
  aimWorld(bones.shoulder, from.subVectors(at.elbow, at.shoulder), to.subVectors(goal.elbow, at.shoulder))
  // elbow: forearm towards the wrist goal
  bones.elbow.getWorldPosition(at.elbow)
  bones.wrist.getWorldPosition(at.wrist)
  aimWorld(bones.elbow, from.subVectors(at.wrist, at.elbow), to.subVectors(goal.wrist, at.elbow))
  // wrist: tool flange into the surface
  bones.wrist.getWorldPosition(at.wrist)
  bones.flange.getWorldPosition(at.flange)
  aimWorld(bones.wrist, from.subVectors(at.flange, at.wrist), goal.tool.copy(normal).negate())

  return bones.flange.getWorldPosition(outFlange)
}
