import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { projectBySlug, sampleParticipant, sampleWorkshops } from '@forsa/shared/seed'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { Door } from '@/components/site/door'
import { SectionHeading } from '@/components/ui/section-heading'
import { Tag } from '@/components/ui/states'

/** Participant home: one next step in your doorway, then your projects, learning and notices. */
export default async function ParticipantHome({ params }: PageProps<'/[locale]/me'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('me')
  const st = await getTranslations('app.state')
  const f = formatters(locale)
  const me = sampleParticipant
  const active = projectBySlug(me.activeProjectSlug)!
  const total = active.steps.length
  const next = active.steps[me.stepsDone]!
  const angle = Math.round(8 + 72 * (me.stepsDone / total))
  const workshop = sampleWorkshops.find((w) => w.slug === me.bookedWorkshopSlug)!

  return (
    <>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">{t('greeting', { name: f.pick(me.firstName) })}</h1>

      <section className="mt-8 grid items-end gap-8 md:grid-cols-[minmax(0,20rem)_1fr]" aria-labelledby="next-step">
        <div>
          <Door
            open={angle}
            swing
            className="h-[clamp(240px,30vw,360px)]"
            light={<p className="text-sm font-medium">{t('progress', { done: f.num(me.stepsDone), total: f.num(total) })}</p>}
          />
          <div className="floor mx-[6%]" aria-hidden="true" />
        </div>
        <div className="pb-2">
          <p id="next-step" className="text-ink-soft">{t('nextStep')}</p>
          <h2 className="font-display mt-2 text-4xl font-bold sm:text-5xl">{f.pick(next)}</h2>
          <p className="mt-3 text-lg">{f.pick(active.title)}</p>
          <p className="mt-1 font-medium text-maroon">{t('nextStepDue', { date: f.day(me.nextStepDue) })}</p>
          <Link href={`/me/projects/${active.slug}`} className="btn-arch mt-6">{t('openWorkspace')}</Link>
        </div>
      </section>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <section aria-labelledby="my-projects">
          <SectionHeading id="my-projects">{t('myProjects')}</SectionHeading>
          <ul className="mt-6 divide-y divide-line border-y border-line" role="list">
            <li className="flex flex-wrap items-center gap-x-4 gap-y-1 py-4">
              <Link href={`/me/projects/${active.slug}`} className="font-display flex-1 text-xl font-bold underline-offset-4 hover:underline">{f.pick(active.title)}</Link>
              <Tag tone="accent">{st('active')}</Tag>
            </li>
            <li className="flex flex-wrap items-center gap-x-4 gap-y-1 py-4">
              <Link href="/projects/store-support-assistant" className="font-display flex-1 text-xl font-bold underline-offset-4 hover:underline">{f.pick(projectBySlug('store-support-assistant')!.title)}</Link>
              <Tag>{st('applied')}</Tag>
            </li>
            {me.finished.map((x, i) => (
              <li key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-4">
                <span className="font-display flex-1 text-xl font-bold">{f.pick(x.title)}</span>
                <Tag>{st('accepted')}</Tag>
              </li>
            ))}
          </ul>
        </section>
        <div className="space-y-12">
          <section aria-labelledby="my-learning">
            <SectionHeading id="my-learning">{t('learning')}</SectionHeading>
            <div className="mt-5 border-y border-line py-4">
              <p className="font-display text-xl font-bold">{f.pick(workshop.title)}</p>
              <p className="mt-1 text-sm text-ink-soft">{f.dayWeekday(workshop.startsAt)}</p>
              <div className="mt-2"><Tag tone="accent">{st('reserved')}</Tag></div>
            </div>
          </section>
          <section aria-labelledby="notices">
            <SectionHeading id="notices">{t('notices')}</SectionHeading>
            <ul className="mt-5 divide-y divide-line border-y border-line" role="list">
              <li className="py-3">{t('notice1')}</li>
              <li className="py-3"><Link href="/me/invitations" className="underline underline-offset-4">{t('notice2')}</Link></li>
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
