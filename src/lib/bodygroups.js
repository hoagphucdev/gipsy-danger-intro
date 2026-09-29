import { ALWAYS_VISIBLE, BODYGROUPS, SLOTS } from '../config/model'

/** Map every bodygroup name to its mesh objects inside the loaded scene. */
export function collectBodygroups(root) {
  const byNumber = new Map()
  root.traverse((o) => {
    const m = o.isMesh && /^Object_(\d+)$/.exec(o.name)
    if (m) byNumber.set(Number(m[1]), o)
  })

  const groups = {}
  for (const [name, [first, last]] of Object.entries(BODYGROUPS)) {
    groups[name] = []
    for (let n = first; n <= last; n++) if (byNumber.has(n)) groups[name].push(byNumber.get(n))
  }
  return groups
}

/** Names of the bodygroups that should be visible for a loadout ({ slot: optionKey }). */
export function visibleGroups(loadout) {
  const chosen = Object.entries(SLOTS).map(([slot, def]) => def.options[loadout[slot] ?? def.default])
  return new Set([...ALWAYS_VISIBLE, ...chosen])
}

export function applyLoadout(groups, loadout) {
  const visible = visibleGroups(loadout)
  for (const [name, meshes] of Object.entries(groups)) {
    for (const mesh of meshes) mesh.visible = visible.has(name)
  }
}
