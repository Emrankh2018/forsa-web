import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { ArticlePage } from '@/components/site/article-page'
import { ErrorState } from '@/components/ui/states'
import { localeOf, type MetaProps } from '@/lib/locale-param'
import { publicMeta } from '@/lib/seo'

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const locale = await localeOf(params)
  const t = await getTranslations({ locale, namespace: 'terms' })
  return publicMeta(locale, '/terms', t('title'), t('lead'))
}

export default async function TermsPage({ params }: PageProps<'/[locale]/terms'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('terms')
  const l = await getTranslations('legal')
  return (
    <ArticlePage
      title={t('title')}
      lead={t('lead')}
      notice={<ErrorState title={l('draft')} body={l('updated')} />}
      sections={(['use', 'projects', 'work', 'payments', 'noJob'] as const).map((k) => ({
        id: k,
        heading: t(`${k}Title`),
        body: <p>{t(k)}</p>,
      }))}
    />
  )
}
