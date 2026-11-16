import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { fields, projectBySlug, sampleProjects, seatsLeft } from '@forsa/shared/seed'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/design'
import { HeaderB } from '@/components/design-b/header-b'

export function generateStaticParams() {
  return sampleProjects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectB({ params }: PageProps<'/[locale]/design/b/projects/[slug]'>) {
  const { locale: raw, slug } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const project = projectBySlug(slug)
  if (!project) notFound()
  const t = await getTranslations('design.project')
  const d = await getTranslations('design')
  const f = formatters(locale)
  const left = seatsLeft(project)
  const full = left === 0
  const cta = full ? t('fullCta') : project.joinMode === 'open' ? t('joinCta') : t('applyCta')

  return (
    <>
      <HeaderB />
      <main id="content" tabIndex={-1} className="outline-none">
        <div className="b-row pt-4">
          <div className="hidden md:block" />
          <Link href="/design/b#projects" className="b-link inline-flex min-h-11 items-center text-ink-soft">{t('back')}</Link>
        </div>

        <article>
          <header className="b-row pt-8">
            <div className="b-margin">
              <p className="font-medium text-ink">{f.pick(project.company)}</p>
              <p>{f.pick(fields[project.field])}</p>
            </div>
            <div>
              <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-bold">{f.pick(project.title)}</h1>
              <div className="first-line first-line-static mt-3" aria-hidden="true" />
              <p className="mt-5 max-w-3xl text-xl leading-relaxed text-ink-soft">{f.pick(project.summary)}</p>
            </div>
          </header>

          <section className="b-row mt-14" aria-labelledby="brief">
            <div className="b-margin">
              <p className="font-medium text-ink">{t('mode')}</p>
              <p>{project.joinMode === 'open' ? t('modeOpen') : t('modeApply')}</p>
              <p className="mt-1 text-sm">{project.joinMode === 'open' ? t('modeOpenLine') : t('modeApplyLine')}</p>
            </div>
            <div className="b-rule pt-5">
              <h2 id="brief" className="font-display text-2xl font-bold">{t('brief')}</h2>
              {project.brief.map((b, i) => (
                <p key={i} className="mt-4 max-w-3xl text-lg leading-relaxed">{f.pick(b)}</p>
              ))}
            </div>
          </section>

          <section className="b-row mt-12" aria-labelledby="deliverables">
            <div className="b-margin">
              <p className="font-medium text-ink">{t('seats')}</p>
              <p>{t('seatsLeft', { count: left, n: f.num(left) })}</p>
              <p className="text-sm">{t('seatsOf', { total: f.num(project.seats) })}</p>
            </div>
            <div className="b-rule pt-5">
              <h2 id="deliverables" className="font-display text-2xl font-bold">{t('deliverables')}</h2>
              <ul className="mt-4 space-y-3" role="list">
                {project.deliverables.map((x, i) => (
                  <li key={i} className="flex items-start gap-3 border-b border-line pb-3 text-lg">
                    <span className="b-box" aria-hidden="true" />
                    {f.pick(x)}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="b-row mt-12" aria-labelledby="acceptance">
            <div className="b-margin">
              <p className="font-medium text-ink">{t('dates')}</p>
              {project.applyBy ? <p className="text-maroon">{t('applyBy', { date: f.day(project.applyBy) })}</p> : null}
              <p>{t('starts', { date: f.day(project.startsAt) })}</p>
              <p>{t('due', { date: f.day(project.dueAt) })}</p>
            </div>
            <div className="b-rule pt-5">
              <h2 id="acceptance" className="font-display text-2xl font-bold">{t('acceptance')}</h2>
              <ul className="mt-4 list-disc space-y-2 ps-6 text-lg marker:text-maroon">
                {project.acceptance.map((x, i) => (
                  <li key={i}>{f.pick(x)}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="b-row mt-12" aria-labelledby="steps">
            <div className="b-margin" />
            <div className="b-rule pt-5">
              <h2 id="steps" className="font-display text-2xl font-bold">{t('steps')}</h2>
              <ol className="mt-4" role="list">
                {project.steps.map((s, i) => (
                  <li key={i} className="flex items-baseline gap-4 border-b border-line py-3 text-lg">
                    <span className="font-display w-6 flex-none text-xl font-bold text-ink-soft">{f.num(i + 1)}</span>
                    {f.pick(s)}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* The last line is empty, waiting for the participant's name. */}
          <section className="b-row mt-16">
            <div className="b-margin b-mark hidden md:block" />
            <div>
              <div className="b-empty font-display text-2xl">{t('yourName')}</div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href="/design/b/me" aria-disabled={full || undefined} className="b-btn">{cta}</Link>
                <button type="button" className="b-link inline-flex min-h-11 items-center px-1">{t('save')}</button>
              </div>
              <p className="mt-3 text-sm text-ink-soft">{t('signInNote')}</p>
              <p className="mt-10 max-w-3xl text-ink-soft">{t('noJobPromise')}</p>
            </div>
          </section>
        </article>

        <footer className="b-row mt-16 pb-10">
          <div className="hidden md:block" />
          <p className="text-sm text-ink-soft">{d('sample')}</p>
        </footer>
      </main>
    </>
  )
}
