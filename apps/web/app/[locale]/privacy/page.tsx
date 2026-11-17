import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { ArticlePage } from '@/components/site/article-page'
import { ErrorState } from '@/components/ui/states'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('privacy')
  return { title: t('title') }
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
