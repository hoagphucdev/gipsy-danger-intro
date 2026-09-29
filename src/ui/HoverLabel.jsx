import { useEffect, useRef } from 'react'
import { PART_CONTENT } from '../config/partContent'
import { useTourStore } from '../store/useTourStore'

/** Small tag next to the cursor naming the hovered part; also switches the cursor to a pointer. */
export function HoverLabel() {
  const hovered = useTourStore((s) => s.hovered)
  const ref = useRef()
  const title = PART_CONTENT[hovered]?.title

  useEffect(() => {
    const move = (e) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 14}px)`
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : ''
  }, [hovered])

  return (
    <div ref={ref} className={`hover-label${title ? ' is-visible' : ''}`} aria-hidden>
      {title}
    </div>
  )
}
