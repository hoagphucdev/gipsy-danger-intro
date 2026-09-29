// Part-by-part tour: the 3D side. Order = scroll order. Each part says:
//  - `owns`: the bones it owns. Every triangle belongs to the part of the bone that drives it
//    (a bone without a rule inherits from its nearest matching ancestor, e.g. fingers -> arms)
//  - where the camera looks: `anchor` bone + `target` offset (m), and where it stands: `camera` offset from that target
// The text for each part lives in config/partContent.js (same ids).

export const TOUR = {
  transition: 1.4, // seconds between stops
  wheelThreshold: 60, // accumulated wheel delta that counts as one step
  zoom: 0.75, // scales every stop's camera offset: < 1 = closer to the part
  screenShift: 0.24, // two-column layout: the robot sits in the right half (share of screen width, desktop only)
  orbit: { azimuth: 1.1, minPolar: 0.5, maxPolar: 1.7, rotateSpeed: 0.5 }, // look-around limits at a stop
  highlight: { color: '#4fb4ff', strength: 0.55, speed: 10 },
}

// Free view: orbit the whole robot, zoom and pan, but stay inside the bay and above the floor.
export const FREE_VIEW = {
  minDistance: 8,
  maxDistance: 190,
  maxPolarAngle: 1.72,
  bounds: { min: [-45, 1, -25], max: [45, 85, 50] }, // where the orbit target may be panned to
}

export const PARTS = [
  {
    id: 'head',
    owns: [/Bip01_Head1/, /Bip01_Neck1/, /[LR]_wing/], // wings = the collar behind the head
    anchor: /Head1/,
    target: [0, 2.5, 3],
    camera: [10, 1, 26],
  },
  {
    id: 'reactor',
    owns: [/Bip01_Spine[124]?_\d+$/], // torso spine only (the hands have bones named Spine6/7)
    anchor: /Spine2_/,
    target: [0, 1, 8],
    camera: [-6, 0, 24],
  },
  {
    id: 'shoulders',
    owns: [/[LR]_Clavicle/],
    anchor: /L_Clavicle/,
    target: [12, 2, 2],
    camera: [18, 6, 30],
  },
  {
    id: 'arms',
    owns: [/[LR]_UpperArm/],
    anchor: /R_Forearm/,
    target: [-4, -7, 4],
    camera: [-20, 4, 30],
  },
  {
    id: 'legs',
    owns: [/Bip01_Pelvis/, /[LR]_Thigh/, /[LR]_Calf/],
    anchor: /L_Calf/,
    target: [0, 6, 3],
    camera: [16, 2, 34],
  },
  {
    id: 'feet',
    owns: [/[LR]_Foot/],
    anchor: /R_Foot_?001/,
    target: [0, -2, 4],
    camera: [-10, 5, 24],
  },
  {
    id: 'record', // whole machine: service history + full spec sheet (owns no triangles)
    owns: [],
    anchor: /Bip01_Pelvis/,
    target: [0, -6, 0],
    camera: [34, 4, 100],
  },
]
