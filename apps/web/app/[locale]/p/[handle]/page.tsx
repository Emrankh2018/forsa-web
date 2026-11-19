import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { fields, workshopBySlug } from '@forsa/shared/seed'
import { sampleRecord } from '@forsa/shared/seed/app'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { SectionHeading } from '@/components/ui/section-heading'
import { Tag } from '@/components/ui/states'
import { PrototypeBand } from '@/components/flows/prototype-band'

export function generateStaticParams() {
  return [{ handle: sampleRecord.handle }]
}

export async function generateMetadata({ params }: PageProps<'/[locale]/p/[handle]'>): Promise<Metadata> {
  const { locale, handle } = await params
  if (handle !== sampleRecord.handle) return {}
  return { title: sampleRecord.name[locale as Locale], robots: { index: false, follow: false } }
}

/**
 * A participant's public record: only work a company accepted, what the company said, and the
 * workshops attended. No contact details: companies reach people through Forsa.
 */
export default async function PublicRecord({ params }: PageProps<'/[locale]/p/[handle]'>) {
  const { locale: raw, handle } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  if (handle !== sampleRecord.handle) notFound()
  const t = await getTranslations('record')
  const f = formatters(locale)
  const r = sampleRecord
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <PrototypeBand />
        <div className="mx-auto max-w-5xl px-4 pt-12 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="arch h-32 w-24 flex-none bg-night" aria-hidden="true" />
            <div>
              <h1 className="font-display text-5xl font-bold">{f.pick(r.name)}</h1>
              <p className="mt-2 text-xl">{f.pick(r.headline)}</p>
              <p className="mt-1 text-ink-soft">{f.pick(r.city)}</p>
            </div>
          </div>
          <p className="mt-8 border-s-4 border-maroon ps-4 text-ink-soft">{t('lead')}</p>

          <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_16rem]">
            <section aria-labelledby="accepted">
              <SectionHeading id="accepted">{t('accepted')}</SectionHeading>
              <ul className="mt-6 space-y-8" role="list">
                {r.accepted.map((a) => (
                  <li key={a.at} className="panel p-6">
                    <h3 className="font-display text-2xl font-bold">{f.pick(a.title)}</h3>
                    <p className="mt-1 text-ink-soft">{t('for', { company: f.pick(a.company) })}</p>
                    <p className="text-sm text-ink-soft">{t('acceptedOn', { date: f.day(a.at) })}</p>
                    <h4 className="mt-5 font-medium">{t('said')}</h4>
                    <blockquote className="mt-2 border-s-2 border-line ps-4 text-lg">{f.pick(a.feedback)}</blockquote>
                    <h4 className="mt-5 font-medium">{t('strengths')}</h4>
                    <ul className="mt-2 flex flex-wrap gap-2" role="list">
                      {a.strengths.map((s) => <li key={s.en}><Tag tone="accent">{f.pick(s)}</Tag></li>)}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
            <aside className="space-y-10">
              <section aria-labelledby="fields">
                <h2 id="fields" className="font-medium">{t('fields')}</h2>
                <ul className="mt-2 flex flex-wrap gap-2" role="list">
                  {r.fields.map((k) => <li key={k}><Tag>{f.pick(fields[k])}</Tag></li>)}
                </ul>
              </section>
              <section aria-labelledby="skills">
                <h2 id="skills" className="font-medium">{t('skills')}</h2>
                <ul className="mt-2 flex flex-wrap gap-2" role="list">
                  {r.skills.map((s) => <li key={s.en}><Tag>{f.pick(s)}</Tag></li>)}
                </ul>
              </section>
              <section aria-labelledby="workshops">
                <h2 id="workshops" className="font-medium">{t('workshops')}</h2>
                <ul className="mt-2 space-y-2" role="list">
                  {r.workshops.map((slug) => {
                    const w = workshopBySlug(slug)
                    return w ? <li key={slug}><Link href={`/workshops/${slug}`} className="underline underline-offset-4">{f.pick(w.title)}</Link></li> : null
                  })}
                </ul>
              </section>
            </aside>
          </div>

          <p className="mt-14 text-sm text-ink-soft">{t('contact')}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-md bg-paper-deep p-4">
            <p className="flex-1">{t('yours')}</p>
            <Link href="/me/settings" className="btn-quiet underline underline-offset-4">{t('settings')}</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
