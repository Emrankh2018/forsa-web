import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { formatters } from '@/lib/format'
import { SectionHeading } from '@/components/ui/section-heading'
import { Tag } from '@/components/ui/states'
import { CourseProgressOverview } from '@/components/flows/player'
import { courseLookup, getMyLearning, workshopLookup } from '@/lib/data'

/** My learning: booked workshops (link hidden until confirmed), 1-to-1 sessions, courses in progress. */
export default async function MyLearning({ params }: PageProps<'/[locale]/me/learning'>) {
  const courseBySlug = await courseLookup()
  const workshopBySlug = await workshopLookup()
  const sampleLearning = await getMyLearning()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('learningPage')
  const player = await getTranslations('player')
  const me = await getTranslations('me')
  const st = await getTranslations('app.state')
  const f = formatters(locale)
  const ws = workshopBySlug(sampleLearning.workshop.slug)!
  const course = courseBySlug(sampleLearning.course.slug)!
  const lessons = course.modules.flatMap((m) => m.lessons)
  const done = sampleLearning.course.lessonsDone
  const s = sampleLearning.session

  return (
    <>
      <h1 className="font-display text-4xl font-bold">{me('learning')}</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-3">
        <section aria-labelledby="l-workshops">
          <SectionHeading id="l-workshops">{t('workshops')}</SectionHeading>
          <div className="panel mt-6 p-5">
            <p className="font-display text-xl font-bold">{f.pick(ws.title)}</p>
            <p className="mt-1 text-sm text-ink-soft">{f.dayWeekday(ws.startsAt)}</p>
            <div className="mt-3"><Tag tone="accent">{st(sampleLearning.workshop.state)}</Tag></div>
            <p className="mt-3 text-sm text-ink-soft">{t('linkHidden')}</p>
          </div>
        </section>
        <section aria-labelledby="l-sessions">
          <SectionHeading id="l-sessions">{t('sessions')}</SectionHeading>
          <div className="panel mt-6 p-5">
            <p className="font-display text-xl font-bold">{f.pick(s.title)}</p>
            <p className="mt-1 text-sm text-ink-soft">{f.dayWeekday(s.at)}</p>
            <p className="text-sm text-ink-soft">{f.time(s.at)}</p>
            <div className="mt-3"><Tag>{st(s.state)}</Tag></div>
            <p className="mt-3 text-sm">{t('linkReady')}</p>
            <span className="btn-arch btn-arch--compact mt-3" aria-disabled="true">{t('join')}</span>
          </div>
        </section>
        <section aria-labelledby="l-courses">
          <SectionHeading id="l-courses">{t('courses')}</SectionHeading>
          <div className="panel mt-6 p-5">
            <p className="font-display text-xl font-bold">{f.pick(course.title)}</p>
            <CourseProgressOverview
              courseSlug={course.slug}
              total={lessons.length}
              initialDone={done}
              progressTexts={Array.from({ length: lessons.length + 1 }, (_, count) => t('lessons', { done: f.num(count), total: f.num(lessons.length) }))}
              resumeLabel={t('continue')}
              completeLabel={player('completeTitle')}
            />
          </div>
        </section>
      </div>
    </>
  )
}
