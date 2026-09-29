import { create } from 'zustand'

// Stages: waiting for the model -> crane shot -> part-by-part tour <-> free view.
export const STAGES = ['loading', 'intro', 'tour', 'free']

/** Stages where the user inspects the robot (hover highlight, click to jump). */
export const isInspecting = (stage) => stage === 'tour' || stage === 'free'

const now = () => performance.now()

export const useExperienceStore = create((set) => ({
  stage: 'loading',
  stageSince: now(),
  readyAt: null, // when the robot appeared; drives the dock sequence independently of the stage
  setStage: (stage) => set({ stage, stageSince: now() }),
  markReady: () => set({ readyAt: now(), stage: 'intro', stageSince: now() }),
}))

/** Seconds spent in `stage`, or -1 if we are not in it. Cheap enough for useFrame. */
export function secondsIn(stage) {
  const s = useExperienceStore.getState()
  return s.stage === stage ? (now() - s.stageSince) / 1000 : -1
}

/** Seconds since the robot appeared, or -1 while loading. */
export function secondsSinceReady() {
  const { readyAt } = useExperienceStore.getState()
  return readyAt == null ? -1 : (now() - readyAt) / 1000
}
