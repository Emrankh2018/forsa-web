import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { RoomHeader } from '@/components/ui/room-header'
import { localeOf, type MetaProps } from '@/lib/locale-param'

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: 'faq' })
  return { title: t('title') }
}

const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const

/** Questions as native disclosure widgets: keyboard and screen-reader friendly without scripts. */
export default async function FaqPage({ params }: PageProps<'/[locale]/faq'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('faq')
  const n = await getTranslations('nav')
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('title')} lead={t('lead')} tone="paper" />
        <div className="mx-auto mt-14 max-w-3xl px-4 sm:px-8">
          <ul className="divide-y divide-line border-y border-line" role="list">
            {ids.map((i) => (
              <li key={i}>
                <details className="group py-2">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-2 font-display text-xl font-bold [&::-webkit-details-marker]:hidden">
                    {t(`items.q${i}`)}
                    <span className="arch h-6 w-4 flex-none bg-ink transition-colors group-open:bg-maroon" aria-hidden="true" />
                  </summary>
                  <p className="pb-4 text-lg leading-relaxed">{t(`items.a${i}`)}</p>
                </details>
              </li>
            ))}
          </ul>
          <Link href="/partners" className="btn-quiet -ms-3 mt-8 underline underline-offset-4">{n('partners')}</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
