import { defineRouting } from 'next-intl/routing'
import { defaultLocale, locales } from '@forsa/shared'

/** Every address starts with /ar or /en; Arabic is the default. */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
})
