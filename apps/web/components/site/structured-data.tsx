import { getTranslations } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { instagramUrl, siteUrl } from '@/lib/site'

/**
 * Who Forsa is, for search engines (schema.org Organization), on the home page only. A data block,
 * not a script: the browser never runs it. `<` is escaped so text can never close the tag.
 */
export async function OrganizationData({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'meta' })
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t('title'),
    description: t('description'),
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/apple-icon.png`,
    sameAs: [instagramUrl],
    areaServed: 'QA',
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}
