import { TOUR } from '../config/tour'
import { collectBodygroups } from './bodygroups'
import { isolatePartMaterials } from './highlight'
import { splitByParts } from './parts'
import { prepareModel } from './prepareModel'
import { addReactorSpin } from './reactor'

/**
 * One-time preparation of the loaded GLB, in a fixed order:
 * materials/shadows -> bodygroups -> split triangles by part -> per-part material copies with highlight
 * -> reactor spin on the chest material copies.
 * Cached on the scene, so repeated calls (StrictMode, remounts) are free.
 */
export function setupRobot(scene) {
  if (scene.userData.setup) return scene.userData.setup
  prepareModel(scene)
  const groups = collectBodygroups(scene)
  splitByParts(scene)
  const highlights = isolatePartMaterials(scene, TOUR.highlight)
  const reactor = addReactorSpin(scene) // after the copies exist, so every copy spins
  scene.userData.setup = { groups, highlights, reactor }
  return scene.userData.setup
}
