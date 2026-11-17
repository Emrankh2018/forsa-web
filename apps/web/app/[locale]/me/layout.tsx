import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { formatNumber, type Locale } from '@forsa/shared'
import { AreaShell } from '@/components/app/area-shell'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('app')
  return { title: t('participant'), robots: { index: false, follow: false } }
}

export default async function ParticipantLayout({ children, params }: LayoutProps<'/[locale]/me'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('me.nav')
  return (
    <AreaShell
      area="participant"
      tabs={[
        { href: '/me', label: t('home'), exact: true },
        { href: '/me/projects', label: t('projects') },
        { href: '/me/learning', label: t('learning') },
        { href: '/me/saved', label: t('saved') },
        { href: '/me/invitations', label: t('invitations'), badge: formatNumber(1, locale as Locale) },
      ]}
    >
      {children}
    </AreaShell>
  )
}
