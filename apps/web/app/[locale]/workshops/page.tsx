import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { sampleWorkshops } from '@forsa/shared/seed'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { WorkshopRow } from '@/components/site/workshop-row'
import { RoomHeader } from '@/components/ui/room-header'
import { SectionHeading } from '@/components/ui/section-heading'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('workshopsPage')
  return { title: t('title') }
}

export default async function WorkshopsPage({ params }: PageProps<'/[locale]/workshops'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('workshopsPage')
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('title')} lead={t('lead')} />
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-8" aria-labelledby="upcoming">
          <SectionHeading id="upcoming">{t('upcoming')}</SectionHeading>
          <ul className="mt-6 divide-y divide-line border-y border-line" role="list">
            {sampleWorkshops.map((ws) => (
              <li key={ws.slug}>
                <WorkshopRow workshop={ws} locale={locale} headingLevel="h3" />
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter sample />
    </>
  )
}
