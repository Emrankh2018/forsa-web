import { defineRouting } from 'next-intl/routing'
import { defaultLocale, locales } from '@forsa/shared'

/**
 * Every address starts with /ar or /en. Arabic is the default: the bare address always opens Arabic,
 * even in a browser set to English (many Arabic readers in Qatar use English browsers).
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
})
