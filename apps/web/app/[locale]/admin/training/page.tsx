import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { formatters } from '@/lib/format'
import { AdminList } from '@/components/more/admin-list'
import { getTrainer, listCourses, listWorkshops } from '@/lib/data'

export default async function AdminTraining({ params }: PageProps<'/[locale]/admin/training'>) {
  const sampleTrainer = await getTrainer()
  const sampleWorkshops = await listWorkshops()
  const sampleCourses = await listCourses()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('adminLists')
  const f = formatters(locale)
  const awaiting = new Set(sampleTrainer.workshops.filter((w) => w.state === 'awaiting_approval').map((w) => w.slug))
  const rows = [
    ...sampleWorkshops.map((w) => {
      const state = awaiting.has(w.slug) ? 'awaiting' : 'published'
      return {
        id: `w-${w.slug}`,
        cells: [f.pick(w.title), t('training.kinds.workshop'), f.day(w.startsAt)],
        filter: state,
        state: t(`training.states.${state}`),
        attention: state === 'awaiting',
        actions: state === 'awaiting' ? [{ label: t('training.publish'), done: t('training.published', { name: f.pick(w.title) }) }] : [],
      }
    }),
    ...sampleCourses.map((c) => ({
      id: `c-${c.slug}`,
      cells: [f.pick(c.title), t('training.kinds.course'), t('training.recorded')],
      filter: 'published',
      state: t('training.states.published'),
    })),
  ]
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('training.title')}</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">{t('training.lead')}</p>
      <div className="mt-10">
        <AdminList
          label={t('training.title')}
          columns={(['title', 'kind', 'when', 'state'] as const).map((c) => t(`training.cols.${c}`))}
          rows={rows}
          filters={(['published', 'awaiting'] as const).map((s) => ({ value: s, label: t(`training.states.${s}`) }))}
          counts={Array.from({ length: rows.length + 1 }, (_, n) => t('count', { n: f.num(n) }))}
        />
      </div>
    </>
  )
}
