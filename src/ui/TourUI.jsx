import { isInspecting, useExperienceStore } from '../store/useExperienceStore'
import { PartCursorLabel } from './CursorLabel'
import { FreeViewHud } from './FreeViewHud'
import { useModeKeys } from './modes'
import { PartPage } from './PartPage'

/** UI once the inspection has started: the report pages, or the free-view overlay. */
export function TourUI() {
  const stage = useExperienceStore((s) => s.stage)
  const active = isInspecting(stage)
  useModeKeys(active)
  if (!active) return null

  return (
    <>
      {stage === 'free' ? (
        <FreeViewHud />
      ) : (
        <>
          <PartPage />
          <p className="hint">Scroll to move between parts · Drag to look around · F for free view</p>
        </>
      )}
      <PartCursorLabel />
    </>
  )
}
