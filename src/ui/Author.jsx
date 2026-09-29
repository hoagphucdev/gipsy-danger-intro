import { REPORT } from '../config/content'

/** Report author: name + e-mail link. */
export function Author() {
  const { name, email } = REPORT.author
  return (
    <>
      <span className="author__name">{name}</span>
      <a className="author__email" href={`mailto:${email}`}>
        {email}
      </a>
    </>
  )
}
