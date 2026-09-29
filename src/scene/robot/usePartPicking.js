import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Vector2 } from 'three'
import { createPicker } from '../../lib/picking'
import { isInspecting, useExperienceStore } from '../../store/useExperienceStore'
import { useRobotStore } from '../../store/useRobotStore'
import { partIndex, useTourStore } from '../../store/useTourStore'

const CLICK_TOLERANCE = 5 // px; more movement than this is a drag (orbit), not a click
const inspecting = () => isInspecting(useExperienceStore.getState().stage)

/**
 * Hover highlights a part, click opens its report page (tour and free view).
 * Pointer events only record the position; the actual pick runs at most once per frame.
 */
export function usePartPicking(model) {
  const gl = useThree((s) => s.gl)
  const camera = useThree((s) => s.camera)
  const ndc = useMemo(() => new Vector2(), [])
  const picker = useRef(null)
  const moved = useRef(false)

  useLayoutEffect(() => {
    picker.current = createPicker(model) // needs the mounted, scaled model
    useRobotStore.getState().setPicker(picker.current) // shared with e.g. the welding rigs
    return () => {
      useRobotStore.getState().setPicker(null)
      picker.current.dispose()
    }
  }, [model])

  useEffect(() => {
    const el = gl.domElement
    const { setHovered, goTo } = useTourStore.getState()
    let downAt = null

    const toNdc = (e) => {
      const r = el.getBoundingClientRect()
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    }
    const onMove = (e) => {
      toNdc(e)
      moved.current = true
    }
    const onLeave = () => setHovered(null)
    const onDown = (e) => (downAt = [e.clientX, e.clientY])
    const onUp = (e) => {
      const isClick = downAt && Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) <= CLICK_TOLERANCE
      downAt = null
      if (!isClick || !inspecting()) return
      toNdc(e)
      const i = partIndex(picker.current.pick(ndc, camera))
      if (i < 0) return
      goTo(i)
      useExperienceStore.getState().setStage('tour') // from free view: back to the report, at that part
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerup', onUp)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerup', onUp)
    }
  }, [gl, camera, ndc])

  useFrame(() => {
    if (!moved.current) return
    moved.current = false
    useTourStore.getState().setHovered(inspecting() ? picker.current.pick(ndc, camera) : null)
  })
}
