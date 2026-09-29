import { useProgress } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { REPORT } from '../../config/content'
import { telemetry } from '../../lib/telemetry'

const pad = (n, width, digits = 1) => n.toFixed(digits).padStart(width, '0')

/**
 * Figure caption with live instrument readouts: load progress while loading, then the camera's
 * altitude and survey progress during the crane shot (written straight to the DOM every frame).
 */
export function SurveyReadout({ loading }) {
  const { progress } = useProgress()
  const altitude = useRef()
  const scan = useRef()

  useEffect(() => {
    if (loading) return
    let frame
    const tick = () => {
      if (altitude.current) altitude.current.textContent = `${pad(telemetry.altitude, 5)} m`
      if (scan.current) scan.current.textContent = `${pad(telemetry.progress * 100, 3, 0)} %`
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [loading])

  return (
    <figure className="readout">
      <figcaption>{REPORT.figure}</figcaption>
      {loading ? (
        <dl>
          <dt>{REPORT.loading}</dt>
          <dd>{pad(progress, 3, 0)} %</dd>
        </dl>
      ) : (
        <dl>
          <dt>ALT</dt>
          <dd ref={altitude}>000.0 m</dd>
          <dt>SCAN</dt>
          <dd ref={scan}>000 %</dd>
        </dl>
      )}
    </figure>
  )
}
