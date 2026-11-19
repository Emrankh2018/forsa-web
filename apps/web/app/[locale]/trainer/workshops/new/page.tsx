import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { formatters } from '@/lib/format'
import { WorkshopForm } from '@/components/more/workshop-form'

/** The workshop price comes from the platform settings (250 riyals, in dirhams). */
const SEAT_PRICE_DIRHAMS = 25_000

export default async function NewWorkshop({ params }: PageProps<'/[locale]/trainer/workshops/new'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('workshopForm')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('newTitle')}</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">{t('lead')}</p>
      <div className="mt-10">
        <WorkshopForm price={f.money(SEAT_PRICE_DIRHAMS)} />
      </div>
    </>
  )
}
