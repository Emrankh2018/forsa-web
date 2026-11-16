import { Amiri, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google'

/** Display: Amiri (Arabic and its own Latin). Text: IBM Plex Sans Arabic, with IBM Plex Sans for English. */
export const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
})

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-plex-arabic',
  display: 'swap',
})

export const plex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-plex',
  display: 'swap',
})
