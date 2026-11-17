import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { projectBySlug } from '@forsa/shared/seed'
import { sampleApplicants, sampleProjectPeople, sampleWorkspace } from '@forsa/shared/seed/app'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SectionHeading } from '@/components/ui/section-heading'
import { Tag } from '@/components/ui/states'
import { AnswerQuestion, ApplicantPicker } from '@/components/app/org-widgets'

export function generateStaticParams() {
  return [{ slug: 'cafe-launch-campaign' }, { slug: 'loyalty-programme' }]
}

/**
 * One project, seen by its company: the progress table per participant (open challenge), or the
 * applications to choose from (apply first), and the participants' questions.
 */
export default async function OrgProject({ params }: PageProps<'/[locale]/org/projects/[slug]'>) {
  const { locale: raw, slug } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  if (slug !== 'cafe-launch-campaign' && slug !== 'loyalty-programme') notFound()
  const project = projectBySlug(slug)!
  const t = await getTranslations('org')
  const st = await getTranslations('app.state')
  const p = await getTranslations('project')
  const f = formatters(locale)
  const total = project.steps.length

  return (
    <>
      <Link href="/org/projects" className="btn-quiet -ms-3 text-ink-soft underline underline-offset-4">{t('projectsTitle')}</Link>
      <h1 className="font-display mt-3 text-3xl font-bold sm:text-4xl">{f.pick(project.title)}</h1>
      <p className="mt-2 text-ink-soft">
        {project.joinMode === 'open' ? p('modeOpen') : p('modeApply')}
        {' '}
        {project.applyBy ? p('applyBy', { date: f.day(project.applyBy) }) : p('due', { date: f.day(project.dueAt) })}
      </p>

      {project.joinMode === 'open' ? (
        <>
          <section className="mt-10" aria-labelledby="progress">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading id="progress">{t('progressTable')}</SectionHeading>
              <Link href={`/org/projects/${slug}/review/p2`} className="btn-quiet underline underline-offset-4">{t('compare')}</Link>
            </div>
            <div className="relative mt-6 overflow-x-auto" role="region" aria-label={t('people')} tabIndex={0}>
              <table className="w-full min-w-[36rem] border-collapse text-start">
                <caption className="sr-only">{t('progressTable')}</caption>
                <thead>
                  <tr className="border-b border-ink text-sm text-ink-soft">
                    <th scope="col" className="py-2 text-start font-medium">{t('colName')}</th>
                    <th scope="col" className="py-2 text-start font-medium">{t('colSteps')}</th>
                    <th scope="col" className="py-2 text-start font-medium">{t('colLast')}</th>
                    <th scope="col" className="py-2 text-start font-medium">{t('colState')}</th>
                    <th scope="col" className="py-2"><span className="sr-only">{t('reviewCta')}</span></th>
                  </tr>
                </thead>
                <tbody>
                  {sampleProjectPeople.map((m) => (
                    <tr key={m.id} className="border-b border-line">
                      <th scope="row" className="py-3 text-start font-medium">{f.pick(m.name)}</th>
                      <td className="py-3">
                        <span className="flex items-center gap-3">
                          <span className="flex gap-1" aria-hidden="true">
                            {Array.from({ length: total }, (_, i) => (
                              <span key={i} className={`arch inline-block h-5 w-3 ${i < m.stepsDone ? 'bg-maroon' : 'bg-paper-deep'}`} />
                            ))}
                          </span>
                          <span className="text-sm">{f.num(m.stepsDone)}/{f.num(total)}</span>
                        </span>
                      </td>
                      <td className="py-3 text-sm text-ink-soft">{f.day(m.lastUpdate)}</td>
                      <td className="py-3"><Tag tone={m.state === 'submitted' ? 'accent' : 'plain'}>{st(m.state)}</Tag></td>
                      <td className="py-3 text-end">
                        {m.state === 'submitted' ? (
                          <Link href={`/org/projects/${slug}/review/${m.id}`} className="btn-arch btn-arch--compact">{t('reviewCta')}</Link>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="questions" className="mt-14 max-w-3xl scroll-mt-6" aria-labelledby="questions-h">
            <SectionHeading id="questions-h">{t('questionsTitle')}</SectionHeading>
            <ul className="mt-6 space-y-6" role="list">
              {sampleWorkspace.questions.map((q, i) => (
                <li key={i} className="border-s-2 border-line ps-4">
                  <p className="font-medium">{f.pick(q.q)}</p>
                  <p className="text-sm text-ink-soft">{f.day(q.at)}</p>
                  {q.a ? <p className="mt-2 border-s-4 border-maroon ps-3">{f.pick(q.a)}</p> : <AnswerQuestion id={`answer-${i}`} />}
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <section className="mt-10 max-w-3xl" aria-labelledby="applicants">
          <SectionHeading id="applicants">{t('applicantsTitle')}</SectionHeading>
          <p className="mt-4 text-ink-soft">{t('applicantsLead')}</p>
          <div className="mt-6">
            <ApplicantPicker
              seats={project.seats}
              seatsTexts={Array.from({ length: project.seats + 1 }, (_, n) => t('seatsUsed', { used: f.num(n), total: f.num(project.seats) }))}
              applicants={sampleApplicants.map((a) => ({ id: a.id, name: f.pick(a.name), note: f.pick(a.note) }))}
            />
          </div>
        </section>
      )}
    </>
  )
}
