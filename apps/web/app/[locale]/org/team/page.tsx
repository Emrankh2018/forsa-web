import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { formatters } from '@/lib/format'
import { TeamManager } from '@/components/more/forms'
import { listTeam } from '@/lib/data'

export default async function OrgTeam({ params }: PageProps<'/[locale]/org/team'>) {
  const sampleOrgTeam = await listTeam()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('orgTeam')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">{t('lead')}</p>
      <div className="mt-10">
        <TeamManager members={sampleOrgTeam.map((m) => ({ id: m.id, name: f.pick(m.name), role: m.role, pending: m.pending }))} />
      </div>
    </>
  )
}
