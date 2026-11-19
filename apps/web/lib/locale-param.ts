import { hasLocale, type Locale } from 'next-intl'
import { routing } from '@/i18n/routing'

/** Props of a `generateMetadata` under `[locale]` that only needs the language. */
export type MetaProps = { params: Promise<{ locale: string }> }

/**
 * The language from the address, for `generateMetadata`. Metadata must pass the locale to
 * `getTranslations` itself: without it next-intl reads the request headers, which turns a
 * statically built route dynamic at request time and made unknown addresses under /me, /org and
 * /trainer answer 500 instead of 404 (audit 2026-11-19).
 */
export async function localeOf(params: MetaProps['params']): Promise<Locale> {
  const { locale } = await params
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale
}
