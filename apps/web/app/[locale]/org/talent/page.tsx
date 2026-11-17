import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { sampleTalent } from '@forsa/shared/seed/app'
import { formatters } from '@/lib/format'
import { TalentList } from '@/components/app/talent-list'

export default async function Talent({ params }: PageProps<'/[locale]/org/talent'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('org')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('talentTitle')}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">{t('talentLead')}</p>
      <div className="mt-8 max-w-3xl">
        <TalentList people={sampleTalent.map((p) => ({ id: p.id, name: f.pick(p.name), project: f.pick(p.project), state: p.state, email: 'email' in p ? p.email : undefined }))} />
      </div>
    </>
  )
}
