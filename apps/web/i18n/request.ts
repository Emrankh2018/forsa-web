import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { messages } from '@forsa/shared/messages'
import { QATAR_TIME_ZONE } from '@forsa/shared'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale
  return { locale, messages: messages[locale], timeZone: QATAR_TIME_ZONE }
})
