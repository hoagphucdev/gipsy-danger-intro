import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { MODEL } from '../../config/model'
import { PARTS } from '../../config/tour'
import { renderPlates } from '../../lib/figures'
import { useRobotStore } from '../../store/useRobotStore'
import { useTourStore } from '../../store/useTourStore'

// one plate per part; parts that own no triangles (the whole-machine page) get the plain plate
const PLATE_IDS = PARTS.map((p) => (p.owns.length ? p.id : null))

/** Renders the report plates once the robot is on screen, and again when its loadout changes. */
export function usePlates(model) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const loadout = useRobotStore((s) => s.loadout)

  useEffect(() => {
    // wait one frame so this commit's pose and visibility are what gets drawn
    const frame = requestAnimationFrame(() => {
      useTourStore.getState().setPlates(renderPlates(gl, scene, model, PLATE_IDS, { heightM: MODEL.height }))
    })
    return () => cancelAnimationFrame(frame)
  }, [gl, scene, model, loadout])
}
