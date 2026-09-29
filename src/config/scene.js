// Look & feel of the stage. Tune values here, not inside components.

// Dark indoor haze.
export const FOG = { color: '#0a0c10', density: 0.004 }

export const LIGHTS = {
  ambient: 0.1,
  key: { color: '#c9d6f2', intensity: 0.45, position: [-60, 220, 90], shadowSize: 2048 }, // faint skylight
  rim: { color: '#6f93cf', intensity: 6000, position: [0, 60, -26] }, // cool backlight off the back wall
  environment: 0.4, // strength of the reflection lightformers
}

export const BLOOM = { intensity: 1.1, threshold: 1, smoothing: 0.2, radius: 0.75 }
