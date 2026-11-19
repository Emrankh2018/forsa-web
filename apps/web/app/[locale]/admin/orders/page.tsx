import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { formatters } from '@/lib/format'
import { AdminList } from '@/components/more/admin-list'
import { listOrders } from '@/lib/data'

const states = ['reserved', 'paid', 'waived', 'cancelled'] as const

/** Orders for workshop seats. Payment is manual (D-115 era): the team marks paid or waives. */
export default async function AdminOrders({ params }: PageProps<'/[locale]/admin/orders'>) {
  const sampleOrders = await listOrders()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('adminLists')
  const f = formatters(locale)
  const rows = sampleOrders.map((o) => ({
    id: o.id,
    cells: [f.pick(o.who), f.pick(o.item), f.money(o.dirhams), f.day(o.at)],
    filter: o.state,
    state: t(`orders.states.${o.state}`),
    attention: o.state === 'reserved',
    actions:
      o.state === 'reserved'
        ? [
            { label: t('orders.markPaid'), done: t('orders.markedPaid', { name: f.pick(o.who) }) },
            { label: t('orders.waive'), done: t('orders.waived', { name: f.pick(o.who) }) },
          ]
        : [],
  }))
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('orders.title')}</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">{t('orders.lead')}</p>
      <p className="mt-4 max-w-2xl border-s-4 border-maroon ps-4 text-sm">{t('orders.online')}</p>
      <div className="mt-10">
        <AdminList
          label={t('orders.title')}
          columns={(['who', 'item', 'amount', 'at', 'state'] as const).map((c) => t(`orders.cols.${c}`))}
          rows={rows}
          filters={states.map((s) => ({ value: s, label: t(`orders.states.${s}`) }))}
          counts={Array.from({ length: rows.length + 1 }, (_, n) => t('count', { n: f.num(n) }))}
        />
      </div>
    </>
  )
}
