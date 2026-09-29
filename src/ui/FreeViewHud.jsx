import { backToReport } from './modes'

/** Minimal overlay while orbiting freely. */
export function FreeViewHud() {
  return (
    <div className="free">
      <span className="free__label">Free view</span>
      <span className="free__help">Drag to orbit · Scroll to zoom · Right-drag to pan · Click a part to read about it</span>
      <button onClick={backToReport}>Back to report · Esc</button>
    </div>
  )
}
