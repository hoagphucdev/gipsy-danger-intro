// Per-frame camera readouts for the UI (written in useFrame, read by DOM loops; never React state).
export const telemetry = {
  progress: 0, // 0..1 through the intro crane shot
  altitude: 0, // camera height in metres
}
