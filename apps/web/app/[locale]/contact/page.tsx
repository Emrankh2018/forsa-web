import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { ArticlePage } from '@/components/site/article-page'
import { localeOf, type MetaProps } from '@/lib/locale-param'
import { publicMeta } from '@/lib/seo'
import { contactEmail, instagramUrl } from '@/lib/site'

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const locale = await localeOf(params)
  const t = await getTranslations({ locale, namespace: 'contact' })
  return publicMeta(locale, '/contact', t('title'), t('lead'))
}

/**
 * How to reach Forsa. The email shows only when the owner sets NEXT_PUBLIC_CONTACT_EMAIL (no address
 * is invented); Instagram is the initiative's public account; organisations use the partner form.
 */
export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('contact')
  const link = 'font-bold text-maroon underline underline-offset-4'
  return (
    <ArticlePage
      title={t('title')}
      lead={t('lead')}
      sections={[
        {
          id: 'instagram',
          heading: t('instagramTitle'),
          body: (
            <>
              <p>{t('instagram')}</p>
              <p className="mt-3">
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={link}>
                  {t('instagramLink')} <span dir="ltr">@forsa.qa2026</span> <span className="sr-only">{t('newTab')}</span>
                </a>
              </p>
            </>
          ),
        },
        ...(contactEmail
          ? [
              {
                id: 'email',
                heading: t('emailTitle'),
                body: (
                  <p>
                    {t('email')}{' '}
                    <a href={`mailto:${contactEmail}`} className={link} dir="ltr">
                      {contactEmail}
                    </a>
                  </p>
                ),
              },
            ]
          : []),
        {
          id: 'organisations',
          heading: t('orgTitle'),
          body: (
            <>
              <p>{t('org')}</p>
              <p className="mt-3"><Link href="/partners" className={link}>{t('orgLink')}</Link></p>
            </>
          ),
        },
        {
          id: 'questions',
          heading: t('faqTitle'),
          body: (
            <>
              <p>{t('faq')}</p>
              <p className="mt-3"><Link href="/faq" className={link}>{t('faqLink')}</Link></p>
            </>
          ),
        },
      ]}
    />
  )
}
