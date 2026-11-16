import type { CSSProperties, ReactNode } from 'react'

/**
 * A doorway: light behind, a leaf in front opened by `open` degrees (0 closed, about 85 wide
 * open). `light` is what you see through the gap. Decorative shape; text inside stays readable.
 */
export function Door({
  open,
  openHover,
  light,
  className = '',
  tone = 'paper',
  swing = false,
  style,
}: {
  open: number
  openHover?: number
  light?: ReactNode
  className?: string
  tone?: 'paper' | 'night'
  swing?: boolean
  style?: CSSProperties
}) {
  const vars = { '--open': open, '--open-hover': openHover ?? Math.min(84, open + 25), ...style } as CSSProperties
  return (
    <div
      className={`a-door ${tone === 'night' ? 'a-door--night' : ''} ${open === 0 ? 'a-door--closed' : ''} ${swing ? 'a-door--swing' : ''} ${className}`}
      style={vars}
    >
      {light ? <div className="a-door__light">{light}</div> : null}
      <div className="a-door__leaf" aria-hidden="true" />
    </div>
  )
}

/** Door angle for seats: wide open with many seats left, closed when full. */
export function seatAngle(left: number, total: number): number {
  if (left <= 0) return 0
  return Math.round(18 + 62 * (left / total))
}
