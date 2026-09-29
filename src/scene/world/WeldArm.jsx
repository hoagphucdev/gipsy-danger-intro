import { useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef } from 'react'
import { CylinderGeometry, MeshStandardMaterial, Vector3 } from 'three'
import { WELD_RIGS } from '../../config/world'
import { placeBetween } from '../../lib/ik'
import { createArm, poseArm } from '../../lib/weldArm'
import { armBaseOf } from '../../lib/weldRigs'

const { arm: ARM, colors } = WELD_RIGS
const torchGeometry = new CylinderGeometry(1, 1, 1, 10)
const torchMaterial = new MeshStandardMaterial({ color: colors.torch, roughness: 0.4, metalness: 0.8 })

/**
 * One KUKA arm on top of a rig tower, holding a torch against the robot.
 * ref.update(offset): move the torch tip to rig.point + offset (the arm follows by IK).
 */
export function WeldArm({ rig, template, spec, ref }) {
  const arm = useMemo(() => createArm(template, ARM.scale), [template])
  const base = useMemo(() => armBaseOf(rig), [rig])
  const torch = useRef()
  const tmp = useMemo(() => ({ tip: new Vector3(), flange: new Vector3() }), [])

  const update = useCallback(
    (offset) => {
      tmp.tip.copy(rig.point).add(offset)
      poseArm(arm, spec, base, tmp.tip, rig.normal, ARM.torch, tmp.flange)
      placeBetween(torch.current, tmp.flange, tmp.tip, ARM.torchRadius)
    },
    [arm, spec, base, rig, tmp],
  )
  useImperativeHandle(ref, () => ({ update }), [update])
  useLayoutEffect(() => update(rig.normal.clone()), [update, rig]) // first pose: torch 1 m off the surface

  return (
    <group>
      <primitive object={arm.group} />
      <mesh ref={torch} geometry={torchGeometry} material={torchMaterial} castShadow />
    </group>
  )
}
