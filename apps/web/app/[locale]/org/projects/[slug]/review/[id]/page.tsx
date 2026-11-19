import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SectionHeading } from '@/components/ui/section-heading'
import { ReviewForm } from '@/components/app/review-form'
import { listHandIns, listProjectPeople, projectLookup } from '@/lib/data'

export async function generateStaticParams() {
  const submittedIds = Object.keys(await listHandIns('cafe-launch-campaign'))
  return submittedIds.map((id) => ({ slug: 'cafe-launch-campaign', id }))
}

/** Review one hand-in; switch between the submitted ones to compare them. */
export default async function ReviewPage({ params }: PageProps<'/[locale]/org/projects/[slug]/review/[id]'>) {
  const projectBySlug = await projectLookup()
  const { locale: raw, slug, id } = await params
  const sampleHandIns = await listHandIns(slug)
  const sampleProjectPeople = await listProjectPeople(slug)
  const submittedIds = Object.keys(sampleHandIns)
  const locale = raw as Locale
  setRequestLocale(locale)
  const handIn = sampleHandIns[id]
  const person = sampleProjectPeople.find((p) => p.id === id)
  if (slug !== 'cafe-launch-campaign' || !handIn || !person) notFound()
  const project = projectBySlug(slug)!
  const t = await getTranslations('org')
  const f = formatters(locale)

  return (
    <>
      <Link href={`/org/projects/${slug}`} className="btn-quiet -ms-3 text-ink-soft underline underline-offset-4">{f.pick(project.title)}</Link>
      <h1 className="font-display mt-3 text-3xl font-bold sm:text-4xl">{t('reviewTitle', { name: f.pick(person.name) })}</h1>

      <nav aria-label={t('compare')} className="mt-6">
        <ul className="flex flex-wrap gap-2" role="list">
          {submittedIds.map((sid) => {
            const p = sampleProjectPeople.find((x) => x.id === sid)!
            const on = sid === id
            return (
              <li key={sid}>
                <Link href={`/org/projects/${slug}/review/${sid}`} aria-current={on ? 'page' : undefined} className={`door-tab border border-line ${on ? 'door-tab--on' : ''}`}>
                  {f.pick(p.name)} <span className="text-xs">{t('version', { n: f.num(p.version ?? 1) })}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="hand-in">
          <SectionHeading id="hand-in">{t('handIn')}</SectionHeading>
          <p className="mt-2 text-sm text-ink-soft">{t('version', { n: f.num(person.version ?? 1) })}</p>
          <p className="mt-4 text-lg leading-relaxed">{f.pick(handIn.text)}</p>
          <ul className="mt-5 space-y-2" role="list">
            {handIn.links.map((l) => (
              <li key={l} dir="ltr" className="text-start"><span className="underline underline-offset-4">{l}</span></li>
            ))}
            {handIn.files.map((file) => (
              <li key={file} dir="ltr" className="flex items-center gap-2 text-start">
                <span className="arch inline-block h-4 w-3 bg-ink" aria-hidden="true" />
                {file}
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="decision-h" className="panel p-6">
          <h2 id="decision-h" className="font-display text-2xl font-bold">{t('decision')}</h2>
          <div className="mt-4">
            <ReviewForm ratingMarks={[1, 2, 3, 4, 5].map(f.num)} />
          </div>
        </section>
      </div>
    </>
  )
}
