import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { formatters } from '@/lib/format'
import { AvailabilityGrid } from '@/components/app/trainer-widgets'
import { getTrainer } from '@/lib/data'

const hours = [16, 17, 18, 19]

export default async function Availability({ params }: PageProps<'/[locale]/trainer/availability'>) {
  const sampleTrainer = await getTrainer()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('trainerArea')
  const f = formatters(locale)
  const days = t('days').split('|').slice(0, 5)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('availabilityTitle')}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">{t('availabilityLead')}</p>
      <div className="mt-8 max-w-4xl">
        <AvailabilityGrid
          days={days}
          hours={hours}
          hourLabels={hours.map((h) => f.time(`2026-12-13T${String(h).padStart(2, '0')}:00:00+03:00`))}
          initial={sampleTrainer.slots}
          booked={sampleTrainer.booked.map((b) => ({ day: b.day, hour: b.hour, label: t('bookedBy', { name: f.pick(b.name) }) }))}
        />
      </div>
    </>
  )
}
