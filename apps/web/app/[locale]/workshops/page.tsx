import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { fields, sampleWorkshops } from '@forsa/shared/seed'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { WorkshopRow } from '@/components/site/workshop-row'
import { RoomHeader } from '@/components/ui/room-header'
import { SectionHeading } from '@/components/ui/section-heading'
import { EmptyState } from '@/components/ui/states'
import { ListFilters } from '@/components/ui/list-filters'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('workshopsPage')
  return { title: t('title') }
}

const topics = ['career', 'marketing_media', 'applied_ai'] as const
const places = ['online', 'in_person'] as const

/** Coming workshops with text search and filters by topic and place (plain GET, no scripts needed). */
export default async function WorkshopsPage({ params, searchParams }: PageProps<'/[locale]/workshops'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const sp = await searchParams
  const q = (typeof sp.q === 'string' ? sp.q : '').trim().slice(0, 80)
  const topic = topics.find((k) => k === sp.topic)
  const where = places.find((k) => k === sp.where)
  const t = await getTranslations('workshopsPage')
  const lf = await getTranslations('listFilters')
  const pp = await getTranslations('projectsPage')
  const cp = await getTranslations('coursesPage')
  const f = formatters(locale)
  const needle = q.toLocaleLowerCase()
  const list = sampleWorkshops.filter((w) => {
    if (topic && w.field !== topic) return false
    if (where && (where === 'online') !== w.online) return false
    if (!needle) return true
    return [w.title, w.summary].some((b) => b.ar.toLocaleLowerCase().includes(needle) || b.en.toLocaleLowerCase().includes(needle))
  })
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('title')} lead={t('lead')} />
        <ListFilters
          pathname="/workshops"
          locale={locale}
          q={q}
          searchLabel={lf('workshopsSearch')}
          placeholder={lf('workshopsPlaceholder')}
          groups={[
            { param: 'topic', label: lf('topic'), current: topic, options: topics.map((k) => ({ value: k, label: k === 'career' ? cp('career') : f.pick(fields[k]) })) },
            { param: 'where', label: lf('where'), current: where, options: [{ value: 'online', label: lf('online') }, { value: 'in_person', label: lf('inPerson') }] },
          ]}
          resultsText={lf('workshopsResults', { count: list.length, n: f.num(list.length) })}
          filtered={Boolean(q || topic || where)}
          labels={{ filters: lf('workshopsFilters'), all: pp('all'), apply: pp('apply'), reset: pp('reset') }}
        />
        <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-8" aria-labelledby="upcoming">
          <SectionHeading id="upcoming">{t('upcoming')}</SectionHeading>
          {list.length === 0 ? (
            <div className="mt-6">
              <EmptyState title={lf('workshopsEmpty')} body={lf('emptyBody')} action={<Link href="/workshops" className="btn-quiet -ms-3 underline underline-offset-4">{pp('reset')}</Link>} />
            </div>
          ) : (
            <ul className="mt-6 divide-y divide-line border-y border-line" role="list">
              {list.map((ws) => (
                <li key={ws.slug}>
                  <WorkshopRow workshop={ws} locale={locale} headingLevel="h3" />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter sample />
    </>
  )
}
