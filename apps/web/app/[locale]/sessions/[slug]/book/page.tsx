import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { sampleSessionTypes } from '@forsa/shared/seed'
import { sampleTrainer } from '@forsa/shared/seed/app'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SiteHeader } from '@/components/site/header'
import { PrototypeBand } from '@/components/flows/prototype-band'
import { SlotPicker } from '@/components/flows/booking'

export function generateStaticParams() {
  return sampleSessionTypes.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata(): Promise<Metadata> {
  return { robots: { index: false, follow: false } }
}

/** Week of 13 December 2026 (Sunday) for the sample slots. */
const weekStart = Date.parse('2026-12-13T00:00:00+03:00')

export default async function BookSession({ params }: PageProps<'/[locale]/sessions/[slug]/book'>) {
  const { locale: raw, slug } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const st = sampleSessionTypes.find((s) => s.slug === slug)
  if (!st) notFound()
  const t = await getTranslations('slots')
  const f = formatters(locale)
  const iso = (day: number, hour: number) => new Date(weekStart + day * 86_400_000 + hour * 3_600_000).toISOString()
  const free = sampleTrainer.slots.filter((s) => !sampleTrainer.booked.some((b) => b.day === s.day && b.hour === s.hour))
  const dayNums = [...new Set(free.map((s) => s.day))]
  const days = dayNums.map((d) => ({
    label: f.dayWeekday(iso(d, 12)),
    slots: free.filter((s) => s.day === d).map((s) => ({ id: `${d}-${s.hour}`, label: f.time(iso(d, s.hour)), full: `${f.dayWeekday(iso(d, s.hour))} ${f.time(iso(d, s.hour))}` })),
  }))
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <PrototypeBand />
        <section className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-8">
          <Link href="/sessions" className="btn-quiet -ms-3 text-ink-soft underline underline-offset-4">{f.pick(st.title)}</Link>
          <h1 className="font-display mt-3 text-4xl font-bold">{t('title')}</h1>
          <p className="mt-3 text-lg text-ink-soft">{t('lead')}</p>
          <p className="mt-1 font-medium">{t('trainer', { name: f.pick(sampleTrainer.name) })}</p>
          <div className="mt-8">
            <SlotPicker days={days} />
          </div>
        </section>
      </main>
    </>
  )
}
