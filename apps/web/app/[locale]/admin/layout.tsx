import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { AreaShell } from '@/components/app/area-shell'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('app')
  return { title: t('admin'), robots: { index: false, follow: false } }
}

export default async function AdminLayout({ children, params }: LayoutProps<'/[locale]/admin'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('adminArea.nav')
  return (
    <AreaShell
      area="admin"
      tabs={[
        { href: '/admin', label: t('home'), exact: true },
        { href: '/admin/queues', label: t('queues') },
        { href: '/admin/settings', label: t('settings') },
      ]}
    >
      {children}
    </AreaShell>
  )
}
