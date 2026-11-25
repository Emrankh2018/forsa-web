'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { SuccessState } from '@/components/ui/states'
import { useCourseProgress } from '@/lib/use-course-progress'

function CourseProgressBar({ text, done, total }: { text: string; done: number; total: number }) {
  return (
    <>
      <p className="text-sm font-medium" aria-live="polite">{text}</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-deep" aria-hidden="true">
        <div className="h-full bg-maroon transition-[width] duration-500" style={{ width: `${total ? (100 * done) / total : 0}%` }} />
      </div>
    </>
  )
}

export function CourseProgressOverview({ courseSlug, total, initialDone, progressTexts, resumeLabel, completeLabel }: {
  courseSlug: string
  total: number
  initialDone: number
  progressTexts: string[]
  resumeLabel: string
  completeLabel: string
}) {
  const { done } = useCourseProgress(courseSlug, total, initialDone)
  const next = Array.from({ length: total }, (_, i) => i + 1).find((lesson) => !done.has(lesson))
  return (
    <div className="mt-2">
      <CourseProgressBar text={progressTexts[done.size]!} done={done.size} total={total} />
      {next ? (
        <Link href={`/me/learning/courses/${courseSlug}/${next}`} className="btn-quiet -ms-3 mt-3 underline underline-offset-4">{resumeLabel}</Link>
      ) : (
        <p className="mt-3 font-medium text-maroon">{completeLabel}</p>
      )}
    </div>
  )
}

/**
 * Lesson actions and course progress. In the prototype, finished lessons are remembered for this
 * browser session only (the real product saves progress so it survives signing out).
 */
export function LessonProgress({ courseSlug, lesson, total, initialDone, progressTexts, prevHref, nextHref }: {
  courseSlug: string
  lesson: number
  total: number
  initialDone: number
  progressTexts: string[]
  prevHref: string | null
  nextHref: string | null
}) {
  const t = useTranslations('player')
  const { done, mark } = useCourseProgress(courseSlug, total, initialDone)
  const isDone = done.has(lesson)
  const all = done.size === total

  return (
    <div>
      <CourseProgressBar text={progressTexts[done.size]!} done={done.size} total={total} />
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {isDone ? (
          <span className="inline-flex min-h-12 items-center gap-2 font-medium text-maroon" role="status">{t('done')}</span>
        ) : (
          <button type="button" className="btn-arch" onClick={() => mark(lesson)}>{t('markDone')}</button>
        )}
        {nextHref ? <Link href={nextHref} className="btn-quiet underline underline-offset-4">{t('next')}</Link> : null}
        {prevHref ? <Link href={prevHref} className="btn-quiet underline underline-offset-4">{t('previous')}</Link> : null}
      </div>
      {all ? (
        <div className="mt-8">
          <SuccessState title={t('completeTitle')} body={t('completeBody')} />
        </div>
      ) : null}
      {isDone ? <p className="mt-3 text-sm text-maroon">{t('progressNote')}</p> : null}
    </div>
  )
}
