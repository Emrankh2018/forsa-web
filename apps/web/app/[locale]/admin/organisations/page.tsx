import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { sampleOrganisations } from '@forsa/shared/seed/app'
import { formatters } from '@/lib/format'
import { AdminList } from '@/components/more/admin-list'

export default async function AdminOrganisations({ params }: PageProps<'/[locale]/admin/organisations'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('adminLists')
  const f = formatters(locale)
  const rows = sampleOrganisations.map((o) => ({
    id: o.id,
    cells: [f.pick(o.name), f.pick(o.sector), f.day(o.joined), f.num(o.projects)],
    filter: o.state,
    state: t(`organisations.states.${o.state}`),
    attention: o.state === 'pending',
    actions: o.state === 'pending' ? [{ label: t('organisations.verify'), done: t('organisations.verified', { name: f.pick(o.name) }) }] : [],
  }))
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('organisations.title')}</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">{t('organisations.lead')}</p>
      <div className="mt-10">
        <AdminList
          label={t('organisations.title')}
          columns={(['name', 'sector', 'joined', 'projects', 'state'] as const).map((c) => t(`organisations.cols.${c}`))}
          rows={rows}
          filters={(['verified', 'pending'] as const).map((s) => ({ value: s, label: t(`organisations.states.${s}`) }))}
          counts={Array.from({ length: rows.length + 1 }, (_, n) => t('count', { n: f.num(n) }))}
        />
      </div>
    </>
  )
}
