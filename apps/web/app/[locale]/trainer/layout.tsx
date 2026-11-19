import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { AreaShell } from '@/components/app/area-shell'
import { localeOf, type MetaProps } from '@/lib/locale-param'

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: 'app' })
  return { title: t('trainer'), robots: { index: false, follow: false } }
}

export default async function TrainerLayout({ children, params }: LayoutProps<'/[locale]/trainer'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('trainerArea.nav')
  const x_trainerSessions = await getTranslations('trainerSessions')
  const x_trainerProfile = await getTranslations('trainerProfile')
  return (
    <AreaShell
      area="trainer"
      tabs={[
        { href: '/trainer', label: t('home'), exact: true },
        { href: '/trainer/workshops', label: t('workshops') },
        { href: '/trainer/availability', label: t('availability') },
        { href: '/trainer/courses', label: t('courses') },
        { href: '/trainer/sessions', label: x_trainerSessions('title') },
        { href: '/trainer/profile', label: x_trainerProfile('title') },
      ]}
    >
      {children}
    </AreaShell>
  )
}
