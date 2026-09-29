import { useMemo } from 'react'
import { BackSide } from 'three'
import { HANGAR } from '../../config/world'
import { floorMarkings, hangarColumns, hangarLamps, hangarTrusses } from '../../lib/hangarLayout'
import { InstancedItems } from '../common/InstancedItems'

/** The building: floor, walls, columns, roof trusses and ceiling lamps. */
export function Hangar() {
  const { halfWidth, height, z, colors, lamps, lane } = HANGAR
  const length = z[1] - z[0]
  const centerZ = (z[0] + z[1]) / 2
  const layout = useMemo(
    () => ({ columns: hangarColumns(), trusses: hangarTrusses(), lamps: hangarLamps(), markings: floorMarkings() }),
    [],
  )

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-z={centerZ} receiveShadow>
        <planeGeometry args={[halfWidth * 2, length]} />
        <meshStandardMaterial color={colors.floor} roughness={0.8} metalness={0.1} />
      </mesh>
      {/* walls + roof: inside of a box (floor excluded by the plane above) */}
      <mesh position={[0, height / 2, centerZ]}>
        <boxGeometry args={[halfWidth * 2, height, length]} />
        <meshStandardMaterial color={colors.wall} side={BackSide} roughness={0.9} />
      </mesh>

      <InstancedItems items={layout.columns} castShadow receiveShadow>
        <boxGeometry />
        <meshStandardMaterial color={colors.steel} roughness={0.6} metalness={0.5} />
      </InstancedItems>
      <InstancedItems items={layout.trusses}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color={colors.steel} roughness={0.6} metalness={0.5} />
      </InstancedItems>
      <InstancedItems items={layout.lamps}>
        <boxGeometry />
        <meshStandardMaterial color="black" emissive={lamps.color} emissiveIntensity={lamps.intensity} />
      </InstancedItems>
      <InstancedItems items={layout.markings} receiveShadow>
        <boxGeometry />
        <meshStandardMaterial color={lane.color} roughness={0.7} />
      </InstancedItems>
    </group>
  )
}
