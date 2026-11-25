import { getTranslations } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { contactEmail, instagramUrl } from '@/lib/site'
import { getLegalPage } from '@/lib/data'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { RoomHeader } from '@/components/ui/room-header'
import { SectionHeading } from '@/components/ui/section-heading'

/** Privacy or terms: the draft notice, an "on this page" index, then sections with lists. */
export async function LegalPage({ kind, locale }: { kind: 'privacy' | 'terms'; locale: Locale }) {
  const doc = await getLegalPage(kind)
  const t = await getTranslations(kind)
  const l = await getTranslations('legal')
  const g = await getTranslations('guidesPage')
  const c = await getTranslations('contact')
  const f = formatters(locale)

  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('title')} lead={t('lead')} tone="paper" />
        <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-8">
          <aside aria-labelledby="legal-draft-title" className="max-w-3xl border-s-4 border-maroon bg-maroon-tint px-5 py-4">
            <p id="legal-draft-title" className="font-medium text-maroon">{l('draft')}</p>
            <p className="mt-1 text-ink">{l('updated')}</p>
          </aside>
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[16rem_1fr]">
          <nav aria-labelledby="on-this-page" className="lg:sticky lg:top-6 lg:self-start">
            <h2 id="on-this-page" className="font-medium">{g('onThisPage')}</h2>
            <ol className="mt-3 border-s border-line" role="list">
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ms-px block border-s-2 border-transparent py-2 ps-4 hover:border-maroon">{f.pick(s.heading)}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="max-w-3xl">
            {doc.sections.map((s) => (
              <section key={s.id} id={s.id} className="mb-12 scroll-mt-6" aria-labelledby={`${s.id}-h`}>
                <SectionHeading id={`${s.id}-h`}>{f.pick(s.heading)}</SectionHeading>
                <div className="mt-5 space-y-4 text-lg leading-relaxed">
                  {s.paragraphs?.map((p, i) => <p key={i}>{f.pick(p)}</p>)}
                  {s.items ? (
                    <ul className="list-disc space-y-2 ps-6 marker:text-maroon">
                      {s.items.map((it, i) => <li key={i}>{f.pick(it)}</li>)}
                    </ul>
                  ) : null}
                  {s.after?.map((p, i) => <p key={i}>{f.pick(p)}</p>)}
                  {s.contactLinks ? (
                    <ul className="flex flex-wrap gap-3 pt-2" role="list">
                      <li>
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-arch">
                          {c('instagramLink')} <span className="sr-only">{c('newTab')}</span>
                        </a>
                      </li>
                      <li>
                        <Link href="/contact" className="btn-quiet underline underline-offset-4">{c('title')}</Link>
                      </li>
                      {contactEmail ? (
                        <li>
                          <a href={`mailto:${contactEmail}`} dir="ltr" className="btn-quiet underline underline-offset-4">{contactEmail}</a>
                        </li>
                      ) : null}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
