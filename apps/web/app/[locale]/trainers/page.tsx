import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { Door } from '@/components/site/door'
import { RoomHeader } from '@/components/ui/room-header'
import { SectionHeading } from '@/components/ui/section-heading'
import { localeOf, type MetaProps } from '@/lib/locale-param'

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: 'trainers' })
  return { title: t('title'), description: t('lead') }
}

/** Become a trainer. Until accounts exist, interest goes through the partner form (give a workshop). */
export default async function TrainersPage({ params }: PageProps<'/[locale]/trainers'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('trainers')
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('title')} lead={t('lead')} />
        <div className="mx-auto mt-16 grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_20rem]">
          <div className="max-w-3xl">
            <SectionHeading>{t('whatTitle')}</SectionHeading>
            <ul className="mt-6 grid gap-6 sm:grid-cols-3" role="list">
              {(['what1', 'what2', 'what3'] as const).map((k, i) => (
                <li key={k}>
                  <Door open={50 + i * 12} className="h-32" />
                  <p className="mt-4 text-lg">{t(k)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-14">
              <SectionHeading>{t('howTitle')}</SectionHeading>
              <p className="mt-5 text-lg leading-relaxed">{t('how')}</p>
            </div>
          </div>
          <aside className="lg:self-start">
            <div className="arch bg-night px-6 pb-8 pt-28 text-on-night">
              <p className="text-on-night-soft">{t('remote')}</p>
              <Link href={{ pathname: '/partners', query: { way: 'give_workshop' }, hash: 'interest' }} className="btn-arch btn-arch--sand mt-6">
                {t('cta')}
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
