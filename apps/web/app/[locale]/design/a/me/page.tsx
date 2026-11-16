import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { projectBySlug, sampleParticipant, sampleWorkshops } from '@forsa/shared/seed'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/design'
import { Door } from '@/components/design-a/door'
import { HeaderA, SampleNote } from '@/components/design-a/header-a'

export default async function ParticipantHomeA({ params }: PageProps<'/[locale]/design/a/me'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('design.me')
  const f = formatters(locale)
  const me = sampleParticipant
  const active = projectBySlug(me.activeProjectSlug)!
  const total = active.steps.length
  const next = active.steps[me.stepsDone]!
  const progressAngle = Math.round(8 + 72 * (me.stepsDone / total))
  const workshop = sampleWorkshops.find((w) => w.slug === me.bookedWorkshopSlug)!
  const saved = me.savedProjectSlugs.map((s) => projectBySlug(s)!)

  return (
    <>
      <HeaderA signedIn />
      <main id="content" tabIndex={-1} className="outline-none">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-8">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">{t('greeting', { name: f.pick(me.firstName) })}</h1>
        </div>

        {/* Your doorway: opened as far as your project has come; the next step stands in its light. */}
        <section className="mx-auto mt-8 grid max-w-7xl items-end gap-8 px-4 sm:px-8 md:grid-cols-[minmax(0,22rem)_1fr]">
          <div>
            <Door
              open={progressAngle}
              swing
              className="h-[clamp(280px,36vw,420px)]"
              light={<p className="text-sm font-medium">{t('progress', { done: f.num(me.stepsDone), total: f.num(total) })}</p>}
            />
            <div className="a-floor mx-[6%]" aria-hidden="true" />
          </div>
          <div className="pb-2">
            <p className="text-ink-soft">{t('nextStep')}</p>
            <h2 className="font-display mt-2 text-4xl font-bold sm:text-5xl">{f.pick(next)}</h2>
            <p className="mt-3 text-lg">{f.pick(active.title)}</p>
            <p className="mt-1 font-medium text-maroon">{t('nextStepDue', { date: f.day(me.nextStepDue) })}</p>
            <Link href={`/design/a/projects/${active.slug}`} className="a-btn mt-6">{t('openWorkspace')}</Link>
          </div>
        </section>

        <div className="mx-auto mt-20 grid max-w-7xl gap-14 px-4 sm:px-8 lg:grid-cols-[1.4fr_1fr]">
          <section>
            <h2 className="font-display text-3xl font-bold">{t('myProjects')}</h2>
            <div className="first-line first-line-static mt-3 w-32" aria-hidden="true" />
            <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4" role="list">
              <li>
                <Link href={`/design/a/projects/${active.slug}`} className="a-room block rounded-md">
                  <Door open={progressAngle} className="h-36" />
                  <p className="mt-3 text-sm font-medium text-maroon">{t('active')}</p>
                  <p className="mt-1 text-sm leading-snug">{f.pick(active.title)}</p>
                </Link>
              </li>
              {saved.map((s) => (
                <li key={s.slug}>
                  <Link href={`/design/a/projects/${s.slug}`} className="a-room block rounded-md">
                    <Door open={0} openHover={30} className="h-36" />
                    <p className="mt-3 text-sm font-medium text-ink-soft">{t('saved')}</p>
                    <p className="mt-1 text-sm leading-snug">{f.pick(s.title)}</p>
                  </Link>
                </li>
              ))}
              {me.finished.map((done, i) => (
                <li key={i}>
                  <Door open={84} className="h-36" />
                  <p className="mt-3 text-sm font-medium">{t('accepted')}</p>
                  <p className="mt-1 text-sm leading-snug">{f.pick(done.title)}</p>
                  <p className="text-sm text-ink-soft">{f.pick(done.company)}</p>
                </li>
              ))}
            </ul>
          </section>

          <div className="space-y-12">
            <section>
              <h2 className="font-display text-3xl font-bold">{t('learning')}</h2>
              <div className="first-line first-line-static mt-3 w-32" aria-hidden="true" />
              <div className="mt-5 border-y border-line py-4">
                <p className="font-display text-xl font-bold">{f.pick(workshop.title)}</p>
                <p className="mt-1 text-sm text-ink-soft">{f.dayWeekday(workshop.startsAt)}</p>
                <p className="mt-2 inline-flex rounded-sm bg-maroon-tint px-2 py-0.5 text-sm font-medium text-maroon">{t('pending')}</p>
              </div>
            </section>
            <section>
              <h2 className="font-display text-3xl font-bold">{t('notices')}</h2>
              <div className="first-line first-line-static mt-3 w-32" aria-hidden="true" />
              <ul className="mt-5 divide-y divide-line border-y border-line" role="list">
                <li className="py-3">{t('notice1')}</li>
                <li className="py-3">{t('notice2')}</li>
              </ul>
            </section>
            <section>
              <h2 className="font-display text-2xl font-bold">{t('record')}</h2>
              <p className="mt-2 text-ink-soft">{t('recordLine')}</p>
            </section>
          </div>
        </div>

        <footer className="mx-auto mt-20 max-w-7xl border-t border-line px-4 py-8 sm:px-8">
          <SampleNote />
        </footer>
      </main>
    </>
  )
}
