import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { RoomHeader } from '@/components/ui/room-header'
import { SectionHeading } from '@/components/ui/section-heading'
import { StarBuilder } from '@/components/guides/star-builder'
import { PrintButton } from '@/components/guides/print-button'
import { PitchBuilder } from '@/components/guides/pitch-builder'
import { CvChecker } from '@/components/guides/cv-checker'
import { guideLookup, listGuides } from '@/lib/data'
import { publicMeta } from '@/lib/seo'

export async function generateStaticParams() {
  const guides = await listGuides()
  return guides.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/guides/[slug]'>): Promise<Metadata> {
  const guideBySlug = await guideLookup()
  const { locale, slug } = await params
  const g = guideBySlug(slug)
  return g ? publicMeta(locale as Locale, `/guides/${slug}`, g.title[locale as Locale], g.summary[locale as Locale]) : {}
}

/** A guide: an "on this page" index, sections with checklists, a tool where it helps, next steps. */
export default async function GuidePage({ params }: PageProps<'/[locale]/guides/[slug]'>) {
  const guideBySlug = await guideLookup()
  const { locale: raw, slug } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const g = guideBySlug(slug)
  if (!g) notFound()
  const t = await getTranslations('guidesPage')
  const star = await getTranslations('star')
  const f = formatters(locale)
  const starLabels = Object.fromEntries(
    (['title', 'lead', 'situation', 'situationHint', 'task', 'taskHint', 'action', 'actionHint', 'result', 'resultHint', 'preview', 'empty', 'copy', 'copied', 'clear'] as const).map((k) => [k, star(k)]),
  ) as Parameters<typeof StarBuilder>[0]['labels']

  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
          <Link href="/guides" className="btn-quiet -ms-3 text-ink-soft underline underline-offset-4">{t('back')}</Link>
        </div>
        <RoomHeader title={f.pick(g.title)} lead={f.pick(g.summary)} kicker={t('minutes', { count: g.minutes, n: f.num(g.minutes) })} tone="paper" />

        <div className="mx-auto mt-14 grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[16rem_1fr]">
          <nav aria-labelledby="on-this-page" className="lg:sticky lg:top-6 lg:self-start">
            <h2 id="on-this-page" className="font-medium">{t('onThisPage')}</h2>
            <ol className="mt-3 border-s border-line" role="list">
              {g.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ms-px block border-s-2 border-transparent py-2 ps-4 hover:border-maroon">{f.pick(s.heading)}</a>
                </li>
              ))}
            </ol>
            <div className="mt-4">
              <PrintButton label={t('print')} />
            </div>
          </nav>

          <article className="max-w-3xl">
            {g.sections.map((s) => (
              <section key={s.id} id={s.id} className="mb-14 scroll-mt-6" aria-labelledby={`${s.id}-h`}>
                <SectionHeading id={`${s.id}-h`}>{f.pick(s.heading)}</SectionHeading>
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="mt-5 text-lg leading-relaxed">{f.pick(p)}</p>
                ))}
                {s.checklist ? (
                  <div className="mt-6">
                    <h3 className="font-medium">{t('checklist')}</h3>
                    <ul className="mt-3 divide-y divide-line border-y border-line" role="list">
                      {s.checklist.map((c, i) => (
                        <li key={i}>
                          <label className="flex min-h-12 cursor-pointer items-center gap-3 py-2">
                            <input type="checkbox" className="size-5 flex-none accent-maroon" />
                            <span>{f.pick(c)}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {g.toolAfter === s.id ? (
                  <div className="mt-10">
                    {g.tool === 'star' ? <StarBuilder labels={starLabels} marks={[1, 2, 3, 4].map(f.num)} /> : null}
                    {g.tool === 'pitch' ? <PitchBuilder /> : null}
                    {g.tool === 'cvcheck' ? <CvChecker /> : null}
                  </div>
                ) : null}
              </section>
            ))}

            <section aria-labelledby="next" className="border-t border-line pt-10">
              <h2 id="next" className="font-display text-3xl font-bold">{t('next')}</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {g.workshopSlug ? <Link href={`/workshops/${g.workshopSlug}`} className="btn-arch">{t('workshopCta')}</Link> : null}
                <Link href="/sessions" className={g.workshopSlug ? 'btn-quiet underline underline-offset-4' : 'btn-arch'}>{t('sessionCta')}</Link>
              </div>
            </section>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
