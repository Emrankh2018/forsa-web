import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { AccountsSoon, safeReturnPath } from '@/components/site/accounts-soon'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('account')
  return { title: t('signInTitle'), robots: { index: false, follow: false } }
}

/** Placeholder until phase 3 builds sign-in. Keeps the ?next= return path. */
export default async function SignInPage({ params, searchParams }: PageProps<'/[locale]/sign-in'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const { next } = await searchParams
  const t = await getTranslations('account')
  return <AccountsSoon title={t('signInTitle')} next={safeReturnPath(next)} />
}
