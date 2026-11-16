import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { fields, sampleCourses } from '@forsa/shared/seed'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { RoomHeader } from '@/components/ui/room-header'
import { Divider } from '@/components/ui/section-heading'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('coursesPage')
  return { title: t('title') }
}

export default async function CoursesPage({ params }: PageProps<'/[locale]/courses'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('coursesPage')
  const f = formatters(locale)
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('title')} lead={t('lead')} />
        <ul className="mx-auto mt-16 grid max-w-7xl gap-x-8 gap-y-14 px-4 sm:px-8 md:grid-cols-2" role="list">
          {sampleCourses.map((c) => {
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
