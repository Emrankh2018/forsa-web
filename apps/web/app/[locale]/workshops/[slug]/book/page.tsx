import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SiteHeader } from '@/components/site/header'
import { PrototypeBand } from '@/components/flows/prototype-band'
import { WorkshopBooking } from '@/components/flows/booking'
import { listWorkshops, workshopLookup } from '@/lib/data'

export async function generateStaticParams() {
  const sampleWorkshops = await listWorkshops()
  return sampleWorkshops.filter((w) => w.booked < w.capacity).map((w) => ({ slug: w.slug }))
}

export async function generateMetadata(): Promise<Metadata> {
  return { robots: { index: false, follow: false } }
}

export default async function BookWorkshop({ params }: PageProps<'/[locale]/workshops/[slug]/book'>) {
  const workshopBySlug = await workshopLookup()
  const { locale: raw, slug } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const ws = workshopBySlug(slug)
  if (!ws || ws.booked >= ws.capacity) notFound()
  const t = await getTranslations('booking')
  const w = await getTranslations('workshop')
  const f = formatters(locale)
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <PrototypeBand />
        <section className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-8">
          <Link href={`/workshops/${ws.slug}`} className="btn-quiet -ms-3 text-ink-soft underline underline-offset-4">{f.pick(ws.title)}</Link>
          <h1 className="font-display mt-3 text-4xl font-bold">{t('title')}</h1>
          <div className="mt-8">
            <WorkshopBooking
              title={f.pick(ws.title)}
              when={`${f.dayWeekday(ws.startsAt)} ${f.time(ws.startsAt)}`}
              where={`${ws.online ? w('online') : w('inPerson')} ${w('minutes', { count: ws.minutes, n: f.num(ws.minutes) })}`}
              price={f.money(ws.priceDirhams)}
              calendar={{ slug: ws.slug, startsAt: ws.startsAt, minutes: ws.minutes, location: ws.online ? w('online') : w('inPerson') }}
              holdText={t('hold', { hours: f.num(48) })}
              meetingLink="https://meet.example.com/forsa-cv"
            />
          </div>
        </section>
      </main>
    </>
  )
}
