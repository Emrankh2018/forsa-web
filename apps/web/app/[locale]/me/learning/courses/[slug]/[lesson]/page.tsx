import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { DoorSymbol } from '@/components/door-symbol'
import { Tag } from '@/components/ui/states'
import { LessonProgress } from '@/components/flows/player'
import { courseLookup, getMyLearning, listCourses } from '@/lib/data'

export async function generateStaticParams() {
  const sampleCourses = await listCourses()
  return sampleCourses.flatMap((c) => c.modules.flatMap((m) => m.lessons).map((_, i) => ({ slug: c.slug, lesson: String(i + 1) })))
}

/** The course player: the lesson (video by reference), its notes, progress and the course outline. */
export default async function Lesson({ params }: PageProps<'/[locale]/me/learning/courses/[slug]/[lesson]'>) {
  const courseBySlug = await courseLookup()
  const sampleLearning = await getMyLearning()
  const { locale: raw, slug, lesson: lessonParam } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const course = courseBySlug(slug)
  const n = Number(lessonParam)
  const lessons = course?.modules.flatMap((m) => m.lessons) ?? []
  if (!course || !Number.isInteger(n) || n < 1 || n > lessons.length) notFound()
  const lesson = lessons[n - 1]!
  const t = await getTranslations('player')
  const cp = await getTranslations('coursesPage')
  const f = formatters(locale)
  const initialDone = slug === sampleLearning.course.slug ? sampleLearning.course.lessonsDone : 0
  const offsets = course.modules.map((_, mi) => course.modules.slice(0, mi).reduce((sum, m) => sum + m.lessons.length, 0))

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
      <article>
        <p className="text-sm text-ink-soft">{f.pick(course.title)}</p>
        <h1 className="font-display mt-1 text-3xl font-bold sm:text-4xl">{f.pick(lesson.title)}</h1>
        <p className="mt-1 text-sm text-ink-soft">{t('lessonOf', { n: f.num(n), total: f.num(lessons.length) })}</p>
        <div className="mt-6 flex aspect-video items-center justify-center rounded-lg bg-night text-on-night-soft">
          <div className="text-center">
            <DoorSymbol tone="night" className="mx-auto h-20 w-auto" />
            <p className="mt-4 px-6 text-sm">{t('video')}</p>
          </div>
        </div>
        <section className="mt-8 max-w-3xl" aria-labelledby="notes">
          <h2 id="notes" className="font-display text-2xl font-bold">{t('notes')}</h2>
          <p className="mt-3 text-lg leading-relaxed">{t('notesBody')}</p>
        </section>
        <div className="mt-8">
          <LessonProgress
            courseSlug={slug}
            lesson={n}
            total={lessons.length}
            initialDone={initialDone}
            progressTexts={Array.from({ length: lessons.length + 1 }, (_, d) => t('progress', { done: f.num(d), total: f.num(lessons.length) }))}
            prevHref={n > 1 ? `/me/learning/courses/${slug}/${n - 1}` : null}
            nextHref={n < lessons.length ? `/me/learning/courses/${slug}/${n + 1}` : null}
          />
        </div>
      </article>
      <nav aria-labelledby="contents" className="lg:sticky lg:top-6 lg:self-start">
        <h2 id="contents" className="font-medium">{t('contents')}</h2>
        <ol className="mt-3 space-y-5" role="list">
          {course.modules.map((m, mi) => (
            <li key={mi}>
              <p className="text-sm text-ink-soft">{f.pick(m.title)}</p>
              <ol className="mt-1 border-s border-line" role="list">
                {m.lessons.map((l, li) => {
                  const i = offsets[mi]! + li + 1
                  const here = i === n
                  return (
                    <li key={i}>
                      <Link href={`/me/learning/courses/${slug}/${i}`} aria-current={here ? 'page' : undefined} className={`-ms-px flex min-h-11 items-center gap-2 border-s-2 py-1.5 ps-3 ${here ? 'border-maroon font-bold' : 'border-transparent hover:border-line'}`}>
                        <span className="flex-1">{f.pick(l.title)}</span>
                        {l.preview ? <Tag tone="accent">{cp('preview')}</Tag> : null}
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
