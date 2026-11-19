import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { emailSamples, emailTemplates, renderEmail, type EmailKind, type Locale } from '@forsa/shared'
import { SiteHeader } from '@/components/site/header'
import { RoomHeader } from '@/components/ui/room-header'
import { localeOf, type MetaProps } from '@/lib/locale-param'
import { siteUrl } from '@/lib/site'

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: 'emails' })
  return { title: t('pageTitle'), robots: { index: false, follow: false } }
}

/**
 * Every email Forsa sends, rendered from the real templates in packages/shared/src/emails (the same
 * HTML a sender on the VPS will deliver), with fictional values. Nothing is sent.
 */
export default async function EmailsShowcase({ params }: PageProps<'/[locale]/showcase/emails'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('emails')
  const kinds = Object.keys(emailTemplates) as EmailKind[]
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('pageTitle')} lead={t('pageLead')} tone="paper" />
        <ul className="mx-auto mt-14 grid max-w-6xl gap-14 px-4 sm:px-8 lg:grid-cols-2" role="list">
          {kinds.map((k) => {
            const e = renderEmail(k, locale, emailSamples[locale], siteUrl)
            return (
              <li key={k}>
                <p className="text-sm text-ink-soft">{t('subject')}</p>
                <h2 className="font-display text-2xl font-bold">{e.subject}</h2>
                <iframe title={e.subject} srcDoc={e.html} className="mt-4 h-[30rem] w-full rounded-lg border border-line bg-paper" loading="lazy" />
              </li>
            )
          })}
        </ul>
      </main>
    </>
  )
}
