import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { ArrivalGate } from '@/components/arrival/arrival-gate'
import { ArrivalDoor } from '@/components/arrival/arrival-door'
import { Door } from '@/components/site/door'
import { ProjectCard } from '@/components/site/project-card'
import { WorkshopRow } from '@/components/site/workshop-row'
import { ScrollSwing } from '@/components/motion/scroll-swing'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { SectionHeading } from '@/components/ui/section-heading'
import { listProjects, listWorkshops, seatsLeft } from '@/lib/data'
import { localeOf, type MetaProps } from '@/lib/locale-param'
import { publicMeta } from '@/lib/seo'
import { OrganizationData } from '@/components/site/structured-data'

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  return publicMeta(await localeOf(params), '/', undefined)
}

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const sampleProjects = await listProjects()
  const sampleWorkshops = await listWorkshops()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('home')
  const a = await getTranslations('arrival')
  const f = formatters(locale)
  const open = sampleProjects.filter((x) => seatsLeft(x) > 0)
  const nextWorkshop = sampleWorkshops[0]!

  const rooms = [
    { id: 'projects', href: '/projects', name: t('roomProjects'), line: t('roomProjectsLine'), behind: t('behindProjects', { title: f.pick(open[0]!.title) }), open: 64 },
    { id: 'training', href: '/learn', name: t('roomTraining'), line: t('roomTrainingLine'), behind: t('behindTraining', { date: f.day(nextWorkshop.startsAt) }), open: 60 },
    { id: 'partners', href: '/partners', name: t('roomPartners'), line: t('roomPartnersLine'), behind: t('behindPartners'), open: 56 },
    { id: 'yours', href: '/join', name: t('roomYours'), line: t('roomYoursLine'), behind: t('behindYours'), open: 4 },
  ] as const

  return (
    <>
      <ArrivalGate storageKey="forsa.arrival" />
      <OrganizationData locale={locale} />
      <ArrivalDoor skipLabel={a('skip')} />
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-8 sm:pt-16">
          <h1 className="font-display max-w-4xl text-[clamp(2.5rem,6.2vw,5.75rem)] font-bold">{t('promise')}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">{t('lead')}</p>
        </section>

        {/* The hall: three doorways, each opened a little onto its room. */}
        <section className="mx-auto mt-12 max-w-7xl px-4 sm:mt-16 sm:px-8" aria-label={t('hallLabel')}>
          <ul className="hall" role="list">
            {rooms.map((r) => (
              <li key={r.id}>
                <Link href={r.href} className="room block rounded-md">
                  <Door
                    open={r.open}
                    openHover={80}
                    keyhole={r.id === 'yours'}
                    className={`door--framed h-[clamp(300px,28vw,380px)] ${r.id === 'yours' ? 'door--yours' : ''}`}
                    light={<p className={`font-medium leading-snug ${r.id === 'yours' ? 'text-ink' : ''}`}>{r.behind}</p>}
                  />
                  <div className="floor mx-[8%] -mt-[10px]" aria-hidden="true" />
                  <h2 className="font-display mt-5 text-3xl font-bold">{r.name}</h2>
                  <p className="mt-2 text-ink-soft">{r.line}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Open now: narrow doors standing ajar; the wider the gap, the more seats are left. */}
        <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-8" aria-labelledby="open-now">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading id="open-now" size="lg">{t('openNow')}</SectionHeading>
            <Link href="/projects" className="btn-quiet underline underline-offset-4">{t('allProjects')}</Link>
          </div>
          <ScrollSwing>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4" role="list">
            {sampleProjects.map((x) => (
              <li key={x.slug}>
                <ProjectCard project={x} locale={locale} />
              </li>
            ))}
          </ul>
          </ScrollSwing>
        </section>

        {/* Workshops: a corridor of dated doors. */}
        <section className="mx-auto mt-28 max-w-7xl px-4 sm:px-8" aria-labelledby="workshops">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading id="workshops" size="lg">{t('workshops')}</SectionHeading>
            <Link href="/workshops" className="btn-quiet underline underline-offset-4">{t('allTraining')}</Link>
          </div>
          <ul className="mt-8 divide-y divide-line border-y border-line" role="list">
            {sampleWorkshops.map((ws) => (
              <li key={ws.slug}>
                <WorkshopRow workshop={ws} locale={locale} />
              </li>
            ))}
          </ul>
        </section>

        {/* For organisations: one large doorway with the invitation written inside it. */}
        <section className="mx-auto mt-28 max-w-7xl px-4 sm:px-8">
          <div className="arch-wide bg-night px-6 pb-12 pt-[clamp(110px,16vw,190px)] text-on-night sm:px-16">
            <h2 className="font-display max-w-2xl text-4xl font-bold sm:text-5xl">{t('partnersTitle')}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-on-night-soft">{t('partnersBody')}</p>
            <Link href="/partners" className="btn-arch btn-arch--sand mt-8">{t('partnersCta')}</Link>
          </div>
        </section>
      </main>
      <SiteFooter sample rooms={false} />
    </>
  )
}
