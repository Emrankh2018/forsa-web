import { intlTag, type Locale } from './locale'

/** Every date the platform computes is a Qatar date (Asia/Qatar, UTC+3, no daylight saving). */
export const QATAR_TIME_ZONE = 'Asia/Qatar'

/** The calendar date in Qatar for an instant, as YYYY-MM-DD. */
export function qatarDate(at: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: QATAR_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(at)
  const get = (type: string) => parts.find((p) => p.type === type)!.value
  return `${get('year')}-${get('month')}-${get('day')}`
}

/** A date for display, in Qatar time and the page's language and numerals. */
export function formatDate(at: Date | string, locale: Locale, options: Intl.DateTimeFormatOptions = { dateStyle: 'long' }): string {
  const value = typeof at === 'string' ? new Date(at) : at
  return new Intl.DateTimeFormat(intlTag(locale), { timeZone: QATAR_TIME_ZONE, ...options }).format(value)
}
