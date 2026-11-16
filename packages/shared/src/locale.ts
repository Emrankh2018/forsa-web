/** The two interface languages. Arabic is the default and is written right to left. */
export const locales = ['ar', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ar'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

export function direction(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

/** The other language, for the language switch. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'ar' ? 'en' : 'ar'
}

/**
 * Intl locale tag used for formatting. Arabic pages show Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) in
 * display text; English pages show Western numerals. Dates and times are always in Qatar time.
 */
export function intlTag(locale: Locale): string {
  return locale === 'ar' ? 'ar-QA-u-nu-arab' : 'en-QA-u-nu-latn'
}

const arabicIndic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

/** Replaces Western digits in a display string with Arabic-Indic digits. */
export function toArabicDigits(text: string): string {
  return text.replace(/[0-9]/g, (d) => arabicIndic[Number(d)]!)
}

/** Replaces Arabic-Indic (and Eastern Arabic-Indic) digits with Western digits, for parsing input. */
export function toWesternDigits(text: string): string {
  return text
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
}

/** A number for display in the page's language. */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlTag(locale)).format(value)
}
