import { useLayoutEffect, useMemo, useRef } from 'react'
import { CylinderGeometry, Vector3 } from 'three'
import { FLOODLIGHTS } from '../../config/world'
import { createLightConeMaterial } from '../../lib/lightConeMaterial'

/** Work spotlights on the robot; optional visible beam through the haze (`beam` > 0). */
export function Floodlights() {
  return FLOODLIGHTS.map((light, i) => <Floodlight key={i} {...light} />)
}

function Floodlight({ position, target, color, intensity, angle, beam = 0, cone = 0.2 }) {
  const spot = useRef()

  useLayoutEffect(() => {
    spot.current.target.position.set(...target)
    spot.current.target.updateMatrixWorld()
  }, [target])

  return (
    <group position={position}>
      <spotLight ref={spot} color={color} intensity={intensity} angle={angle} penumbra={0.7} decay={2} distance={0} />
      <mesh>
        <sphereGeometry args={[0.5, 12, 8]} />
        <meshBasicMaterial color={color} toneMapped={false} onUpdate={(m) => m.color.multiplyScalar(3)} />
      </mesh>
      {beam > 0 && <Beam position={position} target={target} color={color} strength={beam} cone={cone} />}
    </group>
  )
}

function Beam({ position, target, color, strength, cone }) {
  const ref = useRef()
  const length = useMemo(() => new Vector3(...position).distanceTo(new Vector3(...target)) * 1.1, [position, target])
  // open cylinder, apex at the origin, opening along +Z (so lookAt aims it)
  const geometry = useMemo(
    () => new CylinderGeometry(0.5, length * Math.tan(cone), length, 32, 1, true).translate(0, -length / 2, 0).rotateX(-Math.PI / 2),
    [length, cone],
  )
  const material = useMemo(() => createLightConeMaterial({ color, intensity: strength }), [color, strength])
  useLayoutEffect(() => ref.current.lookAt(...target), [target])
  return <mesh ref={ref} geometry={geometry} material={material} />
}
