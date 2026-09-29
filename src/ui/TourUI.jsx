import { isInspecting, useExperienceStore } from '../store/useExperienceStore'
import { FreeViewHud, useFreeViewKeys } from './FreeView'
import { HoverLabel } from './HoverLabel'
import { PartPage } from './PartPage'

/** UI once the inspection has started: the report pages, or the free-view overlay. */
export function TourUI() {
  const stage = useExperienceStore((s) => s.stage)
  const active = isInspecting(stage)
  useFreeViewKeys(active)
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
      <HoverLabel />
    </>
  )
}
