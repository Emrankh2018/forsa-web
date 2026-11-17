import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { courseBySlug } from '@forsa/shared/seed'
import { formatters } from '@/lib/format'
import { CourseBuilder } from '@/components/app/trainer-widgets'

export default async function TrainerCourses({ params }: PageProps<'/[locale]/trainer/courses'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('trainerArea')
  const f = formatters(locale)
  const course = courseBySlug('content-basics')!
  return (
    <>
      <p className="text-ink-soft">{t('courseBuilder')}</p>
      <h1 className="font-display mt-1 text-4xl font-bold">{f.pick(course.title)}</h1>
      <div className="mt-8 max-w-3xl">
        <CourseBuilder
          moduleLabels={course.modules.map((_, i) => t('module', { n: f.num(i + 1) }))}
          modules={course.modules.map((m) => ({ title: f.pick(m.title), lessons: m.lessons.map((l) => ({ title: f.pick(l.title), preview: l.preview })) }))}
        />
      </div>
    </>
  )
}
