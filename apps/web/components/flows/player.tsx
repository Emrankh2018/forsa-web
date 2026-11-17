'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { SuccessState } from '@/components/ui/states'

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
  const app = useTranslations('app')
  const key = `forsa.course.${courseSlug}`
  const [done, setDone] = useState<number[]>(() => Array.from({ length: initialDone }, (_, i) => i + 1))

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(key)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from session storage after hydration
      if (saved) setDone(JSON.parse(saved) as number[])
    } catch {
      // storage blocked: start from the sample progress
    }
  }, [key])

  const mark = () => {
    const next = [...new Set([...done, lesson])].sort((a, b) => a - b)
    setDone(next)
    try {
      sessionStorage.setItem(key, JSON.stringify(next))
    } catch {
      // ignore
    }
  }
  const isDone = done.includes(lesson)
  const all = done.length >= total

  return (
    <div>
      <p className="text-sm font-medium" aria-live="polite">{progressTexts[Math.min(done.length, total)]}</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-deep" aria-hidden="true">
        <div className="h-full bg-maroon transition-[width] duration-500" style={{ width: `${(100 * done.length) / total}%` }} />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {isDone ? (
          <span className="inline-flex min-h-12 items-center gap-2 font-medium text-maroon" role="status">{t('done')}</span>
        ) : (
          <button type="button" className="btn-arch" onClick={mark}>{t('markDone')}</button>
        )}
        {nextHref ? <Link href={nextHref} className="btn-quiet underline underline-offset-4">{t('next')}</Link> : null}
        {prevHref ? <Link href={prevHref} className="btn-quiet underline underline-offset-4">{t('previous')}</Link> : null}
      </div>
      {all ? (
        <div className="mt-8">
          <SuccessState title={t('completeTitle')} body={t('completeBody')} />
        </div>
      ) : null}
      {isDone ? <p className="mt-3 text-sm text-maroon">{app('savedLocally')}</p> : null}
    </div>
  )
}
