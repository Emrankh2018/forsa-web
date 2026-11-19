import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { safeReturnPath, type Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { Door } from '@/components/site/door'
import { PrototypeBand } from '@/components/flows/prototype-band'
import { SignInFlow } from '@/components/flows/sign-in-flow'
import { localeOf, type MetaProps } from '@/lib/locale-param'

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: 'account' })
  return { title: t('signInTitle'), robots: { index: false, follow: false } }
}

/** Sign in (prototype until the back end exists). Keeps the ?next= return path. */
export default async function SignInPage({ params, searchParams }: PageProps<'/[locale]/sign-in'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const { next: raw } = await searchParams
  const next = safeReturnPath(raw)
  const t = await getTranslations('account')
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <PrototypeBand />
        <section className="mx-auto grid max-w-5xl items-start gap-12 px-4 pt-12 sm:px-8 md:grid-cols-[14rem_1fr]">
          <Door open={6} keyhole className="door--yours hidden h-72 md:block" />
          <div>
            <h1 className="sr-only">{t('signInTitle')}</h1>
            <SignInFlow next={next} />
            <p className="mt-10 text-ink-soft">
              {t('newHere')}{' '}
              <Link href={next ? { pathname: '/join', query: { next } } : '/join'} className="font-medium text-ink underline underline-offset-4">{t('chooseCta')}</Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
