import { create } from 'zustand'
import { PARTS } from '../config/tour'

const clampIndex = (i) => Math.max(0, Math.min(PARTS.length - 1, i))

export const useTourStore = create((set, get) => ({
  index: 0, // current stop in PARTS
  hovered: null, // part id under the pointer
  stops: null, // [{ position, target }] computed from the skeleton once the robot is loaded
  goTo: (i) => set({ index: clampIndex(i) }),
  step: (dir) => set({ index: clampIndex(get().index + dir) }),
  setHovered: (hovered) => get().hovered !== hovered && set({ hovered }),
  setStops: (stops) => set({ stops }),
}))

export const partIndex = (id) => PARTS.findIndex((p) => p.id === id)
