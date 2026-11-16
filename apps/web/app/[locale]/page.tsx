import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { SiteHeader } from '@/components/site-header'

/** Phase 0 shell: proves languages, direction, fonts and tokens. Replaced at the design gate. */
export default async function ShellPage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('shell')
  return (
    <>
    <SiteHeader />
    <main id="content" tabIndex={-1} className="outline-none">
    <section className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-8 sm:pt-28">
      <p className="text-sm font-medium text-ink-soft">{t('label')}</p>
      <div className="first-line mt-4 max-w-xl" aria-hidden="true" />
      <h1 className="font-display mt-8 max-w-3xl text-5xl font-bold sm:text-7xl">{t('headline')}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">{t('lead')}</p>
      <p className="mt-12 text-sm text-ink-soft">{t('note')}</p>
      <Link href="/design" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-ink px-5 font-medium text-paper">
        {t('designLink')}
      </Link>
    </section>
    </main>
    </>
  )
}
