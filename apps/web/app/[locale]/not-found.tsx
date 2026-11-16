import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { SiteHeader } from '@/components/site-header'

export default async function NotFound() {
  const t = await getTranslations('notFound')
  return (
    <>
    <SiteHeader />
    <main id="content" tabIndex={-1} className="outline-none">
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <div className="first-line max-w-sm" aria-hidden="true" />
      <h1 className="font-display mt-8 text-4xl font-bold sm:text-6xl">{t('title')}</h1>
      <p className="mt-4 text-lg text-ink-soft">{t('body')}</p>
      <Link href="/" className="mt-8 inline-flex min-h-11 items-center rounded-md bg-ink px-5 font-medium text-paper">
        {t('back')}
      </Link>
    </section>
    </main>
    </>
  )
}
