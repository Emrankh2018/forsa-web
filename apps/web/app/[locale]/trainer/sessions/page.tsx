import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SectionHeading } from '@/components/ui/section-heading'
import { Tag } from '@/components/ui/states'
import { BookingMarks, SessionTypeForm } from '@/components/more/forms'
import { listTrainerBookings, listTrainerSessionTypes } from '@/lib/data'

/** 1-to-1 sessions: the kinds offered, and the bookings (upcoming and earlier). */
export default async function TrainerSessions({ params }: PageProps<'/[locale]/trainer/sessions'>) {
  const sampleSessionBookings = await listTrainerBookings()
  const sampleSessionTypes = await listTrainerSessionTypes()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('trainerSessions')
  const f = formatters(locale)
  const typeName = (id: string) => f.pick(sampleSessionTypes.find((s) => s.id === id)!.name)
  const now = '2026-12-01'
  const upcoming = sampleSessionBookings.filter((b) => b.at >= now)
  const past = sampleSessionBookings.filter((b) => b.at < now)
  const row = (b: (typeof sampleSessionBookings)[number], marks: boolean) => (
    <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium">
          {f.pick(b.who)}
          <span className="font-normal text-ink-soft"> {typeName(b.type)}</span>
        </p>
        <p className="text-sm text-ink-soft"><time dateTime={b.at}>{f.dayWeekday(b.at)} {f.time(b.at)}</time></p>
      </div>
      <Tag tone={b.state === 'awaiting' ? 'accent' : 'plain'}>{t(`states.${b.state}`)}</Tag>
      {marks && b.state === 'confirmed' ? <BookingMarks doneLabel={t('markDone')} noShowLabel={t('markNoShow')} doneText={t('states.done')} noShowText={t('states.no_show')} /> : null}
    </li>
  )
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">{t('lead')}</p>
      <div className="mt-10 grid max-w-5xl gap-12 lg:grid-cols-[1fr_20rem]">
        <section aria-labelledby="bookings">
          <SectionHeading id="bookings">{t('bookings')}</SectionHeading>
          <h3 className="mt-6 font-medium">{t('upcoming')}</h3>
          <ul className="mt-2 divide-y divide-line border-y border-line" role="list">{upcoming.map((b) => row(b, true))}</ul>
          <h3 className="mt-8 font-medium">{t('past')}</h3>
          <ul className="mt-2 divide-y divide-line border-y border-line" role="list">{past.map((b) => row(b, false))}</ul>
        </section>
        <div className="space-y-8">
          <section aria-labelledby="types">
            <h2 id="types" className="font-display text-2xl font-bold">{t('types')}</h2>
            <ul className="mt-3 divide-y divide-line border-y border-line" role="list">
              {sampleSessionTypes.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                  <span className="font-medium">{f.pick(s.name)}</span>
                  <span className="text-sm text-ink-soft">{t('minutesShort', { n: f.num(s.minutes) })}</span>
                </li>
              ))}
            </ul>
          </section>
          <SessionTypeForm />
          <p className="text-sm text-ink-soft">
            {t('availability')} <Link href="/trainer/availability" className="underline underline-offset-4">{t('openAvailability')}</Link>
          </p>
        </div>
      </div>
    </>
  )
}
