import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { direction, toArabicDigits, type Locale } from '@forsa/shared'
import { SiteHeader } from '@/components/site/header'
import { RoomHeader } from '@/components/ui/room-header'
import { EmailFrame } from '@/components/emails/email-frame'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('emails')
  return { title: t('pageTitle'), robots: { index: false, follow: false } }
}

const kinds = ['code', 'booking', 'review', 'invite'] as const

/** Design of every email Forsa sends (the team's reference until a sender exists). */
export default async function EmailsShowcase({ params }: PageProps<'/[locale]/showcase/emails'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('emails')
  const c = await getTranslations('common')
  const sampleCode = locale === 'ar' ? toArabicDigits('482 916') : '482 916'

  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('pageTitle')} lead={t('pageLead')} tone="paper" />
        <ul className="mx-auto mt-14 grid max-w-6xl gap-14 px-4 sm:px-8 lg:grid-cols-2" role="list">
          {kinds.map((k) => (
            <li key={k}>
              <h2 className="font-display text-2xl font-bold">{t(`${k}.name`)}</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {t('subject')}: <span className="text-ink">{t(`${k}.subject`)}</span>
              </p>
              <div className="mt-4 rounded-lg border border-line p-3">
                <EmailFrame
                  dir={direction(locale)}
                  brand={c('brand')}
                  title={t(`${k}.title`)}
                  body={t(`${k}.body`)}
                  cta={k === 'code' ? undefined : t(`${k}.cta` as 'booking.cta')}
                  footer={t('footer')}
                >
                  {k === 'code' ? (
                    <>
                      <p style={{ fontSize: 34, fontWeight: 700, letterSpacing: '0.15em', margin: '22px 0 0' }} dir="ltr">{sampleCode}</p>
                      <p style={{ fontSize: 14, color: '#55615D', margin: '10px 0 0' }}>{t('code.note')}</p>
                    </>
                  ) : null}
                </EmailFrame>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
