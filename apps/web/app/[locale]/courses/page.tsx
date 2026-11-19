import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { RoomHeader } from '@/components/ui/room-header'
import { Divider } from '@/components/ui/section-heading'
import { EmptyState } from '@/components/ui/states'
import { ListFilters } from '@/components/ui/list-filters'
import { listCourses, fields } from '@/lib/data'
import { localeOf, type MetaProps } from '@/lib/locale-param'

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: 'coursesPage' })
  return { title: t('title') }
}

const topics = ['career', 'marketing_media', 'applied_ai'] as const

export default async function CoursesPage({ params, searchParams }: PageProps<'/[locale]/courses'>) {
  const sampleCourses = await listCourses()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('coursesPage')
  const f = formatters(locale)
  const lf = await getTranslations('listFilters')
  const pp = await getTranslations('projectsPage')
  const sp = await searchParams
  const q = (typeof sp.q === 'string' ? sp.q : '').trim().slice(0, 80)
  const topic = topics.find((k) => k === sp.topic)
  const needle = q.toLocaleLowerCase()
  const list = sampleCourses.filter((c) => {
    if (topic && c.field !== topic) return false
    if (!needle) return true
    return [c.title, c.summary].some((b) => b.ar.toLocaleLowerCase().includes(needle) || b.en.toLocaleLowerCase().includes(needle))
  })
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('title')} lead={t('lead')} />
        <ListFilters
          pathname="/courses"
          locale={locale}
          q={q}
          searchLabel={lf('coursesSearch')}
          placeholder={lf('coursesPlaceholder')}
          groups={[{ param: 'topic', label: lf('topic'), current: topic, options: topics.map((k) => ({ value: k, label: k === 'career' ? t('career') : f.pick(fields[k]) })) }]}
          resultsText={lf('coursesResults', { count: list.length, n: f.num(list.length) })}
          filtered={Boolean(q || topic)}
          labels={{ filters: lf('coursesFilters'), all: pp('all'), apply: pp('apply'), reset: pp('reset') }}
        />
        {list.length === 0 ? (
          <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-8">
            <EmptyState title={lf('coursesEmpty')} body={lf('emptyBody')} action={<Link href="/courses" className="btn-quiet -ms-3 underline underline-offset-4">{pp('reset')}</Link>} />
          </div>
        ) : null}
        <ul className="mx-auto mt-10 grid max-w-7xl gap-x-8 gap-y-14 px-4 sm:px-8 md:grid-cols-2" role="list">
          {list.map((c) => {
            const lessons = c.modules.flatMap((m) => m.lessons)
            const minutes = lessons.reduce((n, l) => n + l.minutes, 0)
            return (
              <li key={c.slug}>
                <Link href={`/courses/${c.slug}`} className="room grid grid-cols-[6rem_1fr] gap-5 rounded-md sm:grid-cols-[8rem_1fr]">
                  <span className="arch flex h-36 flex-col justify-end gap-1 bg-night px-3 pb-3 text-on-night sm:h-44" aria-hidden="true">
                    {c.modules.map((m, i) => (
                      <span key={i} className="h-1 bg-sand" style={{ width: `${30 + 70 * (m.lessons.length / 3)}%` }} />
                    ))}
                  </span>
                  <div>
                    <p className="text-sm text-ink-soft">{c.field === 'career' ? t('career') : f.pick(fields[c.field])}</p>
                    <h2 className="font-display mt-1 text-2xl font-bold">{f.pick(c.title)}</h2>
                    <p className="mt-2 text-ink-soft">{f.pick(c.summary)}</p>
                    <p className="mt-3 text-sm">
                      {t('modules', { count: c.modules.length, n: f.num(c.modules.length) })}
                      <Divider />
                      {t('lessons', { count: lessons.length, n: f.num(lessons.length) })}
                      <Divider />
                      {t('totalMinutes', { count: minutes, n: f.num(minutes) })}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </main>
      <SiteFooter sample />
    </>
  )
}
