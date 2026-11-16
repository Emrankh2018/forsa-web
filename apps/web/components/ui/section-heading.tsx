import type { ReactNode } from 'react'

const sizes = { md: 'text-3xl', lg: 'text-4xl sm:text-5xl' } as const

/** A section heading in Amiri with the identity's first line under it. */
export function SectionHeading({ id, children, size = 'md', as: Tag = 'h2' }: { id?: string; children: ReactNode; size?: keyof typeof sizes; as?: 'h2' | 'h3' }) {
  return (
    <div>
      <Tag id={id} className={`font-display font-bold ${sizes[size]}`}>{children}</Tag>
      <div className={`first-line first-line-static mt-3 ${size === 'lg' ? 'w-48' : 'w-32'}`} aria-hidden="true" />
    </div>
  )
}

/** A short vertical hairline between inline facts (instead of "A · B · C"). */
export function Divider({ tone = 'paper' }: { tone?: 'paper' | 'night' }) {
  return <span className={`mx-2 inline-block h-3 w-px align-middle ${tone === 'paper' ? 'bg-line' : 'bg-night-line'}`} aria-hidden="true" />
}
