import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { PhoneActionBar } from '@/components/site/phone-action-bar'
import { Door, seatAngle } from '@/components/site/door'
import { RoomHeader } from '@/components/ui/room-header'
import { SectionHeading } from '@/components/ui/section-heading'
import { SignInPrompt } from '@/components/ui/sign-in-prompt'
import { listWorkshops, workshopLookup } from '@/lib/data'
import { publicMeta } from '@/lib/seo'

export async function generateStaticParams() {
  const sampleWorkshops = await listWorkshops()
  return sampleWorkshops.map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/workshops/[slug]'>): Promise<Metadata> {
  const workshopBySlug = await workshopLookup()
  const { locale, slug } = await params
  const ws = workshopBySlug(slug)
  return ws ? publicMeta(locale as Locale, `/workshops/${slug}`, ws.title[locale as Locale], ws.summary[locale as Locale]) : {}
}

export default async function WorkshopPage({ params }: PageProps<'/[locale]/workshops/[slug]'>) {
  const workshopBySlug = await workshopLookup()
  const { locale: raw, slug } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const ws = workshopBySlug(slug)
  if (!ws) notFound()
  const t = await getTranslations('workshopsPage')
  const w = await getTranslations('workshop')
  const s = await getTranslations('signInPrompt')
  const u = await getTranslations('ui')
  const f = formatters(locale)
  const left = ws.capacity - ws.booked
  const full = left === 0

  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
          <Link href="/workshops" className="btn-quiet -ms-3 text-ink-soft underline underline-offset-4">{t('back')}</Link>
        </div>
        <RoomHeader title={f.pick(ws.title)} lead={f.pick(ws.summary)} kicker={f.dayWeekday(ws.startsAt)} />

        <div className="mx-auto mt-14 grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_20rem]">
          <article className="max-w-3xl">
            <SectionHeading>{t('outcomes')}</SectionHeading>
            <ul className="mt-5 space-y-3" role="list">
              {ws.outcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-3 text-lg">
                  <span className="arch mt-1.5 inline-block h-4 w-3 flex-none bg-maroon" aria-hidden="true" />
                  {f.pick(o)}
                </li>
              ))}
            </ul>
            <p className="mt-10 text-ink-soft">{t('certificate')}</p>
          </article>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="arch bg-paper-deep px-6 pb-8 pt-28">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-ink-soft">{t('when')}</dt>
                  <dd className="font-medium">{f.dayWeekday(ws.startsAt)}</dd>
                  <dd>{f.time(ws.startsAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-soft">{t('where')}</dt>
                  <dd>{ws.online ? w('online') : w('inPerson')}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-soft">{t('length')}</dt>
                  <dd>{w('minutes', { count: ws.minutes, n: f.num(ws.minutes) })}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-soft">{t('trainer')}</dt>
                  <dd>{t('trainerTbd')}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-soft">{t('seats')}</dt>
                  <dd className="mt-1 flex items-center gap-3">
                    <Door open={seatAngle(left, ws.capacity)} className="h-12 w-9 flex-none" />
                    <span className="font-medium">{w('seatsLeft', { count: left, n: f.num(left) })}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-soft">{t('price')}</dt>
                  <dd className="text-2xl font-bold text-maroon">{f.money(ws.priceDirhams)}</dd>
                </div>
              </dl>
              <div className="mt-8 hidden lg:block">
                {full ? (
                  <span className="btn-arch w-full" aria-disabled="true">{t('full')}</span>
                ) : (
                  <SignInPrompt label={t('book')} returnTo={`/workshops/${ws.slug}/book`} title={s('title')} body={s('workshopBody')} continueLabel={s('continue')} notNowLabel={s('notNow')} />
                )}
              </div>
              <p className="mt-3 text-sm text-ink-soft">{t('bookNote')}</p>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter sample />
      <div className="h-20 lg:hidden" aria-hidden="true" />
      <PhoneActionBar label={u('pageAction')} fact={<><span className="block font-bold text-maroon">{f.money(ws.priceDirhams)}</span><span className="text-ink-soft">{w('seatsLeft', { count: left, n: f.num(left) })}</span></>}>
        {full ? (
          <span className="btn-arch btn-arch--compact" aria-disabled="true">{t('full')}</span>
        ) : (
          <SignInPrompt variant="compact" label={t('book')} returnTo={`/workshops/${ws.slug}/book`} title={s('title')} body={s('workshopBody')} continueLabel={s('continue')} notNowLabel={s('notNow')} />
        )}
      </PhoneActionBar>
    </>
  )
}
