import { REPORT } from '../config/content'
import { PART_CONTENT, SOURCES } from '../config/partContent'
import { PARTS } from '../config/tour'
import { useTourStore } from '../store/useTourStore'
import { Author } from './Author'
import { enterFreeView } from './modes'
import { RichText } from './RichText'
import { useTourInput } from './useTourInput'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Left column of the two-column tour: the report page for the current part.
 * The 3D view on the right is its live figure.
 */
export function PartPage() {
  const index = useTourStore((s) => s.index)
  const goTo = useTourStore((s) => s.goTo)
  const plates = useTourStore((s) => s.plates)
  const part = PARTS[index]
  const c = PART_CONTENT[part.id]
  useTourInput()

  return (
    <article className="page" key={part.id} aria-live="polite">
      <header className="page__running">
        <span>{REPORT.id}</span>
        <span>
          {pad(index + 1)} / {pad(PARTS.length)}
        </span>
        <button className="page__free" onClick={enterFreeView} title="Orbit, zoom and pan freely (F)">
          Free view ⤢
        </button>
      </header>

      <p className="page__kicker">
        <span className="page__section">§{index + 1}</span> {c.subtitle}
      </p>
      <h2 className="page__title">{c.title}</h2>
      <p className="page__lead">
        <RichText text={c.lead} />
      </p>

      <dl className="page__figures">
        {c.figures.map(({ value, label }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {c.body.map((text, i) => (
        <p className="page__body" key={i}>
          <RichText text={text} />
        </p>
      ))}

      {plates && (
        <figure className="page__plate">
          <img src={plates[part.id] ?? plates.all} alt={`Front and side elevation of Gipsy Danger${part.owns.length ? `, ${c.title} highlighted` : ''}`} />
          <figcaption>
            Fig. {index + 2}a — {part.owns.length ? `Location of the ${c.title}` : 'General arrangement'}: front and side elevation.
          </figcaption>
        </figure>
      )}

      {c.timeline && (
        <ol className="page__timeline">
          {c.timeline.map(([when, what], i) => (
            <li key={i}>
              <time>{when}</time>
              <p>{what}</p>
            </li>
          ))}
        </ol>
      )}

      <table className="page__specs">
        <caption>
          Table {index + 1} — {c.title} specifications
        </caption>
        <tbody>
          {c.specs.map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="page__figure">
        Fig. {index + 2}b — {c.title}, live view (right). Drag to inspect, click a part to jump to it.
      </p>

      <nav className="page__toc" aria-label="Report sections">
        <ol>
          {PARTS.map((p, i) => (
            <li key={p.id}>
              <button className={i === index ? 'is-active' : ''} onClick={() => goTo(i)} aria-current={i === index ? 'page' : undefined}>
                <span>§{i + 1}</span>
                {PART_CONTENT[p.id].title}
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <p className="page__sources">
        Report by <Author /> · {SOURCES}
      </p>
    </article>
  )
}
