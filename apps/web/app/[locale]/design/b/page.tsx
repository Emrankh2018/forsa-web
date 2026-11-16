import { getTranslations, setRequestLocale } from 'next-intl/server'
import { direction, type Locale } from '@forsa/shared'
import { fields, sampleProjects, sampleWorkshops, seatsLeft } from '@forsa/shared/seed'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/design'
import { ArrivalGate } from '@/components/arrival/arrival-gate'
import { ArrivalLine } from '@/components/arrival/arrival-line'
import { HeaderB } from '@/components/design-b/header-b'

export default async function HomeB({ params }: PageProps<'/[locale]/design/b'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('design.home')
  const p = await getTranslations('design.project')
  const w = await getTranslations('design.workshop')
  const m = await getTranslations('design.me')
  const n = await getTranslations('design.nav')
  const d = await getTranslations('design')
  const a = await getTranslations('design.arrival')
  const f = formatters(locale)

  return (
    <>
      <ArrivalGate storageKey="forsa.arrival.b" />
      <ArrivalLine skipLabel={a('skip')} dir={direction(locale)} />
      <HeaderB />
      <main id="content" tabIndex={-1} className="outline-none">
        {/* The first line of the page: the promise, written on it. */}
        <section className="b-row pt-12 sm:pt-20">
          <div className="hidden md:block" />
          <div>
            <h1 className="font-display text-[clamp(2.6rem,6.4vw,6rem)] font-bold">{t('promise')}</h1>
            <div data-first-line className="first-line first-line-static mt-3" aria-hidden="true" />
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">{t('lead')}</p>
          </div>
        </section>

        {/* Projects, written like entries on a CV. */}
        <section id="projects" className="mt-20 scroll-mt-6 sm:mt-28" aria-labelledby="b-projects">
          <div className="b-row">
            <h2 id="b-projects" className="b-margin !text-base font-medium !text-ink">{t('openNow')}</h2>
            <div className="b-mark b-rule hidden md:block" />
          </div>
          <ol className="mt-2" role="list">
            {sampleProjects.map((x) => {
              const left = seatsLeft(x)
              return (
                <li key={x.slug} className="b-row py-7">
                  <div className="b-margin">
                    <p className="font-medium text-ink">{f.pick(x.company)}</p>
                    <p>{f.pick(fields[x.field])}</p>
                  </div>
                  <div className="b-rule pt-5">
                    <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.25rem)] font-bold">
                      <Link href={`/design/b/projects/${x.slug}`} className="b-link">{f.pick(x.title)}</Link>
                    </h3>
                    <p className="mt-2 max-w-3xl text-ink-soft">{f.pick(x.summary)}</p>
                    <p className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm">
                      <span>{x.joinMode === 'open' ? p('modeOpen') : p('modeApply')}</span>
                      <span className={left === 0 ? 'text-ink-soft' : ''}>{p('seatsLeft', { count: left, n: f.num(left) })}</span>
                      <span className="ms-auto font-medium">{x.applyBy && left > 0 ? p('applyBy', { date: f.day(x.applyBy) }) : p('due', { date: f.day(x.dueAt) })}</span>
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <section id="training" className="mt-16 scroll-mt-6 sm:mt-24" aria-labelledby="b-training">
          <div className="b-row">
            <h2 id="b-training" className="b-margin !text-base font-medium !text-ink">{t('workshops')}</h2>
            <div className="b-mark b-rule hidden md:block" />
          </div>
          <ol className="mt-2" role="list">
            {sampleWorkshops.map((ws) => {
              const left = ws.capacity - ws.booked
              return (
                <li key={ws.slug} className="b-row py-6">
                  <div className="b-margin flex items-baseline gap-2 md:block">
                    <p className="font-display text-4xl font-bold leading-none text-ink">{f.dayNum(ws.startsAt)}</p>
                    <p className="md:mt-2">{f.dayWeekday(ws.startsAt)}</p>
                  </div>
                  <div className="b-rule pt-4">
                    <h3 className="font-display text-2xl font-bold sm:text-3xl">{f.pick(ws.title)}</h3>
                    <p className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm">
                      <span>{f.time(ws.startsAt)}</span>
                      <span>{ws.online ? w('online') : w('inPerson')}</span>
                      <span>{w('minutes', { count: ws.minutes, n: f.num(ws.minutes) })}</span>
                      <span className="text-ink-soft">{w('seatsLeft', { count: left, n: f.num(left) })}</span>
                      <span className="ms-auto text-base font-bold text-maroon">{f.money(ws.priceDirhams)}</span>
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <section id="partners" className="mt-16 scroll-mt-6 sm:mt-24" aria-labelledby="b-partners">
          <div className="b-row">
            <p className="b-margin !text-base font-medium !text-ink">{n('partners')}</p>
            <div className="b-mark b-rule pt-6">
              <h2 id="b-partners" className="font-display text-3xl font-bold sm:text-4xl">{t('partnersTitle')}</h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed">{t('partnersBody')}</p>
              <Link href="/design/b#partners" className="b-link mt-4 inline-flex min-h-11 items-center font-medium text-maroon">{t('partnersCta')}</Link>
            </div>
          </div>
        </section>

        {/* The page ends on an empty line: the next one is yours. */}
        <section className="mt-20">
          <div className="b-row">
            <div className="hidden md:block" />
            <div className="b-empty justify-between gap-4">
              <span>{m('emptyLine')}</span>
              <Link href="/design/b/me" className="b-link font-medium text-ink">{n('join')}</Link>
            </div>
          </div>
        </section>

        <footer className="b-row mt-16 pb-10">
          <div className="hidden md:block" />
          <div className="space-y-1 text-sm text-ink-soft">
            <p>{t('noJobPromise')}</p>
            <p>{d('sample')}</p>
          </div>
        </footer>
      </main>
    </>
  )
}
