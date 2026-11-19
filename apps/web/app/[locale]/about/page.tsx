import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { ArticlePage } from '@/components/site/article-page'
import { localeOf, type MetaProps } from '@/lib/locale-param'
import { publicMeta } from '@/lib/seo'

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const locale = await localeOf(params)
  const t = await getTranslations({ locale, namespace: 'about' })
  return publicMeta(locale, '/about', t('title'), t('lead'))
}

export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('about')
  return (
    <ArticlePage
      title={t('title')}
      lead={t('lead')}
      sections={[
        { id: 'why', heading: t('whyTitle'), body: <p>{t('why')}</p> },
        {
          id: 'how',
          heading: t('howTitle'),
          body: (
            <ul className="space-y-3" role="list">
              {(['how1', 'how2', 'how3'] as const).map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <span className="arch mt-2 inline-block h-4 w-3 flex-none bg-maroon" aria-hidden="true" />
                  {t(k)}
                </li>
              ))}
            </ul>
          ),
        },
        { id: 'for-who', heading: t('forWhoTitle'), body: <p>{t('forWho')}</p> },
        { id: 'fields', heading: t('fieldsTitle'), body: <p>{t('fields')}</p> },
        { id: 'honest', heading: t('honestTitle'), body: <p>{t('honest')}</p> },
      ]}
    />
  )
}
