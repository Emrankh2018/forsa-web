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
  const x_adminPeople = await getTranslations('adminPeople')
  const x_adminGuides = await getTranslations('adminGuides')
  const x_adminAudit = await getTranslations('adminAudit')
  const l = await getTranslations('adminLists')
  return (
    <AreaShell
      area="admin"
      tabs={[
        { href: '/admin', label: t('home'), exact: true },
        { href: '/admin/queues', label: t('queues') },
        { href: '/admin/people', label: x_adminPeople('title') },
        { href: '/admin/organisations', label: l('organisations.title') },
        { href: '/admin/projects', label: l('projects.title') },
        { href: '/admin/training', label: l('training.title') },
        { href: '/admin/orders', label: l('orders.title') },
        { href: '/admin/guides', label: x_adminGuides('title') },
        { href: '/admin/content', label: l('content.title') },
        { href: '/admin/audit', label: x_adminAudit('title') },
        { href: '/admin/settings', label: t('settings') },
      ]}
    >
      {children}
    </AreaShell>
  )
}
