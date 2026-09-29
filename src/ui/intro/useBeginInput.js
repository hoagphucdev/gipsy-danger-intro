import { useEffect } from 'react'

const KEYS = ['ArrowDown', 'PageDown', 'Enter', ' ']

/** Landing-page style: scrolling down (or Enter / arrow keys) starts the inspection. */
export function useBeginInput(begin) {
  useEffect(() => {
    const onWheel = (e) => e.deltaY > 20 && begin()
    const onKey = (e) => {
      if (e.target.closest?.('button, select, input, textarea')) return
      if (KEYS.includes(e.key)) begin()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [begin])
}
