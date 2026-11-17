import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { projectBySlug, sampleParticipant } from '@forsa/shared/seed'
import { sampleApplications } from '@forsa/shared/seed/app'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { Door } from '@/components/site/door'
import { SectionHeading } from '@/components/ui/section-heading'
import { Tag } from '@/components/ui/states'

/** My projects: what I am working on, what I applied to, what I finished. Each a door at its own angle. */
export default async function MyProjects({ params }: PageProps<'/[locale]/me/projects'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('me')
  const st = await getTranslations('app.state')
  const f = formatters(locale)
  const me = sampleParticipant
  const active = projectBySlug(me.activeProjectSlug)!

  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('myProjects')}</h1>
      <section className="mt-10" aria-labelledby="active">
        <SectionHeading id="active">{t('active')}</SectionHeading>
        <Link href={`/me/projects/${active.slug}`} className="room mt-6 grid max-w-2xl grid-cols-[7rem_1fr] items-end gap-5 rounded-md">
          <Door open={Math.round(8 + 72 * (me.stepsDone / active.steps.length))} className="h-36" />
          <span>
            <span className="block text-sm text-ink-soft">{f.pick(active.company)}</span>
            <span className="font-display block text-2xl font-bold">{f.pick(active.title)}</span>
            <span className="mt-1 block text-sm">{t('progress', { done: f.num(me.stepsDone), total: f.num(active.steps.length) })}</span>
          </span>
        </Link>
      </section>
      <section className="mt-14" aria-labelledby="applications">
        <SectionHeading id="applications">{t('applications')}</SectionHeading>
        <ul className="mt-6 max-w-2xl divide-y divide-line border-y border-line" role="list">
          {sampleApplications.map((a) => {
            const p = projectBySlug(a.projectSlug)!
            return (
              <li key={a.projectSlug} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-4">
                <Link href={`/projects/${p.slug}`} className="flex-1 font-medium underline-offset-4 hover:underline">{f.pick(p.title)}</Link>
                <span className="text-sm text-ink-soft">{f.day(a.at)}</span>
                <Tag>{st(a.state)}</Tag>
              </li>
            )
          })}
        </ul>
      </section>
      <section className="mt-14" aria-labelledby="finished">
        <SectionHeading id="finished">{t('finished')}</SectionHeading>
        <ul className="mt-6 max-w-2xl divide-y divide-line border-y border-line" role="list">
          {me.finished.map((x, i) => (
            <li key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-4">
              <span className="flex-1 font-medium">{f.pick(x.title)}</span>
              <span className="text-sm text-ink-soft">{f.pick(x.company)}</span>
              <Tag>{st('accepted')}</Tag>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
