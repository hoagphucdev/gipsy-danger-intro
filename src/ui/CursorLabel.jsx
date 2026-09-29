import { useEffect, useRef } from 'react'
import { PART_CONTENT } from '../config/partContent'
import { useTourStore } from '../store/useTourStore'

/** Small tag next to the cursor; also switches the cursor to a pointer while it shows. */
export function CursorLabel({ text }) {
  const ref = useRef()

  useEffect(() => {
    const move = (e) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 14}px)`
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useEffect(() => {
    document.body.style.cursor = text ? 'pointer' : ''
    return () => (document.body.style.cursor = '')
  }, [text])

  return (
    <div ref={ref} className={`hover-label${text ? ' is-visible' : ''}`} aria-hidden>
      {text}
    </div>
  )
}

/** The report part under the pointer (tour, free view). */
export function PartCursorLabel() {
  const hovered = useTourStore((s) => s.hovered)
  return <CursorLabel text={PART_CONTENT[hovered]?.title} />
}
