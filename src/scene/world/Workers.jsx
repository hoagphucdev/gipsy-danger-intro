import { useMemo } from 'react'
import { WORKERS } from '../../config/world'
import { workerLayout } from '../../lib/hangarLayout'
import { InstancedItems } from '../common/InstancedItems'

/** Crew figures (~1.8 m) with coloured hard hats — the scale reference next to the robot. */
export function Workers({ items: given }) {
  const items = useMemo(() => given ?? workerLayout(), [given])
  const helmets = useMemo(
    () => items.map(({ position: [x, y, z], scale = [1, 1, 1], helmet }) => ({ position: [x, y + 1.72 * scale[1], z], color: helmet })),
    [items],
  )

  return (
    <group>
      <InstancedItems items={items} castShadow>
        <capsuleGeometry args={[0.26, 1.15, 4, 8]} onUpdate={(g) => g.translate(0, 0.84, 0)} />
        <meshStandardMaterial color={WORKERS.body} roughness={0.9} />
      </InstancedItems>
      <InstancedItems items={helmets}>
        <sphereGeometry args={[0.2, 10, 6]} />
        <meshStandardMaterial roughness={0.4} />
      </InstancedItems>
    </group>
  )
}
