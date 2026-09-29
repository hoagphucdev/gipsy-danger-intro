// Procedural motion of the (standing) robot. Angles in radians, times in seconds.

// Bone lookup: key -> regex on the (sanitized) bone name of the ValveBiped rig.
export const BONES = {
  chest: /Bip01_Spine2_/,
}

export const IDLE = {
  breath: 0.012, // chest rotation amplitude
  breathSpeed: 0.9,
}
