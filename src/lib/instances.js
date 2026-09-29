import { Color, Object3D } from 'three'

const dummy = new Object3D()
const color = new Color()

/**
 * Write a list of transforms into an InstancedMesh.
 * item: { position: [x,y,z], rotation?: [x,y,z], rotationY?: number, scale?: [x,y,z], color?: string }
 */
export function writeInstances(mesh, items) {
  items.forEach((item, i) => {
    dummy.position.set(...item.position)
    dummy.rotation.set(...(item.rotation ?? [0, item.rotationY ?? 0, 0]))
    dummy.scale.set(...(item.scale ?? [1, 1, 1]))
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
    if (item.color) mesh.setColorAt(i, color.set(item.color))
  })
  mesh.count = items.length
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  mesh.computeBoundingSphere()
}
