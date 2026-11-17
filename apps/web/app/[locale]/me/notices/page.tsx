import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { formatters } from '@/lib/format'
import { NoticesList } from '@/components/flows/notices'

const sample = [
  { id: 'n2', at: '2026-12-16', href: '/me/invitations', unread: true },
  { id: 'n1', at: '2026-12-15', href: '/me/projects/cafe-launch-campaign', unread: true },
  { id: 'n4', at: '2026-12-09', href: '/me/learning', unread: false },
  { id: 'n3', at: '2026-12-08', href: '/me/learning', unread: false },
  { id: 'n5', at: '2026-12-07', href: '/projects/loyalty-programme', unread: false },
] as const

export default async function NoticesPage({ params }: PageProps<'/[locale]/me/notices'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('noticesPage')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('title')}</h1>
      <div className="mt-8">
        <NoticesList notices={sample.map((n) => ({ id: n.id, text: t(`items.${n.id}`), when: f.day(n.at), href: n.href, unread: n.unread }))} />
      </div>
    </>
  )
}
