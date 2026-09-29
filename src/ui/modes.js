import { useEffect } from 'react'
import { useExperienceStore } from '../store/useExperienceStore'

const setStage = (stage) => useExperienceStore.getState().setStage(stage)
export const enterFreeView = () => setStage('free')
export const backToReport = () => setStage('tour')

/** F toggles free view, Esc leaves it. */
export function useModeKeys(active) {
  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, select')) return
      const { stage } = useExperienceStore.getState()
      if (e.key === 'f' || e.key === 'F') stage === 'free' ? backToReport() : enterFreeView()
      if (e.key === 'Escape' && stage === 'free') backToReport()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])
}
