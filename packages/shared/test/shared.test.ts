import { describe, expect, it } from 'vitest'
import {
  direction, formatDate, formatMoney, formatNumber, isLocale, otherLocale, qatarDate,
  riyalsToDirhams, toArabicDigits, toWesternDigits, DEFAULT_WORKSHOP_PRICE_DIRHAMS,
} from '../src'
import { messages } from '../src/messages'

describe('locale', () => {
  it('knows the two languages and their directions', () => {
    expect(isLocale('ar')).toBe(true)
    expect(isLocale('en')).toBe(true)
    expect(isLocale('fr')).toBe(false)
    expect(isLocale(undefined)).toBe(false)
    expect(direction('ar')).toBe('rtl')
    expect(direction('en')).toBe('ltr')
    expect(otherLocale('ar')).toBe('en')
  })
  it('shows Arabic-Indic numerals on Arabic pages and Western on English pages', () => {
    expect(formatNumber(1250, 'ar')).toBe('١٬٢٥٠')
    expect(formatNumber(1250, 'en')).toBe('1,250')
    expect(toArabicDigits('2026-11-17')).toBe('٢٠٢٦-١١-١٧')
    expect(toWesternDigits('٢٠٢٦ ۱۲')).toBe('2026 12')
  })
})

describe('money', () => {
  it('stores whole dirhams and shows riyals', () => {
    expect(DEFAULT_WORKSHOP_PRICE_DIRHAMS).toBe(25000)
    expect(formatMoney(25000, 'ar')).toBe('٢٥٠ ريال قطري')
    expect(formatMoney(25000, 'en')).toBe('QAR 250')
    expect(formatMoney(0, 'en')).toBe('QAR 0')
    expect(formatMoney(12550, 'en')).toBe('QAR 125.5')
    expect(riyalsToDirhams(250)).toBe(25000)
  })
  it('refuses negative or fractional dirhams', () => {
    expect(() => formatMoney(-1, 'ar')).toThrow(RangeError)
    expect(() => formatMoney(1.5, 'ar')).toThrow(RangeError)
    expect(() => riyalsToDirhams(-3)).toThrow(RangeError)
  })
})

describe('Qatar time', () => {
  it('uses the Qatar calendar date, not UTC', () => {
    // 22:30 UTC on 16 November is already 17 November in Qatar (UTC+3).
    expect(qatarDate(new Date('2026-11-16T22:30:00Z'))).toBe('2026-11-17')
    expect(qatarDate(new Date('2026-11-16T20:30:00Z'))).toBe('2026-11-16')
  })
  it('formats dates in the page language', () => {
    const at = new Date('2026-11-16T22:30:00Z')
    expect(formatDate(at, 'en')).toBe('November 17, 2026')
    expect(formatDate(at, 'ar')).toContain('١٧')
    expect(formatDate(at, 'ar')).toContain('٢٠٢٦')
  })
})

describe('messages', () => {
  const keys = (o: object, prefix = ''): string[] =>
    Object.entries(o).flatMap(([k, v]) => (typeof v === 'string' ? [prefix + k] : keys(v as object, `${prefix}${k}.`)))
  it('has the same keys in Arabic and English, with no empty text', () => {
    expect(keys(messages.en).sort()).toEqual(keys(messages.ar).sort())
    for (const locale of ['ar', 'en'] as const) {
      const walk = (o: object) => Object.values(o).forEach((v) => (typeof v === 'string' ? expect(v.trim()).not.toBe('') : walk(v)))
      walk(messages[locale])
    }
  })
  it('keeps Latin digits out of Arabic text', () => {
    const walk = (o: object): string[] => Object.values(o).flatMap((v) => (typeof v === 'string' ? [v] : walk(v)))
    for (const text of walk(messages.ar)) {
      if (text === 'English') continue
      // ICU plural selectors such as =0 are syntax, not visible text.
      expect(text.replace(/=\d+/g, '')).not.toMatch(/[0-9]/)
    }
  })
})
