// Instance transforms for unit primitives (see writeInstances):
// box 1x1x1 centred, cylinder radius 1 / height 1 along Y centred.

export const box = (position, scale) => ({ position, scale })

export const poleY = (x, y0, y1, z, r) => ({ position: [x, (y0 + y1) / 2, z], scale: [r, y1 - y0, r] })

export const poleZ = (x, y, z0, z1, r) => ({
  position: [x, y, (z0 + z1) / 2],
  rotation: [Math.PI / 2, 0, 0],
  scale: [r, Math.abs(z1 - z0), r],
})

export const poleX = (x0, x1, y, z, r) => ({
  position: [(x0 + x1) / 2, y, z],
  rotation: [0, 0, Math.PI / 2],
  scale: [r, Math.abs(x1 - x0), r],
})

/** Diagonal in the Y-Z plane at constant x. */
export const braceYZ = (x, y0, y1, z0, z1, r) => {
  const dy = y1 - y0
  const dz = z1 - z0
  return { position: [x, (y0 + y1) / 2, (z0 + z1) / 2], rotation: [Math.atan2(dz, dy), 0, 0], scale: [r, Math.hypot(dy, dz), r] }
}

/** Diagonal in the X-Y plane at constant z. */
export const braceXY = (x0, x1, y0, y1, z, r) => {
  const dx = x1 - x0
  const dy = y1 - y0
  return { position: [(x0 + x1) / 2, (y0 + y1) / 2, z], rotation: [0, 0, Math.atan2(-dx, dy)], scale: [r, Math.hypot(dx, dy), r] }
}
