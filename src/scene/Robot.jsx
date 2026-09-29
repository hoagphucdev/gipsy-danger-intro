import { useGLTF } from '@react-three/drei'
import { useEffect, useLayoutEffect, useMemo } from 'react'
import { MODEL } from '../config/model'
import { applyLoadout } from '../lib/bodygroups'
import { computeStops } from '../lib/parts'
import { setupRobot } from '../lib/robotSetup'
import { useExperienceStore } from '../store/useExperienceStore'
import { useRobotStore } from '../store/useRobotStore'
import { useTourStore } from '../store/useTourStore'
import { usePartHighlight } from './robot/usePartHighlight'
import { usePartPicking } from './robot/usePartPicking'
import { usePlates } from './robot/usePlates'
import { useReactor } from './robot/useReactor'
import { useRobotIdle } from './robot/useRobotIdle'

/** The robot standing in the dock at the origin, facing +Z. */
export function Robot() {
  const { scene } = useGLTF(MODEL.url)
  const { groups, highlights, reactor } = useMemo(() => setupRobot(scene), [scene])
  const loadout = useRobotStore((s) => s.loadout)
  const markReady = useExperienceStore((s) => s.markReady)
  const setStops = useTourStore((s) => s.setStops)

  useLayoutEffect(() => applyLoadout(groups, loadout), [groups, loadout])
  useLayoutEffect(() => setStops(computeStops(scene)), [scene, setStops]) // needs the mounted, scaled model
  useEffect(() => markReady(), [markReady]) // model is in the scene -> intro + dock sequence start
  useRobotIdle(scene)
  useReactor(scene, reactor)
  usePartHighlight(highlights)
  usePartPicking(scene)
  usePlates(scene)

  return <primitive object={scene} scale={MODEL.height / MODEL.sourceHeight} />
}

useGLTF.preload(MODEL.url)
