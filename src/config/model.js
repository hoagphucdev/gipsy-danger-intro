// Everything specific to the Gipsy Danger asset lives here.
// Code in lib/ and scene/ only reads these tables.

const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export const MODEL = {
  url: isMobile ? '/models/robot-mobile.glb' : '/models/robot.glb',
  sourceHeight: 67.65, // units in the file, feet at y = 0
  height: 79, // metres (canon Gipsy Danger) -> 1 world unit = 1 m
}

// Bodygroups from the original SFM model. The file stores them as consecutive
// mesh nodes named Object_<n>; each entry is the inclusive [first, last] n.
export const BODYGROUPS = {
  body: [7, 15],
  brokenLeft: [17, 21],
  brokenRight: [23, 27],
  fistRight: [29, 33],
  fistLeft: [35, 39],
  handLeft: [41, 45],
  handRight: [47, 51],
  footLeft: [53, 55],
  lights: [57, 59],
  lights2: [61, 64],
  plasma2Left: [66, 71],
  plasma2Right: [73, 78],
  plasmaLeft: [80, 86],
  plasmaRight: [88, 94],
  footRight: [96, 98],
  shoulderLeft: [100, 101],
  shoulderRight: [103, 103],
  swordLeft: [105, 110],
  swordRight: [112, 117],
}

export const ALWAYS_VISIBLE = ['body', 'footLeft', 'footRight', 'shoulderLeft', 'shoulderRight']

// Mutually exclusive variants: exactly one option per slot is shown.
export const SLOTS = {
  armLeft: {
    label: 'Left arm',
    options: { hand: 'handLeft', fist: 'fistLeft', sword: 'swordLeft', plasma: 'plasmaLeft', plasma2: 'plasma2Left', broken: 'brokenLeft' },
    default: 'hand',
  },
  armRight: {
    label: 'Right arm',
    options: { hand: 'handRight', fist: 'fistRight', sword: 'swordRight', plasma: 'plasmaRight', plasma2: 'plasma2Right', broken: 'brokenRight' },
    default: 'hand',
  },
  lights: {
    label: 'Lights',
    options: { basic: 'lights', search: 'lights2' },
    default: 'search',
  },
}

// Per-material overrides applied after load (keys = material names in the file).
const armor = { roughness: 0.42, metalness: 0.55 }
export const MATERIAL_OVERRIDES = {
  Gipsy_LowerArm_DIF: armor,
  Gipsy_LowerLeg_Dif: armor,
  Gipsy_UpperArm_Dif: armor,
  addon_parts: armor,
  Weap_Seeker_DM: { roughness: 0.35, metalness: 0.6 },
}

// Any material with an emissive map gets this intensity (>1 feeds the bloom).
export const EMISSIVE_INTENSITY = 4

// Chest reactor: a round area painted into the body texture (measured from the emissive map).
export const REACTOR = {
  material: 'Gipsy_Body_Dif',
  uvCenter: [0.2723, 0.5915], // centre of the turbine in UV space
  uvRadius: 0.047, // turbine blades; the housing ring outside stays still
  spin: 0.9, // rad/s
  pulse: 0.2, // +/- share of the emissive intensity
  pulseSpeed: 1.6,
}
