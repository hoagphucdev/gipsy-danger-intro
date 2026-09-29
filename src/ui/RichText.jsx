/** Renders a string where **double asterisks** mark highlighted figures or terms. */
export function RichText({ text }) {
  return text.split(/\*\*(.+?)\*\*/g).map((chunk, i) => (i % 2 ? <mark key={i}>{chunk}</mark> : chunk))
}
