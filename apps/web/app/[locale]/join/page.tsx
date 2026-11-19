import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { safeReturnPath, type Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { Door } from '@/components/site/door'
import { localeOf, type MetaProps } from '@/lib/locale-param'

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: 'account' })
  return { title: t('chooseTitle'), robots: { index: false, follow: false } }
}

const doors = ['participant', 'organisation', 'trainer'] as const
type DoorKey = (typeof doors)[number]

/**
 * Come in: choosing a role is choosing a door (plan section 8). Accounts open in phase 3; until
 * then the chosen door opens onto an honest note, and the return path (?next=) is kept.
 */
export default async function JoinPage({ params, searchParams }: PageProps<'/[locale]/join'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const sp = await searchParams
  const next = safeReturnPath(sp.next)
  const chosen = doors.find((d) => d === sp.as) as DoorKey | undefined
  const t = await getTranslations('account')
  const app = await getTranslations('app')
  const inside = { participant: '/me', organisation: '/org', trainer: '/trainer' } as const

  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-8 sm:pt-16">
          <h1 className="font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold">{t('chooseTitle')}</h1>
          <div className="first-line mt-4 max-w-sm" aria-hidden="true" />
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{t('chooseLead')}</p>

          <ul className="mt-12 grid grid-cols-3 gap-3 sm:gap-8" role="list">
            {doors.map((d) => {
              const on = chosen === d
              return (
                <li key={d}>
                  <Link
                    href={{ pathname: '/join', query: { as: d, ...(next ? { next } : {}) } }}
                    aria-current={on ? 'true' : undefined}
                    scroll={false}
                    className="room block rounded-md"
                  >
                    <Door open={on ? 82 : chosen ? 8 : 30} openHover={on ? 82 : 70} className="door--framed h-40 sm:h-72" />
                    <div className="floor mx-[8%] -mt-[10px]" aria-hidden="true" />
                    <span className="font-display mt-4 block text-xl font-bold sm:text-3xl">{t(d)}</span>
                    <span className="mt-1 hidden text-ink-soft sm:block">{t(`${d}Line`)}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="mt-10 border-y border-line py-6" role="status" aria-live="polite">
            {chosen ? (
              <>
                <p className="font-medium text-maroon">{t('chosen', { door: t(chosen) })}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href={`/join/${chosen}`} className="btn-arch">{t('continue')}</Link>
                </div>
                <Link href={inside[chosen]} className="btn-quiet -ms-3 mt-4 underline underline-offset-4">{app('lookInside')}</Link>
              </>
            ) : (
              <p className="text-ink-soft">{t('chooseCta')}</p>
            )}
          </div>

          <p className="mt-8 text-ink-soft">
            {t('haveAccount')}{' '}
            <Link href={next ? { pathname: '/sign-in', query: { next } } : '/sign-in'} className="font-medium text-ink underline underline-offset-4">
              {t('signInCta')}
            </Link>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
