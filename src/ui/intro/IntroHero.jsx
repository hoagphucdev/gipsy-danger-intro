import { useCallback } from 'react'
import { REPORT, STATS } from '../../config/content'
import { useExperienceStore } from '../../store/useExperienceStore'
import { Author } from '../Author'
import { SurveyReadout } from './SurveyReadout'
import { useBeginInput } from './useBeginInput'

/**
 * Landing page / technical report cover shown while loading and during the crane shot.
 * Begin (button, scroll down, Enter) hands over to the part-by-part tour.
 */
export function IntroHero() {
  const stage = useExperienceStore((s) => s.stage)
  const setStage = useExperienceStore((s) => s.setStage)
  const begin = useCallback(() => {
    if (useExperienceStore.getState().stage === 'intro') setStage('tour')
  }, [setStage])
  useBeginInput(begin)

  if (stage !== 'loading' && stage !== 'intro') return null
  const loading = stage === 'loading'

  return (
    <div className="intro">
      <header className="intro__bar">
        <span>{REPORT.program}</span>
        <span>{REPORT.id}</span>
      </header>

      <article className="intro__hero">
        <h1 className="intro__title" style={{ '--i': 1 }}>
          {REPORT.title}
        </h1>
        <p className="intro__subtitle" style={{ '--i': 2 }}>
          {REPORT.subtitle}
        </p>
        <p className="intro__author" style={{ '--i': 3 }}>
          <Author />
        </p>
        <p className="intro__meta" style={{ '--i': 3 }}>
          {REPORT.meta.join(' · ')}
        </p>

        <section className="intro__abstract" style={{ '--i': 4 }}>
          <h2>Abstract</h2>
          <p>{REPORT.abstract}</p>
          <p className="intro__keywords">
            <strong>Keywords</strong> {REPORT.keywords.join(' · ')}
          </p>
        </section>

        <div className="intro__cta" style={{ '--i': 5 }}>
          <button onClick={begin} disabled={loading}>
            {REPORT.cta} <span aria-hidden>↓</span>
          </button>
          <span>{REPORT.scrollHint}</span>
        </div>
      </article>

      <footer className="intro__footer">
        <dl className="intro__stats">
          {STATS.map(({ value, unit, label }, i) => (
            <div key={label} style={{ '--i': 6 + i }}>
              <dt>{label}</dt>
              <dd>
                {value} <small>{unit}</small>
              </dd>
            </div>
          ))}
        </dl>
        <SurveyReadout loading={loading} />
      </footer>
    </div>
  )
}
