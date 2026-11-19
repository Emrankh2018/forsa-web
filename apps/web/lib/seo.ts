import type { Metadata } from 'next'
import type { Locale } from '@forsa/shared'

/**
 * A public page's own address and its twin in the other language, for search engines. Paths are
 * relative; the layout's metadataBase (SITE_URL) makes them absolute. Arabic is the default for
 * visitors whose language is neither (x-default). Use on public pages only.
 */
export function pageAlternates(locale: Locale, path: string): Metadata['alternates'] {
  const p = path === '/' ? '' : path
  return { canonical: `/${locale}${p}`, languages: { ar: `/ar${p}`, en: `/en${p}`, 'x-default': `/ar${p}` } }
}

/** Title, description and alternates of a public page in one call. */
export function publicMeta(locale: Locale, path: string, title: string | undefined, description?: string): Metadata {
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: pageAlternates(locale, path),
  }
}
