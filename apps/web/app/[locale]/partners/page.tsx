import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { partnerWays, type Locale, type PartnerWay } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { Door } from '@/components/site/door'
import { RoomHeader } from '@/components/ui/room-header'
import { SectionHeading } from '@/components/ui/section-heading'
import { InterestForm } from '@/components/partners/interest-form'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('partners')
  return { title: t('title'), description: t('lead') }
}

/** Ways to partner, the interest form (stored for the admin queue), and direct registration. */
export default async function PartnersPage({ params, searchParams }: PageProps<'/[locale]/partners'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const sp = await searchParams
  const preselect = partnerWays.find((w) => w === sp.way) as PartnerWay | undefined
  const t = await getTranslations('partners')

  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('title')} lead={t('lead')} />

        <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-8" aria-labelledby="ways-title">
          <SectionHeading id="ways-title">{t('waysTitle')}</SectionHeading>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 lg:grid-cols-4" role="list">
            {partnerWays.map((w, i) => (
              <li key={w}>
                <Link href={{ pathname: '/partners', query: { way: w }, hash: 'interest' }} className="room block rounded-md">
                  <Door open={48 + i * 8} className="h-40 sm:h-52" />
                  <h3 className="font-display mt-4 text-2xl font-bold">{t(w)}</h3>
                  <p className="mt-2 text-ink-soft">{t(`${w}Line`)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="interest" className="mx-auto mt-24 grid max-w-7xl scroll-mt-6 gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_20rem]" aria-labelledby="form-title">
          <div className="max-w-3xl">
            <SectionHeading id="form-title">{t('formTitle')}</SectionHeading>
            <p className="mt-4 text-lg text-ink-soft">{t('formLead')}</p>
            <div className="mt-8">
              <InterestForm key={preselect ?? 'none'} preselect={preselect} />
            </div>
          </div>
          <aside className="lg:self-start">
            <div className="arch bg-night px-6 pb-8 pt-28 text-on-night">
              <h2 className="font-display text-2xl font-bold">{t('registerTitle')}</h2>
              <p className="mt-3 text-on-night-soft">{t('registerBody')}</p>
              <Link href="/join" className="btn-arch btn-arch--sand mt-6">{t('registerCta')}</Link>
            </div>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
