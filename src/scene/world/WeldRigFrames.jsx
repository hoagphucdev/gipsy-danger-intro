import { useMemo } from 'react'
import { WELD_RIGS } from '../../config/world'
import { rigFrameLayout } from '../../lib/weldRigs'
import { InstancedItems } from '../common/InstancedItems'

/** Lattice towers of every welding rig: one draw call for all members, one for the plates. */
export function WeldRigFrames({ rigs }) {
  const { members, plates } = useMemo(() => rigFrameLayout(rigs, WELD_RIGS), [rigs])
  const { colors } = WELD_RIGS

  return (
    <group>
      <InstancedItems items={members} castShadow>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color={colors.frame} roughness={0.5} metalness={0.7} />
      </InstancedItems>
      <InstancedItems items={plates} castShadow receiveShadow>
        <boxGeometry />
        <meshStandardMaterial color={colors.head} roughness={0.6} metalness={0.6} />
      </InstancedItems>
    </group>
  )
}
