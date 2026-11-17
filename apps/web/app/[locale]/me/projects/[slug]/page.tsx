import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { projectBySlug, sampleParticipant } from '@forsa/shared/seed'
import { sampleWorkspace } from '@forsa/shared/seed/app'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { Door } from '@/components/site/door'
import { Workspace } from '@/components/app/workspace'

export function generateStaticParams() {
  return [{ slug: sampleParticipant.activeProjectSlug }]
}

/** The workspace for one project: the door shows how far along you are. */
export default async function WorkspacePage({ params }: PageProps<'/[locale]/me/projects/[slug]'>) {
  const { locale: raw, slug } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  if (slug !== sampleWorkspace.projectSlug) notFound()
  const project = projectBySlug(slug)!
  const t = await getTranslations('workspace')
  const f = formatters(locale)
  const ws = sampleWorkspace

  return (
    <>
      <Link href="/me" className="btn-quiet -ms-3 text-ink-soft underline underline-offset-4">{t('back')}</Link>
      <div className="mt-4 grid items-end gap-6 sm:grid-cols-[6rem_1fr]">
        <Door open={Math.round(8 + 72 * (ws.stepsDone / project.steps.length))} className="hidden h-28 sm:block" />
        <div>
          <p className="text-sm text-ink-soft">{f.pick(project.company)}</p>
          <h1 className="font-display mt-1 text-3xl font-bold sm:text-4xl">{f.pick(project.title)}</h1>
          <p className="mt-1 font-medium text-maroon">{t('due', { date: f.day(project.dueAt) })}</p>
        </div>
      </div>
      <div className="mt-8">
        <Workspace
          brief={project.brief.map(f.pick)}
          deliverables={project.deliverables.map(f.pick)}
          steps={project.steps.map(f.pick)}
          stepsDone={ws.stepsDone}
          stepNumbers={project.steps.map((_, i) => f.num(i + 1))}
          updates={ws.updates.map((u) => ({ date: f.day(u.at), text: f.pick(u.text), files: u.files }))}
          fileCounts={ws.updates.map((u) => t('files', { count: u.files, n: f.num(u.files) }))}
          questions={ws.questions.map((q) => ({ date: f.day(q.at), q: f.pick(q.q), a: q.a ? f.pick(q.a) : null }))}
        />
      </div>
    </>
  )
}
