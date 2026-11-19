import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { sampleOrg } from '@forsa/shared/seed/app'
import { formatters } from '@/lib/format'
import { OrgSettingsForm } from '@/components/more/forms'

export default async function OrgSettings({ params }: PageProps<'/[locale]/org/settings'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('orgSettings')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('title')}</h1>
      <div className="mt-10">
        <OrgSettingsForm initial={{ orgName: f.pick(sampleOrg.name), sector: f.pick(sampleOrg.sector) }} />
      </div>
    </>
  )
}
