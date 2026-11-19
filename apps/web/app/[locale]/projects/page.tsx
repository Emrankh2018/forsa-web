import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { ProjectCard } from '@/components/site/project-card'
import { RoomHeader } from '@/components/ui/room-header'
import { EmptyState } from '@/components/ui/states'
import { listProjects, type FieldKey, type JoinMode, fields } from '@/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('projectsPage')
  return { title: t('title') }
}

const fieldKeys = Object.keys(fields) as FieldKey[]
const modes: JoinMode[] = ['open', 'apply']

/** All open projects, with text search and filters. Works without scripts (a plain GET form). */
export default async function ProjectsPage({ params, searchParams }: PageProps<'/[locale]/projects'>) {
  const sampleProjects = await listProjects()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const sp = await searchParams
  const q = (typeof sp.q === 'string' ? sp.q : '').trim().slice(0, 80)
  const field = fieldKeys.find((k) => k === sp.field)
  const mode = modes.find((m) => m === sp.mode)
  const t = await getTranslations('projectsPage')
  const p = await getTranslations('project')
  const f = formatters(locale)

  const needle = q.toLocaleLowerCase()
  const list = sampleProjects.filter((x) => {
    if (field && x.field !== field) return false
    if (mode && x.joinMode !== mode) return false
    if (!needle) return true
    return [x.title, x.summary, x.company].some((b) => b.ar.toLocaleLowerCase().includes(needle) || b.en.toLocaleLowerCase().includes(needle))
  })
  const filtered = Boolean(q || field || mode)

  const chip = 'inline-flex min-h-11 items-center rounded-full border px-4 text-sm'
  const chipOn = `${chip} border-ink bg-ink text-paper`
  const chipOff = `${chip} border-line hover:border-ink`
  const href = (next: { field?: string; mode?: string }) => ({
    pathname: '/projects' as const,
    query: Object.fromEntries(Object.entries({ q: q || undefined, field, mode, ...next }).filter(([, v]) => v)),
  })

  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('title')} lead={t('lead')} />

        <section aria-label={t('filters')} className="mx-auto mt-12 max-w-7xl px-4 sm:px-8">
          <form action={`/${locale}/projects`} method="get" role="search" className="flex max-w-2xl flex-wrap items-end gap-3">
            <div className="min-w-0 flex-1">
              <label htmlFor="q" className="block font-medium">{t('search')}</label>
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={q}
                placeholder={t('searchPlaceholder')}
                className="mt-2 block min-h-12 w-full rounded-md border border-line bg-paper px-3 focus:border-ink focus:outline-none focus-visible:outline-3 focus-visible:outline-maroon"
              />
            </div>
            {field ? <input type="hidden" name="field" value={field} /> : null}
            {mode ? <input type="hidden" name="mode" value={mode} /> : null}
            <button type="submit" className="btn-arch">{t('apply')}</button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('field')}>
              <span className="me-1 text-sm text-ink-soft">{t('field')}</span>
              <Link href={href({ field: undefined })} className={!field ? chipOn : chipOff} aria-current={!field ? 'true' : undefined}>{t('all')}</Link>
              {fieldKeys.map((k) => (
                <Link key={k} href={href({ field: k })} className={field === k ? chipOn : chipOff} aria-current={field === k ? 'true' : undefined}>{f.pick(fields[k])}</Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('mode')}>
              <span className="me-1 text-sm text-ink-soft">{t('mode')}</span>
              <Link href={href({ mode: undefined })} className={!mode ? chipOn : chipOff} aria-current={!mode ? 'true' : undefined}>{t('all')}</Link>
              {modes.map((m) => (
                <Link key={m} href={href({ mode: m })} className={mode === m ? chipOn : chipOff} aria-current={mode === m ? 'true' : undefined}>
                  {m === 'open' ? p('modeOpen') : p('modeApply')}
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-ink-soft" role="status">
            {t('results', { count: list.length, n: f.num(list.length) })}
            {filtered ? (
              <Link href="/projects" className="btn-quiet ms-2 underline underline-offset-4">{t('reset')}</Link>
            ) : null}
          </p>
        </section>

        <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-8">
          {list.length === 0 ? (
            <EmptyState title={t('emptyTitle')} body={t('emptyBody')} action={<Link href="/projects" className="btn-quiet -ms-3 underline underline-offset-4">{t('reset')}</Link>} />
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4" role="list">
              {list.map((x) => (
                <li key={x.slug}>
                  <ProjectCard project={x} locale={locale} headingLevel="h2" />
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
