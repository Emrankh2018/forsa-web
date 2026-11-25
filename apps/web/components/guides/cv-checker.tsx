'use client'

import { PrototypeForm } from '@/components/ui/prototype-form'
import { useId, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { checkCvLine, formatNumber, isLocale, type CvIssue } from '@forsa/shared'

/** Checks pasted CV lines against the guide's advice, line by line, in the browser. */
export function CvChecker() {
  const t = useTranslations('cvcheck')
  const raw = useLocale()
  const locale = isLocale(raw) ? raw : 'ar'
  const base = useId()
  const [text, setText] = useState('')
  const [results, setResults] = useState<Array<{ line: string; issues: CvIssue[] }> | null>(null)

  return (
    <section className="arch bg-paper-deep px-5 pb-8 pt-24 sm:px-10" aria-labelledby={`${base}-t`}>
      <h2 id={`${base}-t`} className="font-display text-3xl font-bold">{t('title')}</h2>
      <p className="mt-2 max-w-2xl text-ink-soft">{t('lead')}</p>
      <PrototypeForm
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault()
          const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
          setResults(lines.map((line) => ({ line, issues: checkCvLine(line) })))
        }}
      >
        <label htmlFor={`${base}-lines`} className="block font-medium">{t('label')}</label>
        <textarea
          id={`${base}-lines`}
          rows={5}
          value={text}
          placeholder={t('placeholder')}
          onChange={(e) => setText(e.target.value)}
          className="mt-2 block w-full rounded-md border border-line bg-paper px-3 py-2.5 focus:border-ink focus:outline-none focus-visible:outline-3 focus-visible:outline-maroon"
        />
        <button type="submit" className="btn-arch mt-4">{t('check')}</button>
      </PrototypeForm>
      {results ? (
        <div className="mt-8" aria-live="polite">
          <h3 className="font-medium">{t('results')}</h3>
          {results.length === 0 ? (
            <p className="mt-2 text-ink-soft">{t('empty')}</p>
          ) : (
            <ol className="mt-3 space-y-4" role="list">
              {results.map((r, i) => (
                <li key={i} className={`border-s-4 bg-paper px-4 py-3 ${r.issues.length ? 'border-maroon' : 'border-ink'}`}>
                  <p className="text-sm text-ink-soft">{t('line', { n: formatNumber(i + 1, locale) })}</p>
                  <p className="mt-1 font-medium">{r.line}</p>
                  <ul className="mt-2 space-y-1 text-sm" role="list">
                    {r.issues.length === 0 ? <li>{t('ok')}</li> : r.issues.map((issue) => <li key={issue} className="text-maroon">{t(issue)}</li>)}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </div>
      ) : null}
    </section>
  )
}
