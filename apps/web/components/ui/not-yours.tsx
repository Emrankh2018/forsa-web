import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

/**
 * Shown when a signed-in person opens a page that belongs to another kind of account (plan V4:
 * "a clear not for your account message"). A closed door, what happened, and the way back.
 */
export async function NotYours({ backHref = '/me' }: { backHref?: string }) {
  const t = await getTranslations('notYours')
  return (
    <div className="flex flex-col items-start gap-6 border-y border-line py-10 sm:flex-row sm:items-end" role="alert">
      <div className="arch h-28 w-20 flex-none border-4 border-ink bg-paper-deep" aria-hidden="true" />
      <div>
        <p className="font-display text-3xl font-bold">{t('title')}</p>
        <p className="mt-2 max-w-xl text-ink-soft">{t('body')}</p>
        <Link href={backHref} className="btn-arch mt-5">{t('back')}</Link>
      </div>
    </div>
  )
}
