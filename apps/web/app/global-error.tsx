'use client'

import { useEffect } from 'react'
import { fallbackError } from '@forsa/shared/messages/fallback'

/**
 * Last resort when the root layout itself fails (fonts, messages or the language could not load), so
 * the layout, its translations and styles are not available here. Both languages, inline styles,
 * no scripts beyond React's own. Ordinary page failures use [locale]/error.tsx instead.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.warn('site error', error.digest ?? '')
  }, [error])
  const { ar, en } = fallbackError
  const box = { maxWidth: '36rem', margin: '0 auto', padding: '5rem 1rem', fontFamily: 'system-ui, sans-serif', color: '#17221F' }
  const button = { marginTop: '1.25rem', padding: '0.75rem 1.5rem', borderRadius: '999px 999px 0.5rem 0.5rem', border: 0, background: '#17221F', color: '#F4EFE6', fontSize: '1rem', cursor: 'pointer' }
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, background: '#F4EFE6' }}>
        <main style={box}>
          <h1 style={{ fontSize: '2rem' }}>{ar.title}</h1>
          <p>{ar.body}</p>
          <div lang="en" dir="ltr" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem' }}>{en.title}</h2>
            <p>{en.body}</p>
          </div>
          {error.digest ? <p dir="ltr" style={{ fontSize: '0.875rem', opacity: 0.8 }}>Ref: {error.digest}</p> : null}
          <button type="button" style={button} onClick={() => reset()}>{ar.retry} · <span lang="en">{en.retry}</span></button>
          {/* Plain links on purpose: the router may be what failed. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <p style={{ marginTop: '1rem' }}><a href="/ar" style={{ color: '#8A1F3B' }}>{ar.home}</a> · <a href="/en" lang="en" style={{ color: '#8A1F3B' }}>{en.home}</a></p>
        </main>
      </body>
    </html>
  )
}
