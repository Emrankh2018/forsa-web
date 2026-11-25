import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { DoorSymbol } from '@/components/door-symbol'

export const metadata: Metadata = { robots: { index: false, follow: false } }

/**
 * The share card (1200 × 630) drawn in the site's own fonts, so Arabic is shaped correctly.
 * `e2e/og.spec.ts` (OG=1) saves it to public/og/forsa-<locale>.png, which the page metadata uses.
 */
export default async function OgCard({ params }: PageProps<'/[locale]/showcase/og'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('home')
  const c = await getTranslations('common')
  return (
    <main id="content" tabIndex={0} aria-labelledby="share-card-title" className="max-w-[1200px] overflow-x-auto">
      <div className="grid h-[630px] w-[1200px] grid-cols-[1fr_330px] items-center gap-16 bg-night px-20 text-on-night">
        <div>
          <p className="font-display text-4xl font-bold text-sand">{c('brand')}</p>
          <div className="mt-6 flex h-1 items-center" aria-hidden="true">
            <span className="h-1 w-10 bg-sand" />
            <span className="h-px flex-1 bg-night-line" />
          </div>
          <h1 id="share-card-title" className="font-display mt-10 text-[76px] font-bold leading-[1.1]">{t('promise')}</h1>
        </div>
        <DoorSymbol tone="night" className="h-[420px] w-auto" />
      </div>
    </main>
  )
}
