import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { ArticlePage } from '@/components/site/article-page'
import { ErrorState } from '@/components/ui/states'
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
  const t = await getTranslations('privacy')
  const l = await getTranslations('legal')
  return (
    <ArticlePage
      title={t('title')}
      lead={t('lead')}
      notice={<ErrorState title={l('draft')} body={l('updated')} />}
      sections={(['collect', 'use', 'share', 'keep', 'contact'] as const).map((k) => ({
        id: k,
        heading: t(`${k}Title`),
        body: <p>{t(k)}</p>,
      }))}
    />
  )
}
