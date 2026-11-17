import { Amiri, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google'

/**
 * Display: Amiri Bold (Arabic and its own Latin). Text: IBM Plex Sans Arabic, with IBM Plex Sans
 * for English. Only weights in use are declared; preloaded files are downloaded on every page.
 */
export const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['700'],
  variable: '--font-amiri',
  display: 'swap',
})

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-plex-arabic',
  display: 'swap',
})

// English text face: loaded on demand (not preloaded), so Arabic pages do not pay for it.
export const plex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-plex',
  display: 'swap',
  preload: false,
})
