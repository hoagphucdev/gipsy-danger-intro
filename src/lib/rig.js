import { BONES, IDLE } from '../config/motion'
import { AXIS, captureRest, findBones, resetToRest, rotateWorld } from './skeleton'

/** Bones + rest pose of the robot. */
export function createRig(model) {
  const bones = findBones(model, BONES)
  return { bones, rest: captureRest(bones) }
}

/** Standing still: slow breathing in the chest. */
export function applyIdle(rig, time) {
  resetToRest(rig.bones, rig.rest)
  rotateWorld(rig.bones.chest, AXIS.X, IDLE.breath * Math.sin(time * IDLE.breathSpeed))
}
