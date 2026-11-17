import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { RoomHeader } from '@/components/ui/room-header'
import { SectionHeading } from '@/components/ui/section-heading'

/** A quiet reading page (about, privacy, terms): paper room header, then titled sections. */
export function ArticlePage({ title, lead, notice, sections, after }: {
  title: string
  lead?: string
  notice?: ReactNode
  sections: Array<{ id: string; heading: string; body: ReactNode }>
  after?: ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={title} lead={lead} tone="paper" />
        <article className="mx-auto mt-14 max-w-3xl px-4 sm:px-8">
          {notice ? <div className="mb-10">{notice}</div> : null}
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="mb-12" aria-labelledby={`${s.id}-h`}>
              <SectionHeading id={`${s.id}-h`}>{s.heading}</SectionHeading>
              <div className="mt-5 space-y-4 text-lg leading-relaxed">{s.body}</div>
            </section>
          ))}
          {after}
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
