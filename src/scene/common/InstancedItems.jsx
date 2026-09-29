import { useImperativeHandle, useLayoutEffect, useRef } from 'react'
import { writeInstances } from '../../lib/instances'

/**
 * One draw call for many copies. Pass geometry + material as children.
 * <InstancedItems items={layout}><boxGeometry /><meshStandardMaterial /></InstancedItems>
 * `ref` exposes the InstancedMesh for per-frame updates.
 */
export function InstancedItems({ items, children, ref, ...props }) {
  const mesh = useRef()
  useImperativeHandle(ref, () => mesh.current)
  useLayoutEffect(() => writeInstances(mesh.current, items), [items])
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, items.length]} {...props}>
      {children}
    </instancedMesh>
  )
}
