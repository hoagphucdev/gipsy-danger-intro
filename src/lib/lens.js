/**
 * Shift what the camera looks at sideways on screen without moving the camera
 * (lens shift via filmOffset). fraction > 0 moves the subject right by that share of the width.
 */
export function setScreenShift(camera, fraction) {
  const frustumWidth = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect
  const offset = -fraction * frustumWidth * camera.getFilmWidth()
  if (Math.abs(offset - camera.filmOffset) < 1e-4) return
  camera.filmOffset = offset
  camera.updateProjectionMatrix()
}
