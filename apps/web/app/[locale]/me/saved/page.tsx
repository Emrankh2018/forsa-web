import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { ProjectCard } from '@/components/site/project-card'
import { getParticipantHome, projectLookup } from '@/lib/data'

/** Saved projects and workshops (the hearts from the public pages). */
export default async function Saved({ params }: PageProps<'/[locale]/me/saved'>) {
  const projectBySlug = await projectLookup()
  const sampleParticipant = await getParticipantHome()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('me.nav')
  const saved = sampleParticipant.savedProjectSlugs.map((s) => projectBySlug(s)!)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('saved')}</h1>
      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4" role="list">
        {saved.map((p) => (
          <li key={p.slug}>
            <ProjectCard project={p} locale={locale} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </>
  )
}
