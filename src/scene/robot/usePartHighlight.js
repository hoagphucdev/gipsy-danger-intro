import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import { TOUR } from '../../config/tour'
import { useTourStore } from '../../store/useTourStore'

/** Fades the rim glow in on the hovered part and out on the others. */
export function usePartHighlight(highlights) {
  useFrame((_, dt) => {
    const { hovered } = useTourStore.getState()
    const k = 1 - Math.exp(-TOUR.highlight.speed * dt)
    for (const [part, list] of Object.entries(highlights)) {
      const goal = part === hovered ? TOUR.highlight.strength : 0
      for (const u of list) u.uHighlight.value = MathUtils.lerp(u.uHighlight.value, goal, k)
    }
  })
}
