import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { EMISSIVE_INTENSITY, REACTOR } from '../../config/model'

/** Chest reactor: turbine spin (uniforms from lib/reactor) and a slow heartbeat on its glow. */
export function useReactor(model, uniforms) {
  // every copy of the body material (it is split per part, see lib/highlight.js)
  const materials = useMemo(() => {
    const found = new Set()
    model.traverse((o) => {
      if (o.isMesh) for (const m of [].concat(o.material)) if (m.name === REACTOR.material) found.add(m)
    })
    return [...found]
  }, [model])
  const time = useRef(0)

  useFrame((_, dt) => {
    time.current += dt
    uniforms.uReactorAngle.value = time.current * REACTOR.spin
    const pulse = 1 + REACTOR.pulse * Math.sin(time.current * REACTOR.pulseSpeed)
    for (const m of materials) m.emissiveIntensity = EMISSIVE_INTENSITY * pulse
  })
}
