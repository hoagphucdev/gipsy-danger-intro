// Pure functions: config in -> instance transforms out (unit primitives, see ./primitives).
import { HANGAR, SCAFFOLD, WORKERS } from '../config/world'
import { box, braceYZ, poleX, poleY, poleZ } from './primitives'
import { createRandom } from './random'

const SIDES = [-1, 1]
const range = (from, to, step) => {
  const out = []
  for (let v = from; v <= to + 1e-6; v += step) out.push(v)
  return out
}

// --- hangar ------------------------------------------------------------------
export function hangarColumns() {
  const { halfWidth, height, z, columns } = HANGAR
  return range(z[0], z[1], columns.spacing).flatMap((cz) =>
    SIDES.map((s) => box([s * halfWidth, height / 2, cz], [columns.size, height, columns.size])),
  )
}

export function hangarTrusses() {
  const { halfWidth, height, z, trusses } = HANGAR
  const bottom = height - trusses.depth
  return range(z[0], z[1], trusses.spacing).flatMap((cz) => [
    poleX(-halfWidth, halfWidth, height - 0.5, cz, 0.6),
    poleX(-halfWidth, halfWidth, bottom, cz, 0.6),
    ...range(-halfWidth, halfWidth, 14).map((x) => poleY(x, bottom, height, cz, 0.35)),
  ])
}

export function hangarLamps() {
  const { height, z, trusses, lamps } = HANGAR
  const y = height - trusses.depth - 1
  return range(z[0] + 20, z[1] - 10, lamps.spacing).flatMap((cz) => lamps.xs.map((x) => box([x, y, cz], lamps.size)))
}

export function floorMarkings() {
  const { z, lane, dock } = HANGAR
  const stripe = (x, z0, z1, w) => box([x, 0.03, (z0 + z1) / 2], [w, 0.04, Math.abs(z1 - z0)])
  return [
    // walking lane up to the dock
    ...SIDES.map((s) => stripe(s * lane.halfWidth, z[0], dock.z[0], lane.width)),
    // dock outline (hazard band)
    ...SIDES.map((s) => stripe(s * dock.halfWidth, dock.z[0], dock.z[1], dock.hazard)),
    ...dock.z.map((dz) => box([0, 0.03, dz], [dock.halfWidth * 2 + dock.hazard, 0.04, dock.hazard])),
  ]
}

// --- scaffolding -------------------------------------------------------------
export function scaffoldLayout() {
  const { innerX, width, depth, height, bay, lift, pole } = SCAFFOLD
  const zs = range(-depth / 2, depth / 2, bay)
  const lifts = range(lift, height, lift)
  const poles = []
  const decks = []
  const rails = []
  const lamps = []

  for (const s of SIDES) {
    const xIn = s * innerX
    const xOut = s * (innerX + width)
    for (const x of [xIn, xOut]) for (const z of zs) poles.push(poleY(x, 0, height, z, pole))

    lifts.forEach((y, i) => {
      for (const x of [xIn, xOut]) poles.push(poleZ(x, y, zs[0], zs.at(-1), pole))
      for (const z of zs) poles.push(poleX(xIn, xOut, y, z, pole))
      decks.push(box([(xIn + xOut) / 2, y + 0.15, 0], [width, 0.3, depth]))
      for (const x of [xIn, xOut]) rails.push(poleZ(x, y + 1.1, zs[0], zs.at(-1), pole * 0.8))
      // small work lamps on the inner corners, every few lifts
      if (i % SCAFFOLD.lamps.everyLifts === 1) for (const z of [zs[0], zs.at(-1)]) lamps.push({ position: [xIn - s * 0.4, y + 2.4, z] })
      // diagonal bracing on the outer face, alternating direction per lift
      for (let b = 0; b < zs.length - 1; b += 2) {
        const [z0, z1] = i % 2 ? [zs[b], zs[b + 1]] : [zs[b + 1], zs[b]]
        poles.push(braceYZ(xOut, y - lift, y, z0, z1, pole * 0.8))
      }
    })
  }
  return { poles, decks, rails, lamps }
}

// --- people ------------------------------------------------------------------
export function workerLayout() {
  const rnd = createRandom(WORKERS.seed)
  const items = []
  const add = (x, y, z) =>
    items.push({ position: [x, y, z], rotationY: rnd.range(0, Math.PI * 2), scale: [1, rnd.range(0.92, 1.06), 1], helmet: rnd.pick(WORKERS.helmets) })

  for (const [cx, cz, radius, count] of WORKERS.floor) {
    for (let i = 0; i < count; i++) {
      const a = rnd.range(0, Math.PI * 2)
      const r = radius * Math.sqrt(rnd.next())
      add(cx + Math.cos(a) * r, 0, cz + Math.sin(a) * r)
    }
  }

  const { innerX, width, depth, height, bay, lift } = SCAFFOLD
  for (const s of SIDES) {
    for (const y of range(lift, height, lift)) {
      for (const z of range(-depth / 2 + bay / 2, depth / 2, bay)) {
        if (rnd.chance(WORKERS.perDeck)) add(s * (innerX + rnd.range(2, width - 2)), y + 0.3, z)
      }
    }
  }
  return items
}
