import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { workshopBySlug } from '@forsa/shared/seed'
import { sampleTrainer } from '@forsa/shared/seed/app'
import { formatters } from '@/lib/format'
import { SectionHeading } from '@/components/ui/section-heading'
import { Tag } from '@/components/ui/states'
import { Attendance } from '@/components/app/trainer-widgets'

export default async function TrainerWorkshops({ params }: PageProps<'/[locale]/trainer/workshops'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('trainerArea')
  const st = await getTranslations('app.state')
  const f = formatters(locale)
  const [published, pending] = sampleTrainer.workshops.map((x) => ({ ...x, ws: workshopBySlug(x.slug)! }))
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl font-bold">{t('nav.workshops')}</h1>
        <button type="button" className="btn-arch">{t('newWorkshop')}</button>
      </div>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="attendees">
          <SectionHeading id="attendees">{f.pick(published!.ws.title)}</SectionHeading>
          <p className="mt-3 text-sm text-ink-soft">{f.dayWeekday(published!.ws.startsAt)}</p>
          <h3 className="mt-6 font-medium">{t('attendees')}</h3>
          <div className="mt-3">
            <Attendance people={sampleTrainer.attendees.map((a) => ({ name: f.pick(a.name), state: a.state }))} />
          </div>
        </section>
        <section aria-labelledby="pending">
          <SectionHeading id="pending">{f.pick(pending!.ws.title)}</SectionHeading>
          <div className="mt-4"><Tag>{st(pending!.state)}</Tag></div>
          <p className="mt-3 text-ink-soft">{f.pick(pending!.ws.summary)}</p>
        </section>
      </div>
    </>
  )
}
