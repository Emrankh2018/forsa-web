import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { projectBySlug, sampleParticipant, sampleWorkshops } from '@forsa/shared/seed'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/design'
import { HeaderB } from '@/components/design-b/header-b'

export default async function ParticipantHomeB({ params }: PageProps<'/[locale]/design/b/me'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('design.me')
  const d = await getTranslations('design')
  const f = formatters(locale)
  const me = sampleParticipant
  const active = projectBySlug(me.activeProjectSlug)!
  const total = active.steps.length
  const workshop = sampleWorkshops.find((w) => w.slug === me.bookedWorkshopSlug)!
  const saved = me.savedProjectSlugs.map((s) => projectBySlug(s)!)

  return (
    <>
      <HeaderB signedIn />
      <main id="content" tabIndex={-1} className="outline-none">
        <div className="b-row pt-10">
          <div className="hidden md:block" />
          <h1 className="font-display text-4xl font-bold sm:text-5xl">{t('greeting', { name: f.pick(me.firstName) })}</h1>
        </div>

        {/* The active project, line by line: done in ink, the next line marked, the rest faint. */}
        <section className="b-row mt-12" aria-labelledby="b-active">
          <div className="b-margin">
            <p className="font-medium text-ink">{f.pick(active.company)}</p>
            <p>{t('progress', { done: f.num(me.stepsDone), total: f.num(total) })}</p>
          </div>
          <div className="b-rule pt-5">
            <h2 id="b-active" className="font-display text-2xl font-bold sm:text-3xl">{f.pick(active.title)}</h2>
            <ol className="mt-4" role="list">
              {active.steps.map((s, i) => {
                const done = i < me.stepsDone
                const current = i === me.stepsDone
                return (
                  <li
                    key={i}
                    aria-current={current ? 'step' : undefined}
                    className={`flex items-start gap-4 border-b border-line py-3 ${current ? 'b-mark' : ''} ${!done && !current ? 'b-future' : ''}`}
                  >
                    {done ? <span className="b-tick" aria-hidden="true" /> : <span className="w-4 flex-none" aria-hidden="true" />}
                    <span className={current ? 'font-display text-2xl font-bold sm:text-3xl' : 'text-lg'}>{f.pick(s)}</span>
                    {current ? (
                      <span className="ms-auto flex flex-col items-end gap-2 text-end">
                        <span className="text-sm font-medium text-maroon">{t('nextStepDue', { date: f.day(me.nextStepDue) })}</span>
                        <Link href={`/design/b/projects/${active.slug}`} className="b-btn">{t('openWorkspace')}</Link>
                      </span>
                    ) : null}
                  </li>
                )
              })}
            </ol>
            <p className="sr-only">{t('nextStep')}</p>
          </div>
        </section>

        <section className="b-row mt-14" aria-labelledby="b-learning">
          <div className="b-margin">
            <p id="b-learning" className="font-medium text-ink">{t('learning')}</p>
          </div>
          <div className="b-rule pt-5">
            <p className="font-display text-2xl font-bold">{f.pick(workshop.title)}</p>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-6 text-sm">
              <span>{f.dayWeekday(workshop.startsAt)}</span>
              <span className="font-medium text-maroon">{t('pending')}</span>
            </p>
          </div>
        </section>

        <section className="b-row mt-14" aria-labelledby="b-projects">
          <div className="b-margin">
            <p id="b-projects" className="font-medium text-ink">{t('myProjects')}</p>
          </div>
          <ul className="b-rule pt-2" role="list">
            {saved.map((s) => (
              <li key={s.slug} className="flex flex-wrap items-baseline gap-x-6 border-b border-line py-3">
                <Link href={`/design/b/projects/${s.slug}`} className="b-link text-lg">{f.pick(s.title)}</Link>
                <span className="ms-auto text-sm text-ink-soft">{t('saved')}</span>
              </li>
            ))}
            {me.finished.map((x, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-6 border-b border-line py-3">
                <span className="text-lg">{f.pick(x.title)}</span>
                <span className="text-sm text-ink-soft">{f.pick(x.company)}</span>
                <span className="ms-auto text-sm font-medium">{t('accepted')}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="b-row mt-14" aria-labelledby="b-notices">
          <div className="b-margin">
            <p id="b-notices" className="font-medium text-ink">{t('notices')}</p>
          </div>
          <ul className="b-rule" role="list">
            <li className="border-b border-line py-3">{t('notice1')}</li>
            <li className="border-b border-line py-3">{t('notice2')}</li>
          </ul>
        </section>

        <section className="b-row mt-14">
          <div className="b-margin">
            <p className="font-medium text-ink">{t('record')}</p>
          </div>
          <div>
            <p className="text-ink-soft">{t('recordLine')}</p>
            <div className="b-empty mt-4">{t('emptyLine')}</div>
          </div>
        </section>

        <footer className="b-row mt-16 pb-10">
          <div className="hidden md:block" />
          <p className="text-sm text-ink-soft">{d('sample')}</p>
        </footer>
      </main>
    </>
  )
}
