import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { Door, seatAngle } from '@/components/site/door'
import { projectLookup, seatsLeft } from '@/lib/data'

export default async function OrgProjects({ params }: PageProps<'/[locale]/org/projects'>) {
  const projectBySlug = await projectLookup()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('org')
  const p = await getTranslations('project')
  const f = formatters(locale)
  const projects = ['cafe-launch-campaign', 'loyalty-programme'].map((s) => projectBySlug(s)!)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('projectsTitle')}</h1>
      <ul className="mt-10 grid gap-8 sm:grid-cols-2" role="list">
        {projects.map((x) => {
          const left = seatsLeft(x)
          return (
            <li key={x.slug}>
              <Link href={`/org/projects/${x.slug}`} className="room grid grid-cols-[6rem_1fr] items-end gap-5 rounded-md">
                <Door open={seatAngle(left, x.seats)} className="h-32" />
                <span>
                  <span className="font-display block text-2xl font-bold">{f.pick(x.title)}</span>
                  <span className="mt-1 block text-sm text-ink-soft">{x.joinMode === 'open' ? p('modeOpen') : p('modeApply')}</span>
                  <span className="block text-sm">{t('seatsUsed', { used: f.num(x.seatsTaken), total: f.num(x.seats) })}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
