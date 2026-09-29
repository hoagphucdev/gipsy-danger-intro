import { create } from 'zustand'
import { SLOTS } from '../config/model'

const defaultLoadout = Object.fromEntries(Object.entries(SLOTS).map(([slot, def]) => [slot, def.default]))

export const useRobotStore = create((set) => ({
  loadout: defaultLoadout,
  setVariant: (slot, option) => set((s) => ({ loadout: { ...s.loadout, [slot]: option } })),
  picker: null, // fast surface queries on the mounted robot (lib/picking.js), set once it is in the scene
  setPicker: (picker) => set({ picker }),
}))
