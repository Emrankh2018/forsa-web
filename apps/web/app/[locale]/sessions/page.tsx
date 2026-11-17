import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { sampleSessionTypes } from '@forsa/shared/seed'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { RoomHeader } from '@/components/ui/room-header'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('sessionsPage')
  return { title: t('title') }
}

/** 1-to-1 session types. Booking opens with trainers' availability (phase 6). */
export default async function SessionsPage({ params }: PageProps<'/[locale]/sessions'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('sessionsPage')
  const f = formatters(locale)
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('title')} lead={t('lead')} />
        <ul className="mx-auto mt-16 grid max-w-7xl gap-x-8 gap-y-12 px-4 sm:px-8 md:grid-cols-3" role="list">
          {sampleSessionTypes.map((st) => (
            <li key={st.slug} className="flex flex-col">
              <div className="arch flex h-40 items-end bg-paper-deep px-5 pb-4" aria-hidden="true">
                <span className="font-display text-5xl font-bold leading-none">{f.num(st.minutes)}</span>
              </div>
              <h2 className="font-display mt-5 text-2xl font-bold">{f.pick(st.title)}</h2>
              <p className="mt-1 text-sm text-ink-soft">{t('minutes', { count: st.minutes, n: f.num(st.minutes) })}</p>
              <p className="mt-3 flex-1">{f.pick(st.summary)}</p>
              <p className="mt-4 text-sm text-ink-soft">{t('priceLater')}</p>
              <Link href={`/sessions/${st.slug}/book`} className="btn-arch mt-4 self-start">{t('book')}</Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter sample />
    </>
  )
}
