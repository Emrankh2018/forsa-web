import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { fields, projectBySlug, sampleProjects, seatsLeft } from '@forsa/shared/seed'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { Door, seatAngle } from '@/components/site/door'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { PhoneActionBar } from '@/components/site/phone-action-bar'
import { SectionHeading, Divider } from '@/components/ui/section-heading'
import { SignInPrompt } from '@/components/ui/sign-in-prompt'

export function generateStaticParams() {
  return sampleProjects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectPage({ params }: PageProps<'/[locale]/projects/[slug]'>) {
  const { locale: raw, slug } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const project = projectBySlug(slug)
  if (!project) notFound()
  const t = await getTranslations('project')
  const s = await getTranslations('signInPrompt')
  const u = await getTranslations('ui')
  const f = formatters(locale)
  const left = seatsLeft(project)
  const full = left === 0
  const cta = full ? t('fullCta') : project.joinMode === 'open' ? t('joinCta') : t('applyCta')

  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
          <Link href="/projects" className="btn-quiet -ms-3 text-ink-soft underline underline-offset-4">{t('back')}</Link>
        </div>

        {/* You have walked in: the room's arch frames the title. */}
        <section className="mx-auto mt-4 max-w-7xl px-4 sm:px-8">
          <div className="arch-wide bg-night px-6 pb-10 pt-[clamp(96px,14vw,170px)] text-on-night sm:px-14">
            <p className="text-on-night-soft">
              {f.pick(project.company)}
              <Divider tone="night" />
              {f.pick(fields[project.field])}
            </p>
            <h1 className="font-display mt-3 max-w-4xl text-[clamp(2.25rem,5vw,4.25rem)] font-bold">{f.pick(project.title)}</h1>
            <p className="mt-4 max-w-2xl text-lg text-on-night-soft">{f.pick(project.summary)}</p>
          </div>
          <div className="mx-[4%] h-2 bg-sand [clip-path:polygon(0_0,100%_0,97%_100%,3%_100%)]" aria-hidden="true" />
        </section>

        <div className="mx-auto mt-14 grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_20rem]">
          <article className="max-w-3xl">
            <section>
              <SectionHeading>{t('brief')}</SectionHeading>
              {project.brief.map((b, i) => (
                <p key={i} className="mt-5 text-lg leading-relaxed">{f.pick(b)}</p>
              ))}
            </section>

            <section className="mt-12">
              <SectionHeading>{t('deliverables')}</SectionHeading>
              <ul className="mt-5 space-y-3" role="list">
                {project.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg">
                    <span className="arch mt-1.5 inline-block h-4 w-3 flex-none bg-maroon" aria-hidden="true" />
                    {f.pick(d)}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <SectionHeading>{t('acceptance')}</SectionHeading>
              <ul className="mt-5 list-disc space-y-2 ps-6 text-lg marker:text-maroon">
                {project.acceptance.map((d, i) => (
                  <li key={i}>{f.pick(d)}</li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <SectionHeading>{t('steps')}</SectionHeading>
              <ol className="mt-6 grid gap-3 sm:grid-cols-5" role="list">
                {project.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 sm:flex-col">
                    <span className="arch flex h-14 w-10 flex-none items-end justify-center bg-paper-deep pb-1 font-display text-xl font-bold">
                      {f.num(i + 1)}
                    </span>
                    <span className="pt-2 sm:pt-0">{f.pick(s)}</span>
                  </li>
                ))}
              </ol>
            </section>

            <p className="mt-14 border-s-4 border-maroon ps-4 text-ink-soft">{t('noJobPromise')}</p>
          </article>

          {/* The side door: the facts and the one action. */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="arch bg-paper-deep px-6 pb-8 pt-28">
              <dl className="space-y-5">
                <div>
                  <dt className="text-sm text-ink-soft">{t('mode')}</dt>
                  <dd className="mt-1 font-medium">{project.joinMode === 'open' ? t('modeOpen') : t('modeApply')}</dd>
                  <dd className="text-sm text-ink-soft">{project.joinMode === 'open' ? t('modeOpenLine') : t('modeApplyLine')}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-soft">{t('seats')}</dt>
                  <dd className="mt-2 flex items-center gap-3">
                    <Door open={seatAngle(left, project.seats)} className="h-12 w-9 flex-none" />
                    <span>
                      <span className="block font-medium">{t('seatsLeft', { count: left, n: f.num(left) })}</span>
                      <span className="text-sm text-ink-soft">{t('seatsOf', { total: f.num(project.seats) })}</span>
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-soft">{t('dates')}</dt>
                  {project.applyBy ? <dd className="font-medium text-maroon">{t('applyBy', { date: f.day(project.applyBy) })}</dd> : null}
                  <dd>{t('starts', { date: f.day(project.startsAt) })}</dd>
                  <dd>{t('due', { date: f.day(project.dueAt) })}</dd>
                </div>
              </dl>
              <div className="mt-8 hidden lg:block">
                {full ? (
                  <span className="btn-arch w-full" aria-disabled="true">{cta}</span>
                ) : (
                  <SignInPrompt label={cta} returnTo={`/projects/${project.slug}`} title={s('title')} body={s('body')} continueLabel={s('continue')} notNowLabel={s('notNow')} />
                )}
              </div>
              <p className="mt-3 hidden text-sm text-ink-soft lg:block">{t('signInNote')}</p>
              <div className="mt-2">
                <SignInPrompt variant="quiet" label={t('save')} returnTo={`/projects/${project.slug}`} title={s('title')} body={s('body')} continueLabel={s('continue')} notNowLabel={s('notNow')} />
              </div>
            </div>
          </aside>
        </div>

      </main>
      <SiteFooter sample />
      <div className="h-20 lg:hidden" aria-hidden="true" />
      <PhoneActionBar label={u('pageAction')} fact={<><span className="block font-medium">{t('seatsLeft', { count: left, n: f.num(left) })}</span><span className="text-ink-soft">{project.applyBy && !full ? t('applyBy', { date: f.day(project.applyBy) }) : t('due', { date: f.day(project.dueAt) })}</span></>}>
        {full ? (
          <span className="btn-arch btn-arch--compact" aria-disabled="true">{cta}</span>
        ) : (
          <SignInPrompt variant="compact" label={cta} returnTo={`/projects/${project.slug}`} title={s('title')} body={s('body')} continueLabel={s('continue')} notNowLabel={s('notNow')} />
        )}
      </PhoneActionBar>
    </>
  )
}
