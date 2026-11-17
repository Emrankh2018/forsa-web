'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

/**
 * When a page fails to render: say plainly it is on our side, offer to try again, keep the way
 * home. The header stays usable (the layout is not replaced).
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('errorPage')
  useEffect(() => {
    // Logged to the browser console for diagnosis; monitoring is wired in phase 11.
    console.warn('page error', error.digest ?? '')
  }, [error])
  return (
    <main id="content" tabIndex={-1} className="mx-auto max-w-3xl px-4 py-20 outline-none sm:px-8">
      <div className="first-line first-line-static max-w-sm" aria-hidden="true" />
      <h1 className="font-display mt-8 text-4xl font-bold sm:text-5xl">{t('title')}</h1>
      <p className="mt-4 text-lg text-ink-soft" role="alert">{t('body')}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" className="btn-arch" onClick={() => reset()}>{t('retry')}</button>
        <Link href="/" className="btn-quiet underline underline-offset-4">{t('home')}</Link>
      </div>
    </main>
  )
}
