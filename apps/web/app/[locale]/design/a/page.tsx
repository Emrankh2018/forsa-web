import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { fields, sampleProjects, sampleWorkshops, seatsLeft } from '@forsa/shared/seed'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/design'
import { ArrivalGate } from '@/components/arrival/arrival-gate'
import { ArrivalDoor } from '@/components/arrival/arrival-door'
import { Door, seatAngle } from '@/components/design-a/door'
import { HeaderA, SampleNote } from '@/components/design-a/header-a'

export default async function HomeA({ params }: PageProps<'/[locale]/design/a'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('design.home')
  const p = await getTranslations('design.project')
  const w = await getTranslations('design.workshop')
  const a = await getTranslations('design.arrival')
  const f = formatters(locale)
  const open = sampleProjects.filter((x) => seatsLeft(x) > 0)
  const nextWorkshop = sampleWorkshops[0]!

  const rooms = [
    { id: 'projects', href: '/design/a#projects', name: t('roomProjects'), line: t('roomProjectsLine'), behind: t('behindProjects', { title: f.pick(open[0]!.title) }), open: 64 },
    { id: 'training', href: '/design/a#training', name: t('roomTraining'), line: t('roomTrainingLine'), behind: t('behindTraining', { date: f.day(nextWorkshop.startsAt) }), open: 60 },
    { id: 'partners', href: '/design/a#partners', name: t('roomPartners'), line: t('roomPartnersLine'), behind: t('behindPartners'), open: 56 },
  ]

  return (
    <>
      <ArrivalGate storageKey="forsa.arrival.a" />
      <ArrivalDoor skipLabel={a('skip')} />
      <HeaderA />
      <main id="content" tabIndex={-1} className="outline-none">
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-8 sm:pt-16">
          <h1 className="font-display max-w-4xl text-[clamp(2.5rem,6.2vw,5.75rem)] font-bold">{t('promise')}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">{t('lead')}</p>
        </section>

        {/* The hall: three doorways, each opened a little onto its room. */}
        <section className="mx-auto mt-12 max-w-7xl px-4 sm:mt-16 sm:px-8" aria-label={t('roomProjects')}>
          <ul className="a-hall" role="list">
            {rooms.map((r) => (
              <li key={r.id}>
                <Link href={r.href} className="a-room group block rounded-md">
                  <Door
                    open={r.open}
                    openHover={80}
                    className="a-door--framed h-[clamp(300px,30vw,400px)]"
                    light={<p className="font-medium leading-snug">{r.behind}</p>}
                  />
                  <div className="a-floor mx-[8%] -mt-[10px]" aria-hidden="true" />
                  <h2 className="font-display mt-5 text-3xl font-bold">{r.name}</h2>
                  <p className="mt-2 text-ink-soft">{r.line}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Open now: narrow doors standing ajar; the wider the gap, the more seats are left. */}
        <section id="projects" className="mx-auto mt-24 max-w-7xl scroll-mt-8 px-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl font-bold sm:text-5xl">{t('openNow')}</h2>
              <div className="first-line first-line-static mt-4 w-48" aria-hidden="true" />
            </div>
            <Link href="/design/a#projects" className="a-btn-quiet underline underline-offset-4">{t('allProjects')}</Link>
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {sampleProjects.map((x) => {
              const left = seatsLeft(x)
              return (
                <li key={x.slug}>
                  <Link href={`/design/a/projects/${x.slug}`} className="a-room block rounded-md">
                    <Door
                      open={seatAngle(left, x.seats)}
                      className="mx-auto h-64 w-[min(100%,15rem)] sm:mx-0"
                      light={
                        <p className="text-sm font-medium leading-snug">
                          {p('seatsLeft', { count: left, n: f.num(left) })}
                        </p>
                      }
                    />
                    <p className="mt-5 text-sm text-ink-soft">{f.pick(x.company)}</p>
                    <h3 className="font-display mt-1 text-2xl font-bold leading-snug">{f.pick(x.title)}</h3>
                    <p className="mt-2 text-sm text-ink-soft">
                      <span>{f.pick(fields[x.field])}</span>
                      <span className="mx-2 inline-block h-3 w-px bg-line align-middle" aria-hidden="true" />
                      <span>{x.joinMode === 'open' ? p('modeOpen') : p('modeApply')}</span>
                    </p>
                    <p className="mt-1 text-sm font-medium">{left > 0 ? p('due', { date: f.day(x.dueAt) }) : p('fullCta')}</p>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Workshops: a corridor of dated doors. */}
        <section id="training" className="mx-auto mt-28 max-w-7xl scroll-mt-8 px-4 sm:px-8">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">{t('workshops')}</h2>
          <div className="first-line first-line-static mt-4 w-48" aria-hidden="true" />
          <ul className="mt-8 divide-y divide-line border-y border-line" role="list">
            {sampleWorkshops.map((ws) => {
              const left = ws.capacity - ws.booked
              return (
                <li key={ws.slug} className="grid grid-cols-[4.5rem_1fr] items-center gap-x-5 gap-y-1 py-6 sm:grid-cols-[6rem_1fr_auto]">
                  <div className="row-span-2 sm:row-span-1">
                    <div className="a-arch flex h-24 w-16 flex-col items-center justify-end bg-paper-deep pb-2 sm:w-20">
                      <span className="font-display text-3xl font-bold leading-none">{f.dayNum(ws.startsAt)}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold">{f.pick(ws.title)}</h3>
                    <p className="mt-1 text-sm text-ink-soft">
                      {f.dayWeekday(ws.startsAt)}
                      <span className="mx-2 inline-block h-3 w-px bg-line align-middle" aria-hidden="true" />
                      {f.time(ws.startsAt)}
                      <span className="mx-2 inline-block h-3 w-px bg-line align-middle" aria-hidden="true" />
                      {ws.online ? w('online') : w('inPerson')}
                      <span className="mx-2 inline-block h-3 w-px bg-line align-middle" aria-hidden="true" />
                      {w('minutes', { count: ws.minutes, n: f.num(ws.minutes) })}
                    </p>
                  </div>
                  <div className="col-start-2 flex items-center gap-4 sm:col-start-3 sm:flex-col sm:items-end sm:gap-1">
                    <span className="text-lg font-bold text-maroon">{f.money(ws.priceDirhams)}</span>
                    <span className="text-sm text-ink-soft">{w('seatsLeft', { count: left, n: f.num(left) })}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        {/* For organisations: one large doorway with the invitation written inside it. */}
        <section id="partners" className="mx-auto mt-28 max-w-7xl scroll-mt-8 px-4 sm:px-8">
          <div className="a-arch-wide bg-night px-6 pb-12 pt-[clamp(110px,16vw,190px)] text-on-night sm:px-16">
            <h2 className="font-display max-w-2xl text-4xl font-bold sm:text-5xl">{t('partnersTitle')}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-on-night-soft">{t('partnersBody')}</p>
            <Link href="/design/a#partners" className="a-btn mt-8 !bg-sand !text-ink">{t('partnersCta')}</Link>
          </div>
        </section>

        <footer className="mx-auto mt-16 max-w-7xl space-y-2 border-t border-line px-4 py-8 sm:px-8">
          <p className="text-sm">{t('noJobPromise')}</p>
          <SampleNote />
        </footer>
      </main>
    </>
  )
}
