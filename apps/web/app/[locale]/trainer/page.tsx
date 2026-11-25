import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { Door, seatAngle } from '@/components/site/door'
import { SectionHeading } from '@/components/ui/section-heading'
import { Tag } from '@/components/ui/states'
import { getTrainer, workshopLookup } from '@/lib/data'

/** Trainer home: what is coming up, each workshop a door opened by how full it is. */
export default async function TrainerHome({ params }: PageProps<'/[locale]/trainer'>) {
  const workshopBySlug = await workshopLookup('all')
  const sampleTrainer = await getTrainer()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('trainerArea')
  const me = await getTranslations('me')
  const st = await getTranslations('app.state')
  const w = await getTranslations('workshop')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">{me('greeting', { name: f.pick(sampleTrainer.name) })}</h1>
      <section className="mt-10" aria-labelledby="upcoming">
        <SectionHeading id="upcoming">{t('upcoming')}</SectionHeading>
        <ul className="mt-6 grid gap-8 sm:grid-cols-2" role="list">
          {sampleTrainer.workshops.map((x) => {
            const ws = workshopBySlug(x.slug)!
            const left = ws.capacity - ws.booked
            return (
              <li key={x.slug}>
                <Link href="/trainer/workshops" className="room grid grid-cols-[6rem_1fr] items-end gap-5 rounded-md">
                  <Door open={x.state === 'published' ? 90 - seatAngle(left, ws.capacity) : 0} className="h-32" />
                  <span>
                    <span className="font-display block text-2xl font-bold">{f.pick(ws.title)}</span>
                    <span className="mt-1 block text-sm text-ink-soft">{f.dayWeekday(ws.startsAt)}</span>
                    {x.state === 'published' ? <span className="mt-1 block text-sm">{w('seatsLeft', { count: left, n: f.num(left) })}</span> : null}
                    <span className="mt-2 block"><Tag tone={x.state === 'published' ? 'accent' : 'plain'}>{st(x.state)}</Tag></span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
