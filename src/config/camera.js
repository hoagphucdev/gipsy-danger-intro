// Camera: lens and the intro crane shot. Tour stops live in config/tour.js.

export const LENS = { fov: 60, near: 0.3, far: 3000 }

// Crane shot: starts at eye level (1.7 m) at the robot's feet and rises to its head.
// A smooth curve runs through the keys; `target` is where the camera looks.
export const INTRO = {
  delay: 1.2, // hold on the first frame to feel the scale
  duration: 8,
  screenShift: 0.16, // push the robot right of the intro text column (share of screen width, desktop only)
  keys: [
    { position: [16, 1.7, 80], target: [0, 38, 0] },
    { position: [24, 16, 64], target: [0, 44, 0] },
    { position: [20, 46, 52], target: [0, 58, 0] },
    { position: [12, 72, 42], target: [0, 69, 0] }, // eye level with the head
  ],
}
