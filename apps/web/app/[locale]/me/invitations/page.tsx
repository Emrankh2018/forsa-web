import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { formatters } from '@/lib/format'
import { InvitationCard } from '@/components/app/invitation-card'
import { getMyInvitation } from '@/lib/data'

export default async function Invitations({ params }: PageProps<'/[locale]/me/invitations'>) {
  const sampleInvitation = await getMyInvitation()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('invitations')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('title')}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">{t('lead')}</p>
      <div className="mt-8 max-w-2xl">
        <InvitationCard company={f.pick(sampleInvitation.company)} date={f.day(sampleInvitation.at)} message={f.pick(sampleInvitation.message)} />
      </div>
    </>
  )
}
