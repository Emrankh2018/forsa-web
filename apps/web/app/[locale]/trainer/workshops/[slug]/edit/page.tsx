import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { workshopBySlug } from '@forsa/shared/seed'
import { sampleTrainer } from '@forsa/shared/seed/app'
import { formatters } from '@/lib/format'
import { WorkshopForm } from '@/components/more/workshop-form'

export function generateStaticParams() {
  return sampleTrainer.workshops.map((w) => ({ slug: w.slug }))
}

/** Editing one of the trainer's workshops: the form opens with what was sent before. */
export default async function EditWorkshop({ params }: PageProps<'/[locale]/trainer/workshops/[slug]/edit'>) {
  const { locale: raw, slug } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const w = sampleTrainer.workshops.some((x) => x.slug === slug) ? workshopBySlug(slug) : undefined
  if (!w) notFound()
  const t = await getTranslations('workshopForm')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('editTitle')}</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">{t('lead')}</p>
      <div className="mt-10">
        <WorkshopForm
          price={f.money(w.priceDirhams)}
          initial={{
            title: f.pick(w.title),
            summary: f.pick(w.summary),
            outcomes: w.outcomes.map(f.pick).join('\n'),
            date: w.startsAt.slice(0, 10),
            time: w.startsAt.slice(11, 16),
            minutes: String(w.minutes),
            mode: w.online ? 'online' : 'in_person',
            place: '',
            seats: String(w.capacity),
          }}
        />
      </div>
    </>
  )
}
