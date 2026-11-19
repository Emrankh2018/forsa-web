import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { sampleAudit } from '@forsa/shared/seed/app'
import { formatters } from '@/lib/format'
import { AuditTable } from '@/components/more/tables'

export default async function AdminAudit({ params }: PageProps<'/[locale]/admin/audit'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('adminAudit')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">{t('lead')}</p>
      <div className="mt-10">
        <AuditTable
          fileName="forsa-audit.csv"
          rows={sampleAudit.map((r) => ({ at: r.at, when: `${f.day(r.at)} ${f.time(r.at)}`, who: f.pick(r.who), action: f.pick(r.action) }))}
        />
      </div>
    </>
  )
}
