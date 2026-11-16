import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { DoorSymbol } from '@/components/door-symbol'
import { SiteHeader } from '@/components/site-header'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('design.gate')
  return { title: t('title') }
}

/** The design gate: both directions side by side, each with its idea, its motion and its pages. */
export default async function DesignGate({ params }: PageProps<'/[locale]/design'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('design.gate')
  const directions = [
    { key: 'a', name: t('aName'), idea: t('aIdea'), motion: t('aMotion') },
    { key: 'b', name: t('bName'), idea: t('bIdea'), motion: t('bMotion') },
  ] as const

  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <section className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-8 sm:pt-16">
          <h1 className="font-display text-5xl font-bold sm:text-6xl">{t('title')}</h1>
          <div className="first-line mt-4 max-w-sm" aria-hidden="true" />
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{t('intro')}</p>

          <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10">
            {directions.map((d) => (
              <article key={d.key} aria-labelledby={`dir-${d.key}`}>
                {d.key === 'a' ? (
                  <div className="flex h-56 items-end justify-center rounded-t-[9999px] bg-night pb-0">
                    <DoorSymbol tone="night" className="h-40 w-auto" />
                  </div>
                ) : (
                  <div className="flex h-56 flex-col justify-end border-b border-line pb-8">
                    <p className="font-display text-4xl font-bold">{d.name}</p>
                    <div className="first-line first-line-static mt-3" aria-hidden="true" />
                  </div>
                )}
                <h2 id={`dir-${d.key}`} className="font-display mt-6 text-4xl font-bold">{d.name}</h2>
                <p className="mt-3 text-lg leading-relaxed">{d.idea}</p>
                <h3 className="mt-6 font-medium">{t('motionLabel')}</h3>
                <p className="mt-1 text-ink-soft">{d.motion}</p>
                <h3 className="mt-6 font-medium">{t('pagesLabel')}</h3>
                <ul className="mt-2 divide-y divide-line border-y border-line" role="list">
                  <li>
                    <Link href={`/design/${d.key}`} className="flex min-h-12 items-center underline-offset-4 hover:underline">{t('pageHome')}</Link>
                  </li>
                  <li>
                    <Link href={`/design/${d.key}/projects/cafe-launch-campaign`} className="flex min-h-12 items-center underline-offset-4 hover:underline">{t('pageProject')}</Link>
                  </li>
                  <li>
                    <Link href={`/design/${d.key}/me`} className="flex min-h-12 items-center underline-offset-4 hover:underline">{t('pageMe')}</Link>
                  </li>
                  <li>
                    <a href={`/${locale}/design/${d.key}?intro=1`} className="flex min-h-12 items-center text-maroon underline-offset-4 hover:underline">{t('replay')}</a>
                  </li>
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
