import { useEffect } from 'react'
import { TOUR } from '../config/tour'
import { useTourStore } from '../store/useTourStore'

const NEXT_KEYS = ['ArrowDown', 'ArrowRight', 'PageDown']
const PREV_KEYS = ['ArrowUp', 'ArrowLeft', 'PageUp']

const canScroll = (el, dy) => (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0)

/** Mouse wheel / trackpad and arrow keys step through the tour, one stop per gesture. */
export function useTourInput() {
  const step = useTourStore((s) => s.step)

  useEffect(() => {
    let accumulated = 0
    // the flight to the first stop: also swallows the rest of the scroll that started the tour
    let lockedUntil = performance.now() + TOUR.transition * 1000

    const onWheel = (e) => {
      // over the report page: scroll its text first, step only once it hits an end
      const page = e.target.closest?.('.page')
      if (page && canScroll(page, e.deltaY)) return
      const now = performance.now()
      if (now < lockedUntil) return
      accumulated += e.deltaY
      if (Math.abs(accumulated) < TOUR.wheelThreshold) return
      step(Math.sign(accumulated))
      accumulated = 0
      lockedUntil = now + TOUR.transition * 1000 // one stop per flick, even on trackpads
    }
    const onKey = (e) => {
      if (e.target.closest?.('select, input, textarea')) return
      if (NEXT_KEYS.includes(e.key)) step(1)
      if (PREV_KEYS.includes(e.key)) step(-1)
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [step])
}
