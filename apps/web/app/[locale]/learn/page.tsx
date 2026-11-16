import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { sampleCourses, sampleSessionTypes, sampleWorkshops } from '@forsa/shared/seed'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { Door } from '@/components/site/door'
import { RoomHeader } from '@/components/ui/room-header'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('learn')
  return { title: t('title') }
}

/** The training hall: four doorways, one per kind of learning. */
export default async function LearnHub({ params }: PageProps<'/[locale]/learn'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('learn')
  const f = formatters(locale)
  const rooms = [
    { href: '/workshops', name: t('workshopsRoom'), line: t('workshopsLine'), behind: t('behindWorkshops', { date: f.day(sampleWorkshops[0]!.startsAt) }), open: 62 },
    { href: '/sessions', name: t('sessionsRoom'), line: t('sessionsLine'), behind: t('behindSessions', { count: sampleSessionTypes.length, n: f.num(sampleSessionTypes.length) }), open: 54 },
    { href: '/courses', name: t('coursesRoom'), line: t('coursesLine'), behind: t('behindCourses', { count: sampleCourses.length, n: f.num(sampleCourses.length) }), open: 58 },
    { href: '/guides', name: t('guidesRoom'), line: t('guidesLine'), behind: t('behindGuides'), open: 70 },
  ] as const

  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('title')} lead={t('lead')} />
        <ul className="mx-auto mt-16 grid max-w-7xl grid-cols-2 gap-x-4 gap-y-12 px-4 sm:gap-x-8 sm:px-8 lg:grid-cols-4" role="list">
          {rooms.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="room block rounded-md">
                <Door open={r.open} className="h-52 sm:h-72" light={<p className="text-sm font-medium leading-snug">{r.behind}</p>} />
                <div className="floor mx-[8%]" aria-hidden="true" />
                <h2 className="font-display mt-5 text-2xl font-bold sm:text-3xl">{r.name}</h2>
                <p className="mt-2 text-ink-soft">{r.line}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter sample />
    </>
  )
}
