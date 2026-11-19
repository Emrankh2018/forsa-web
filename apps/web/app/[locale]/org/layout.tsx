import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { formatNumber, type Locale } from '@forsa/shared'
import { AreaShell } from '@/components/app/area-shell'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('app')
  return { title: t('org'), robots: { index: false, follow: false } }
}

export default async function OrgLayout({ children, params }: LayoutProps<'/[locale]/org'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('org.nav')
  const x_orgTeam = await getTranslations('orgTeam')
  const x_orgSettings = await getTranslations('orgSettings')
  return (
    <AreaShell
      area="org"
      tabs={[
        { href: '/org', label: t('home'), exact: true },
        { href: '/org/projects', label: t('projects'), badge: formatNumber(2, locale as Locale) },
        { href: '/org/new-project', label: t('newProject') },
        { href: '/org/talent', label: t('talent') },
        { href: '/org/team', label: x_orgTeam('title') },
        { href: '/org/settings', label: x_orgSettings('title') },
      ]}
    >
      {children}
    </AreaShell>
  )
}
