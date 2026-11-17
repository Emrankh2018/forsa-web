import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Settings } from '@/components/flows/settings'

export default async function SettingsPage({ params }: PageProps<'/[locale]/me/settings'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('settings')
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('title')}</h1>
      <div className="mt-10">
        <Settings />
      </div>
    </>
  )
}
