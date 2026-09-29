// Dev-only handles for the browser console and automated checks. Not included in production builds.
import { useExperienceStore } from './store/useExperienceStore'
import { useRobotStore } from './store/useRobotStore'
import { useTourStore } from './store/useTourStore'

window.__app = { useExperienceStore, useRobotStore, useTourStore }
