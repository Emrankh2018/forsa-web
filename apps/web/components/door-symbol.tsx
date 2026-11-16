/**
 * The open-door symbol, drawn from design/logo/forsa-symbol.svg. The light is maroon on paper and
 * sand on night (pass tone="night"). Decorative unless a label is given.
 */
export function DoorSymbol({ className, tone = 'paper', label }: { className?: string; tone?: 'paper' | 'night'; label?: string }) {
  const frame = tone === 'paper' ? 'var(--color-ink)' : 'var(--color-on-night)'
  const light = tone === 'paper' ? 'var(--color-maroon)' : 'var(--color-sand)'
  return (
    <svg
      viewBox="46 26 208 274"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d="M70 262V132a80 80 0 0 1 160 0v130z" fill={light} />
      <path d="M70 262V132A80 80 0 0 1 186 60.56V262z" fill={frame} />
      <path d="M56 262V132a94 94 0 0 1 188 0v130" fill="none" stroke={frame} strokeWidth="12" />
      <path d="M186 262h44l-6 34h-104z" fill={light} />
    </svg>
  )
}
