import { CREDITS } from '../config/credits'

/** Attribution required by the CC-BY-4.0 licensed models. */
export function Credits() {
  return (
    <footer className="credits">
      {CREDITS.map(({ title, author, url, license }) => (
        <span key={url}>
          "<a href={url} target="_blank" rel="noreferrer">{title}</a>" by {author}, {license}
        </span>
      ))}
    </footer>
  )
}
