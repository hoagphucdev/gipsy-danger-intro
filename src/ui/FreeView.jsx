import { useEffect } from 'react'
import { useExperienceStore } from '../store/useExperienceStore'

const setStage = (stage) => useExperienceStore.getState().setStage(stage)
export const enterFreeView = () => setStage('free')
export const exitFreeView = () => setStage('tour')

/** F toggles free view, Esc leaves it. Active during the tour and free view. */
export function useFreeViewKeys(active) {
  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, select')) return
      const { stage } = useExperienceStore.getState()
      if (e.key === 'f' || e.key === 'F') stage === 'free' ? exitFreeView() : enterFreeView()
      if (e.key === 'Escape' && stage === 'free') exitFreeView()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])
}

/** Minimal overlay while orbiting freely. */
export function FreeViewHud() {
  return (
    <div className="free">
      <span className="free__label">Free view</span>
      <span className="free__help">Drag to orbit · Scroll to zoom · Right-drag to pan · Click a part to read about it</span>
      <button onClick={exitFreeView}>Back to report · Esc</button>
    </div>
  )
}
