import { Environment, Lightformer } from '@react-three/drei'
import { LIGHTS } from '../config/scene'

export function Lights() {
  const { ambient, key, rim } = LIGHTS
  const s = 80 // half-size of the shadow frustum, covers the dock

  return (
    <>
      <ambientLight intensity={ambient} />
      <directionalLight
        castShadow
        color={key.color}
        intensity={key.intensity}
        position={key.position}
        shadow-mapSize={[key.shadowSize, key.shadowSize]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.6}
        shadow-camera-left={-s}
        shadow-camera-right={s}
        shadow-camera-top={s}
        shadow-camera-bottom={-s}
        shadow-camera-far={600}
      />
      <pointLight color={rim.color} intensity={rim.intensity} position={rim.position} decay={2} />

      {/* Studio-style reflections without downloading an HDR */}
      <Environment resolution={256} environmentIntensity={LIGHTS.environment}>
        <Lightformer form="rect" intensity={1.5} color="#9fb6ff" position={[0, 6, -8]} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#ffffff" position={[-8, 2, 4]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="ring" intensity={2} color="#4fb4ff" position={[6, 3, 6]} scale={3} />
      </Environment>
    </>
  )
}
