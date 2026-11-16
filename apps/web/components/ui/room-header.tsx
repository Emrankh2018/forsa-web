import type { ReactNode } from 'react'

/**
 * The header of a section page: you have entered a room, and its wide arch frames the title.
 * Night with sand for the main rooms; paper-deep for quieter pages (about, terms).
 */
export function RoomHeader({ title, lead, kicker, tone = 'night', children }: { title: string; lead?: string; kicker?: ReactNode; tone?: 'night' | 'paper'; children?: ReactNode }) {
  const night = tone === 'night'
  return (
    <section className="mx-auto mt-4 max-w-7xl px-4 sm:px-8">
      <div className={`arch-wide px-6 pb-10 pt-[clamp(96px,13vw,160px)] sm:px-14 ${night ? 'bg-night text-on-night' : 'bg-paper-deep text-ink'}`}>
        {kicker ? <div className={night ? 'text-on-night-soft' : 'text-ink-soft'}>{kicker}</div> : null}
        <h1 className="font-display mt-2 max-w-4xl text-[clamp(2.25rem,5vw,4.25rem)] font-bold">{title}</h1>
        {lead ? <p className={`mt-4 max-w-2xl text-lg leading-relaxed ${night ? 'text-on-night-soft' : 'text-ink-soft'}`}>{lead}</p> : null}
        {children}
      </div>
      <div className={`mx-[4%] h-2 [clip-path:polygon(0_0,100%_0,97%_100%,3%_100%)] ${night ? 'bg-sand' : 'bg-maroon'}`} aria-hidden="true" />
    </section>
  )
}
