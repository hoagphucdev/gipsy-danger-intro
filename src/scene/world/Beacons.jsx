import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { BEACONS } from '../../config/world'
import { InstancedItems } from '../common/InstancedItems'

/** Orange warning lights that pulse together. */
export function Beacons() {
  const items = useMemo(() => BEACONS.positions.map((position) => ({ position })), [])
  const material = useRef()
  const time = useRef(0)

  useFrame((_, dt) => {
    time.current += dt
    const pulse = Math.max(0, Math.sin(time.current * BEACONS.speed * Math.PI)) ** 3
    material.current.emissiveIntensity = BEACONS.intensity * (0.08 + pulse)
  })

  return (
    <InstancedItems items={items}>
      <cylinderGeometry args={[0.6, 0.6, 1, 12]} />
      <meshStandardMaterial ref={material} color="black" emissive={BEACONS.color} />
    </InstancedItems>
  )
}
