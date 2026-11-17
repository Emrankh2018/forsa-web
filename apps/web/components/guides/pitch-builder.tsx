'use client'

import { useId, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { formatNumber, isLocale } from '@forsa/shared'

const parts = ['who', 'did', 'want'] as const
/** Speaking pace used for the time estimate: about 2.3 words a second. */
const WORDS_PER_SECOND = 2.3

/** Builds a thirty-second introduction from three parts and estimates how long it takes to say. */
export function PitchBuilder() {
  const t = useTranslations('pitch')
  const raw = useLocale()
  const locale = isLocale(raw) ? raw : 'ar'
  const base = useId()
  const [v, setV] = useState({ who: '', did: '', want: '' })
  const [copied, setCopied] = useState(false)
  const text = parts.map((p) => v[p].trim()).filter(Boolean).join(' ')
  const words = text ? text.split(/\s+/).length : 0
  const seconds = Math.round(words / WORDS_PER_SECOND)

  return (
    <section className="arch bg-paper-deep px-5 pb-8 pt-24 sm:px-10" aria-labelledby={`${base}-t`}>
      <h2 id={`${base}-t`} className="font-display text-3xl font-bold">{t('title')}</h2>
      <p className="mt-2 max-w-2xl text-ink-soft">{t('lead')}</p>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {parts.map((p) => (
          <div key={p}>
            <label htmlFor={`${base}-${p}`} className="block font-medium">{t(p)}</label>
            <p id={`${base}-${p}-h`} className="mt-1 text-sm text-ink-soft">{t(`${p}Hint`)}</p>
            <textarea
              id={`${base}-${p}`}
              rows={3}
              value={v[p]}
              aria-describedby={`${base}-${p}-h`}
              onChange={(e) => {
                setCopied(false)
                setV((x) => ({ ...x, [p]: e.target.value }))
              }}
              className="mt-2 block w-full rounded-md border border-line bg-paper px-3 py-2.5 focus:border-ink focus:outline-none focus-visible:outline-3 focus-visible:outline-maroon"
            />
          </div>
        ))}
      </div>
      <h3 className="mt-8 font-medium">{t('preview')}</h3>
      <p className="mt-2 min-h-16 border-s-4 border-maroon bg-paper px-4 py-3 leading-relaxed" aria-live="polite">
        {text || <span className="text-ink-soft">{t('empty')}</span>}
      </p>
      {text ? (
        <p className="mt-2 text-sm" aria-live="polite">
          {t('length', { words, w: formatNumber(words, locale), s: formatNumber(seconds, locale) })}
          {' '}
          <span className={seconds > 30 ? 'font-medium text-maroon' : 'text-ink-soft'}>{seconds > 30 ? t('tooLong') : t('good')}</span>
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-arch"
          disabled={!text}
          aria-disabled={!text || undefined}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text)
              setCopied(true)
            } catch {
              setCopied(false)
            }
          }}
        >
          {copied ? t('copied') : t('copy')}
        </button>
        <button type="button" className="btn-quiet" onClick={() => setV({ who: '', did: '', want: '' })}>{t('clear')}</button>
      </div>
    </section>
  )
}
