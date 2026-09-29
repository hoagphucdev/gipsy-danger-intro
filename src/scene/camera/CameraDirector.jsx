import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { MathUtils, Vector3 } from 'three'
import { INTRO } from '../../config/camera'
import { FREE_VIEW, TOUR } from '../../config/tour'
import { createCameraPath } from '../../lib/cameraPath'
import { setScreenShift } from '../../lib/lens'
import { clamp01, easeInOutCubic } from '../../lib/math'
import { telemetry } from '../../lib/telemetry'
import { secondsIn, useExperienceStore } from '../../store/useExperienceStore'
import { useTourStore } from '../../store/useTourStore'

/**
 * Owns the camera.
 * 'loading' / 'intro': plays the crane shot, input off, then holds on the head until the user
 *   begins the inspection (ui/intro). Progress and altitude are published to lib/telemetry.
 * 'tour': flies between part stops; once settled, the user can look around the current part.
 * 'free': unrestricted orbit / zoom / pan around the whole robot, kept inside the bay.
 */
export function CameraDirector() {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls)
  const stage = useExperienceStore((s) => s.stage)
  const index = useTourStore((s) => s.index)
  const stops = useTourStore((s) => s.stops)
  const path = useMemo(() => createCameraPath(INTRO.keys), [])
  const target = useMemo(() => new Vector3(), [])
  const flight = useRef(null)
  const shift = useRef(0)
  const bounds = useMemo(() => ({ min: new Vector3(...FREE_VIEW.bounds.min), max: new Vector3(...FREE_VIEW.bounds.max) }), [])
  const free = stage === 'free'

  // new stop (or entering the tour): fly from wherever the camera is now
  useEffect(() => {
    if (!controls) return
    const to = stage === 'tour' && stops ? stops[index] : null
    if (to) flight.current = { fromPosition: camera.position.clone(), fromTarget: controls.target.clone(), to, t: 0 }
  }, [stage, index, stops, controls, camera])

  useFrame(({ size }, dt) => {
    if (!controls) return
    // make room for the text column on the left (desktop layout only)
    const shifts = { tour: TOUR.screenShift, free: 0 }
    const wantShift = size.width <= 640 ? 0 : (shifts[stage] ?? INTRO.screenShift)
    shift.current = MathUtils.damp(shift.current, wantShift, 4, dt)
    setScreenShift(camera, shift.current)

    if (free) {
      fly(flight, camera, controls, dt)
      controls.enabled = !flight.current
      controls.target.clamp(bounds.min, bounds.max) // panning cannot leave the bay
      return
    }
    if (stage === 'tour') {
      fly(flight, camera, controls, dt)
      controls.enabled = !flight.current
      return
    }
    controls.enabled = false
    const elapsed = stage === 'intro' ? secondsIn('intro') : 0
    const t = easeInOutCubic(clamp01((elapsed - INTRO.delay) / INTRO.duration))
    path.at(t, camera.position, target)
    controls.target.copy(target)
    camera.lookAt(target)
    telemetry.progress = t
    telemetry.altitude = camera.position.y
  })

  const { azimuth, minPolar, maxPolar, rotateSpeed } = TOUR.orbit
  return (
    <OrbitControls
      makeDefault
      enabled={false}
      enableDamping
      // tour: look around the current part only, the wheel steps through parts
      // free: full orbit, zoom and pan
      enablePan={free}
      enableZoom={free}
      rotateSpeed={free ? 0.7 : rotateSpeed}
      minAzimuthAngle={free ? -Infinity : -azimuth}
      maxAzimuthAngle={free ? Infinity : azimuth}
      minPolarAngle={free ? 0.05 : minPolar}
      maxPolarAngle={free ? FREE_VIEW.maxPolarAngle : maxPolar}
      minDistance={free ? FREE_VIEW.minDistance : 0}
      maxDistance={free ? FREE_VIEW.maxDistance : Infinity}
    />
  )
}

function fly(flight, camera, controls, dt) {
  const f = flight.current
  if (!f) return
  f.t = Math.min(1, f.t + dt / TOUR.transition)
  const k = easeInOutCubic(f.t)
  camera.position.lerpVectors(f.fromPosition, f.to.position, k)
  controls.target.lerpVectors(f.fromTarget, f.to.target, k)
  camera.lookAt(controls.target)
  if (f.t >= 1) flight.current = null
}
