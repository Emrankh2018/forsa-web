import { formatNumber, type Locale } from './locale'

/**
 * Money is stored as integer dirhams (100 dirhams = 1 Qatari riyal). Amounts are always computed on
 * the server from stored prices, never taken from the browser.
 */
export const DIRHAMS_PER_RIYAL = 100

/** The default workshop price: 250 QAR (decision D-074, plan V4). */
export const DEFAULT_WORKSHOP_PRICE_DIRHAMS = 25_000

export function isDirhams(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}

export function riyalsToDirhams(riyals: number): number {
  const dirhams = Math.round(riyals * DIRHAMS_PER_RIYAL)
  if (!isDirhams(dirhams)) throw new RangeError('amount must be a non-negative whole number of dirhams')
  return dirhams
}

/** "٢٥٠ ريال قطري" on Arabic pages, "QAR 250" on English pages; fractions only when present. */
export function formatMoney(dirhams: number, locale: Locale): string {
  if (!isDirhams(dirhams)) throw new RangeError('amount must be a non-negative whole number of dirhams')
  const riyals = dirhams / DIRHAMS_PER_RIYAL
  const text = Number.isInteger(riyals) ? formatNumber(riyals, locale) : formatNumber(Number(riyals.toFixed(2)), locale)
  return locale === 'ar' ? `${text} ريال قطري` : `QAR ${text}`
}
