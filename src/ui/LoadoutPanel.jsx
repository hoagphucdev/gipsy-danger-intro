import { SLOTS } from '../config/model'
import { useRobotStore } from '../store/useRobotStore'

export function LoadoutPanel() {
  const loadout = useRobotStore((s) => s.loadout)
  const setVariant = useRobotStore((s) => s.setVariant)

  return (
    <aside className="panel">
      {Object.entries(SLOTS).map(([slot, def]) => (
        <label key={slot} className="panel__row">
          <span>{def.label}</span>
          <select value={loadout[slot]} onChange={(e) => setVariant(slot, e.target.value)}>
            {Object.keys(def.options).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </label>
      ))}
    </aside>
  )
}
