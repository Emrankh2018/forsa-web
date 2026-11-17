'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

/** One invitation from a company. Accepting is the only way a company gets contact details. */
export function InvitationCard({ company, date, message }: { company: string; date: string; message: string }) {
  const t = useTranslations('invitations')
  const app = useTranslations('app')
  const [answer, setAnswer] = useState<'none' | 'accepted' | 'declined'>('none')
  return (
    <article className="panel p-6">
      <p className="font-display text-2xl font-bold">{company}</p>
      <p className="mt-1 text-sm text-ink-soft">{date}</p>
      <p className="mt-4 text-lg leading-relaxed">{message}</p>
      {answer === 'none' ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn-arch" onClick={() => setAnswer('accepted')}>{t('accept')}</button>
          <button type="button" className="btn-quiet underline underline-offset-4" onClick={() => setAnswer('declined')}>{t('decline')}</button>
        </div>
      ) : (
        <div className="mt-6" role="status">
          <p className="font-medium">{answer === 'accepted' ? t('acceptedNote') : t('declinedNote')}</p>
          <p className="mt-1 text-sm text-maroon">{app('savedLocally')}</p>
        </div>
      )}
    </article>
  )
}
