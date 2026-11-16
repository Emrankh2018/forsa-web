import { formatDate, formatMoney, formatNumber, type Locale } from '@forsa/shared'
import type { Bilingual } from '@forsa/shared/seed'

/** Formatting helpers bound to the page's language (Qatar time, Arabic-Indic numerals in Arabic). */
export function formatters(locale: Locale) {
  return {
    pick: (b: Bilingual) => b[locale],
    dayNum: (at: string) => formatDate(at, locale, { day: 'numeric' }),
    day: (at: string) => formatDate(at, locale, { day: 'numeric', month: 'long' }),
    dayWeekday: (at: string) => formatDate(at, locale, { weekday: 'long', day: 'numeric', month: 'long' }),
    time: (at: string) => formatDate(at, locale, { hour: 'numeric', minute: '2-digit' }),
    num: (n: number) => formatNumber(n, locale),
    money: (dirhams: number) => formatMoney(dirhams, locale),
  }
}
