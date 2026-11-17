import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { projectBySlug } from '@forsa/shared/seed'
import { sampleApplicants, sampleOrg, sampleProjectPeople, sampleWorkspace } from '@forsa/shared/seed/app'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { Door } from '@/components/site/door'
import { SectionHeading } from '@/components/ui/section-heading'
import { Tag } from '@/components/ui/states'

/** Organisation home: what needs you now, as three doors you can walk through, then your projects. */
export default async function OrgHome({ params }: PageProps<'/[locale]/org'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('org')
  const st = await getTranslations('app.state')
  const f = formatters(locale)
  const toReview = sampleProjectPeople.filter((p) => p.state === 'submitted').length
  const unanswered = sampleWorkspace.questions.filter((q) => !q.a).length
  const applicants = sampleApplicants.length
  const items = [
    { href: '/org/projects/cafe-launch-campaign', text: t('toReview', { count: toReview, n: f.num(toReview) }), open: 60 },
    { href: '/org/projects/cafe-launch-campaign#questions', text: t('unanswered', { count: unanswered, n: f.num(unanswered) }), open: 40 },
    { href: '/org/projects/loyalty-programme', text: t('applicants', { count: applicants, n: f.num(applicants) }), open: 50 },
  ]
  const projects = ['cafe-launch-campaign', 'loyalty-programme'].map((s) => projectBySlug(s)!)

  return (
    <>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">{f.pick(sampleOrg.name)}</h1>
      <section className="mt-10" aria-labelledby="needs-you">
        <SectionHeading id="needs-you">{t('needsYou')}</SectionHeading>
        <ul className="mt-6 grid gap-6 sm:grid-cols-3" role="list">
          {items.map((it) => (
            <li key={it.href}>
              <Link href={it.href} className="room grid grid-cols-[4.5rem_1fr] items-end gap-4 rounded-md">
                <Door open={it.open} className="h-24" />
                <span className="pb-1 text-lg font-medium leading-snug">{it.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-14" aria-labelledby="your-projects">
        <SectionHeading id="your-projects">{t('projectsTitle')}</SectionHeading>
        <ul className="mt-6 max-w-3xl divide-y divide-line border-y border-line" role="list">
          {projects.map((p) => (
            <li key={p.slug} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-4">
              <Link href={`/org/projects/${p.slug}`} className="font-display flex-1 text-xl font-bold underline-offset-4 hover:underline">{f.pick(p.title)}</Link>
              <Tag tone={p.joinMode === 'open' ? 'accent' : 'plain'}>{p.joinMode === 'open' ? st('active') : t('applicantsTitle')}</Tag>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
