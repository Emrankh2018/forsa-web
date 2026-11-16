import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { direction } from '@forsa/shared'
import { routing } from '@/i18n/routing'
import { amiri, plex, plexArabic } from '@/lib/fonts'
import '../globals.css'
import '../site.css'

const isProduction = process.env.FORSA_ENV === 'production'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: { default: t('title'), template: `%s · ${t('title')}` },
    description: t('description'),
    robots: isProduction ? undefined : { index: false, follow: false },
    alternates: { languages: { ar: '/ar', en: '/en' } },
    icons: { icon: '/icon.svg' },
  }
}

export const viewport: Viewport = {
  themeColor: '#F4EFE6',
  width: 'device-width',
  initialScale: 1,
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations('common')

  return (
    <html lang={locale} dir={direction(locale)} suppressHydrationWarning className={`${amiri.variable} ${plexArabic.variable} ${plex.variable}`}>
      <body className="bg-paper text-ink antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          {t('skipToContent')}
        </a>
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
