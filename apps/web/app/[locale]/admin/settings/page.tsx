import { getTranslations, setRequestLocale } from 'next-intl/server'
import { DEFAULT_WORKSHOP_PRICE_DIRHAMS, type Locale } from '@forsa/shared'
import { formatters } from '@/lib/format'

/** Settings as the database holds them (base migration); changing them is a logged admin action. */
export default async function AdminSettings({ params }: PageProps<'/[locale]/admin/settings'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('adminArea')
  const f = formatters(locale)
  const rows: Array<[string, string]> = [
    [t('workshopPrice'), f.money(DEFAULT_WORKSHOP_PRICE_DIRHAMS)],
    [t('holdHours'), t('hours', { count: 48, n: f.num(48) })],
    [t('refundHours'), t('hours', { count: 48, n: f.num(48) })],
    [t('payments'), t('paymentsOff')],
  ]
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('settingsTitle')}</h1>
      <dl className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 py-4 sm:grid-cols-[16rem_1fr]">
            <dt className="text-ink-soft">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-sm text-ink-soft">{t('auditNote')}</p>
    </>
  )
}
