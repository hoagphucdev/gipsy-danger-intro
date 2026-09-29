import { useMemo } from 'react'
import { SCAFFOLD } from '../../config/world'
import { scaffoldLayout } from '../../lib/hangarLayout'
import { InstancedItems } from '../common/InstancedItems'

/** Two scaffold towers beside the dock. */
export function Scaffolding() {
  const { colors } = SCAFFOLD
  const { poles, decks, rails, lamps } = useMemo(scaffoldLayout, [])

  return (
    <group>
      <InstancedItems items={poles} castShadow>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color={colors.steel} roughness={0.45} metalness={0.7} />
      </InstancedItems>
      <InstancedItems items={decks} castShadow receiveShadow>
        <boxGeometry />
        <meshStandardMaterial color={colors.deck} roughness={0.9} />
      </InstancedItems>
      <InstancedItems items={rails}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color={colors.rail} roughness={0.6} />
      </InstancedItems>
      <InstancedItems items={lamps}>
        <sphereGeometry args={[SCAFFOLD.lamps.radius, 10, 6]} />
        <meshStandardMaterial color="black" emissive={SCAFFOLD.lamps.color} emissiveIntensity={SCAFFOLD.lamps.intensity} />
      </InstancedItems>
    </group>
  )
}
