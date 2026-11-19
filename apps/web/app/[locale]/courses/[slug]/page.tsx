import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { PhoneActionBar } from '@/components/site/phone-action-bar'
import { RoomHeader } from '@/components/ui/room-header'
import { SectionHeading } from '@/components/ui/section-heading'
import { SignInPrompt } from '@/components/ui/sign-in-prompt'
import { Tag } from '@/components/ui/states'
import { courseLookup, listCourses, fields } from '@/lib/data'
import { publicMeta } from '@/lib/seo'

export async function generateStaticParams() {
  const sampleCourses = await listCourses()
  return sampleCourses.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/courses/[slug]'>): Promise<Metadata> {
  const courseBySlug = await courseLookup()
  const { locale, slug } = await params
  const c = courseBySlug(slug)
  return c ? publicMeta(locale as Locale, `/courses/${slug}`, c.title[locale as Locale], c.summary[locale as Locale]) : {}
}

export default async function CoursePage({ params }: PageProps<'/[locale]/courses/[slug]'>) {
  const courseBySlug = await courseLookup()
  const { locale: raw, slug } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const c = courseBySlug(slug)
  if (!c) notFound()
  const t = await getTranslations('coursesPage')
  const s = await getTranslations('signInPrompt')
  const u = await getTranslations('ui')
  const f = formatters(locale)
  const lessons = c.modules.flatMap((m) => m.lessons)
  const minutes = lessons.reduce((n, l) => n + l.minutes, 0)

  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
          <Link href="/courses" className="btn-quiet -ms-3 text-ink-soft underline underline-offset-4">{t('back')}</Link>
        </div>
        <RoomHeader
          title={f.pick(c.title)}
          lead={f.pick(c.summary)}
          kicker={c.field === 'career' ? t('career') : f.pick(fields[c.field])}
        />
        <div className="mx-auto mt-14 grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_20rem]">
          <section className="max-w-3xl" aria-labelledby="contents">
            <SectionHeading id="contents">{t('contents')}</SectionHeading>
            <ol className="mt-6 space-y-8" role="list">
              {c.modules.map((m, i) => (
                <li key={i}>
                  <h3 className="font-display text-xl font-bold">
                    <span className="me-3 text-ink-soft">{f.num(i + 1)}</span>
                    {f.pick(m.title)}
                  </h3>
                  <ul className="mt-3 divide-y divide-line border-y border-line" role="list">
                    {m.lessons.map((l, j) => (
                      <li key={j} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                        <span className="flex-1">{f.pick(l.title)}</span>
                        {l.preview ? <Tag tone="accent">{t('preview')}</Tag> : null}
                        <span className="text-sm text-ink-soft">{t('totalMinutes', { count: l.minutes, n: f.num(l.minutes) })}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="arch bg-paper-deep px-6 pb-8 pt-28">
              <p className="font-medium">{t('modules', { count: c.modules.length, n: f.num(c.modules.length) })}</p>
              <p>{t('lessons', { count: lessons.length, n: f.num(lessons.length) })}</p>
              <p className="text-ink-soft">{t('totalMinutes', { count: minutes, n: f.num(minutes) })}</p>
              <p className="mt-4 text-sm text-ink-soft">{t('priceLater')}</p>
              <div className="mt-6 hidden lg:block">
                <SignInPrompt label={t('enrol')} returnTo={`/courses/${c.slug}`} title={s('title')} body={s('body')} continueLabel={s('continue')} notNowLabel={s('notNow')} />
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter sample />
      <div className="h-20 lg:hidden" aria-hidden="true" />
      <PhoneActionBar label={u('pageAction')} fact={<><span className="block font-medium">{t('lessons', { count: lessons.length, n: f.num(lessons.length) })}</span><span className="text-ink-soft">{t('priceLater')}</span></>}>
        <SignInPrompt variant="compact" label={t('enrol')} returnTo={`/courses/${c.slug}`} title={s('title')} body={s('body')} continueLabel={s('continue')} notNowLabel={s('notNow')} />
      </PhoneActionBar>
    </>
  )
}
