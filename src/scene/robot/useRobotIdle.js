import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { applyIdle, createRig } from '../../lib/rig'

/** Subtle life while the robot stands in the dock. */
export function useRobotIdle(model) {
  const rig = useMemo(() => createRig(model), [model])
  const time = useRef(0)

  useFrame((_, dt) => {
    time.current += dt
    applyIdle(rig, time.current)
  })

  return rig
}
