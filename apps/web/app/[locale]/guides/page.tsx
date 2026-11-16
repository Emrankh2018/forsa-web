import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { guides } from '@forsa/shared/content'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { Door } from '@/components/site/door'
import { RoomHeader } from '@/components/ui/room-header'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('guidesPage')
  return { title: t('title') }
}

export default async function GuidesPage({ params }: PageProps<'/[locale]/guides'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('guidesPage')
  const f = formatters(locale)
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('title')} lead={t('lead')} />
        <ul className="mx-auto mt-16 grid max-w-7xl gap-x-8 gap-y-12 px-4 sm:px-8 md:grid-cols-3" role="list">
          {guides.map((g, i) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`} className="room block rounded-md">
                <Door open={56 + i * 8} className="h-56" light={<p className="text-sm font-medium">{t('minutes', { count: g.minutes, n: f.num(g.minutes) })}</p>} />
                <div className="floor mx-[8%]" aria-hidden="true" />
                <h2 className="font-display mt-5 text-3xl font-bold">{f.pick(g.title)}</h2>
                <p className="mt-2 text-ink-soft">{f.pick(g.summary)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  )
}
