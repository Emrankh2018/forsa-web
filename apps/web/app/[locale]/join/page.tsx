import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { AccountsSoon, safeReturnPath } from '@/components/site/accounts-soon'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('account')
  return { title: t('joinTitle'), robots: { index: false, follow: false } }
}

/** Placeholder until phase 3 builds the choice of door (participant, organisation, trainer). */
export default async function JoinPage({ params, searchParams }: PageProps<'/[locale]/join'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const { next } = await searchParams
  const t = await getTranslations('account')
  return <AccountsSoon title={t('joinTitle')} next={safeReturnPath(next)} />
}
