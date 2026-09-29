// Jaeger repair bay. 1 unit = 1 m. The robot stands in the dock at the origin, facing +Z,
// between two scaffold towers, with the back wall right behind it.

export const HANGAR = {
  halfWidth: 72, // walls close around the dock -> enclosed, dark bay
  height: 118,
  z: [-30, 125], // back wall just behind the robot and scaffold towers
  colors: { floor: '#15171b', wall: '#0e1014', steel: '#262a31' },
  columns: { spacing: 30, size: 3 },
  trusses: { spacing: 30, depth: 6 },
  lamps: { xs: [-48, 48], spacing: 30, size: [1.6, 0.3, 0.8], color: '#ffd9a8', intensity: 3 }, // small ceiling lamps
  lane: { halfWidth: 33, width: 1.2, color: '#5e4916' }, // muted floor paint
  dock: { halfWidth: 33, z: [-26, 26], hazard: 3 }, // painted box around the parking spot
}

export const SCAFFOLD = {
  innerX: 36, // inner face of each tower (robot needs ~25 m either side)
  width: 12,
  depth: 38,
  height: 96,
  bay: 4.75, // distance between standards along Z
  lift: 8, // deck spacing
  pole: 0.22,
  colors: { steel: '#4a5058', deck: '#332c22', rail: '#6e5519' },
  lamps: { color: '#ffc27a', intensity: 4, radius: 0.3, everyLifts: 2 }, // small work lamps on the towers
}

export const WORKERS = {
  seed: 5,
  // floor clusters: [centerX, centerZ, radius, count]
  floor: [
    [14, 36, 6, 8],
    [-18, 40, 5, 6],
    [-50, 22, 7, 8],
    [52, -12, 6, 6],
  ],
  perDeck: 0.35, // chance of a worker per deck bay
  body: '#4a5260', // grey overalls
  helmets: ['#f2b61f', '#f07a1f', '#e9e9e9', '#f2b61f'],
}

// Automatic welding rigs: a lattice tower with a KUKA arm on top, each aimed at a random point
// on a robot part (found by casting a ray at the real surface). Seeded -> stable.
export const WELD_RIGS = {
  seed: 12,
  targets: ['feet', 'feet', 'legs', 'legs', 'legs', 'arms', 'arms', 'shoulders'], // one rig each (chest is only reachable from the front, which would block the camera)
  heights: { feet: [1.5, 4], legs: [10, 44], arms: [40, 60], reactor: [48, 62], shoulders: [62, 69] },
  aim: { feet: [7, 5], legs: [7, 2], arms: [16, -3], reactor: [0, 6], shoulders: [15, 0] }, // [x, z] rays aim at (x mirrored per side)
  angles: [0.85, 1.45], // |angle| from +Z (front) of the incoming ray: mostly from the sides
  standoff: [7, 9], // horizontal distance from the weld point to the tower
  mountAbove: -2, // tower top height relative to the weld point (the arm's shoulder sits ~4 m above its base)
  keepOut: { x: 33, zFront: 16 }, // towers stay between the robot and the scaffolds, clear of the camera
  arm: { url: '/models/weld-arm.glb', scale: 9, torch: 1.2, torchRadius: 0.12 }, // KUKA model (CC-BY, see CREDITS)
  truss: { size: 1.8, segment: 3, chord: 0.14, lace: 0.07 },
  seam: { length: 0.9, speed: 0.6 }, // torch travel along the weld seam (m, cycles/s)
  colors: { frame: '#454b54', torch: '#23272d', head: '#2f343b' },
}

export const WELDING = {
  startDelay: 2, // seconds after the robot appears before the rigs start welding
  sparksPerWelder: 140,
  life: 1.3,
  speed: 8,
  gravity: -9.8,
  sparkSize: 0.7, // metres
  arcSize: 1.4,
  sparkColor: '#ffae4a',
  arcColor: '#bfe3ff',
  rate: 1.4, // on/off decisions per second
  duty: 0.65, // fraction of the time a welder is on
  lights: 3, // real flickering point lights (costly, keep small)
  lightIntensity: 1500,
}

// Small work spots on the robot. `beam` > 0 adds a visible light cone (off for now).
export const FLOODLIGHTS = [
  { position: [-55, 100, 55], target: [0, 50, 0], color: '#ffe2bd', intensity: 14000, angle: 0.28, beam: 0 },
  { position: [55, 100, 55], target: [0, 50, 0], color: '#ffe2bd', intensity: 14000, angle: 0.28, beam: 0 },
  { position: [0, 105, -24], target: [0, 40, 0], color: '#9db8e6', intensity: 9000, angle: 0.3, beam: 0 },
]

export const BEACONS = {
  color: '#ff7a1a',
  intensity: 6,
  speed: 2.2,
  positions: [[-42, 98, -19], [42, 98, -19], [-42, 98, 19], [42, 98, 19], [-34, 1, -26], [34, 1, -26], [-34, 1, 26], [34, 1, 26]],
}

export const DUST = { count: 400, scale: [130, 100, 150], position: [0, 50, 45], size: 6, speed: 0.25, color: '#6f7c92' }
