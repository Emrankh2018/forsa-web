import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { fields, sampleProjects } from '@forsa/shared/seed'
import { sampleProjectStates } from '@forsa/shared/seed/app'
import { formatters } from '@/lib/format'
import { AdminList } from '@/components/more/admin-list'

const states = ['awaiting_approval', 'open', 'in_progress', 'closed'] as const

export default async function AdminProjects({ params }: PageProps<'/[locale]/admin/projects'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('adminLists')
  const f = formatters(locale)
  const rows = sampleProjects.map((p) => {
    const state = sampleProjectStates[p.slug] ?? 'open'
    return {
      id: p.slug,
      cells: [f.pick(p.title), f.pick(p.company), f.pick(fields[p.field])],
      filter: state,
      state: t(`projects.states.${state}`),
      attention: state === 'awaiting_approval',
      actions: state === 'awaiting_approval' ? [{ label: t('projects.approve'), done: t('projects.approved', { name: f.pick(p.title) }) }] : [],
    }
  })
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('projects.title')}</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">{t('projects.lead')}</p>
      <div className="mt-10">
        <AdminList
          label={t('projects.title')}
          columns={(['title', 'org', 'field', 'state'] as const).map((c) => t(`projects.cols.${c}`))}
          rows={rows}
          filters={states.map((s) => ({ value: s, label: t(`projects.states.${s}`) }))}
          counts={Array.from({ length: rows.length + 1 }, (_, n) => t('count', { n: f.num(n) }))}
        />
      </div>
    </>
  )
}
