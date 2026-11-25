import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { LegalPage } from '@/components/site/legal-page'
import { localeOf, type MetaProps } from '@/lib/locale-param'
import { publicMeta } from '@/lib/seo'

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const locale = await localeOf(params)
  const t = await getTranslations({ locale, namespace: 'privacy' })
  return publicMeta(locale, '/privacy', t('title'), t('lead'))
}

export default async function PrivacyPage({ params }: PageProps<'/[locale]/privacy'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  return <LegalPage kind="privacy" locale={locale as Locale} />
}
