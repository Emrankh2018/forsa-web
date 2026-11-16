'use client'

import { useId, useState } from 'react'

type Labels = {
  title: string
  lead: string
  situation: string
  situationHint: string
  task: string
  taskHint: string
  action: string
  actionHint: string
  result: string
  resultHint: string
  preview: string
  empty: string
  copy: string
  copied: string
  clear: string
}

const parts = ['situation', 'task', 'action', 'result'] as const

/**
 * Builds an interview answer from its four parts and shows it as one paragraph to practise. Nothing
 * is stored or sent; the text lives only in this page.
 */
export function StarBuilder({ labels, marks }: { labels: Labels; marks: string[] }) {
  const base = useId()
  const [values, setValues] = useState<Record<(typeof parts)[number], string>>({ situation: '', task: '', action: '', result: '' })
  const [copied, setCopied] = useState(false)
  const answer = parts.map((p) => values[p].trim()).filter(Boolean).join(' ')

  return (
    <section className="arch bg-paper-deep px-5 pb-8 pt-24 sm:px-10" aria-labelledby={`${base}-title`}>
      <h2 id={`${base}-title`} className="font-display text-3xl font-bold">{labels.title}</h2>
      <p className="mt-2 max-w-2xl text-ink-soft">{labels.lead}</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {parts.map((p, i) => (
          <div key={p}>
            <label htmlFor={`${base}-${p}`} className="flex items-baseline gap-2 font-medium">
              <span className="font-display text-xl text-maroon" aria-hidden="true">{marks[i]}</span>
              {labels[p]}
            </label>
            <p id={`${base}-${p}-hint`} className="mt-1 text-sm text-ink-soft">{labels[`${p}Hint`]}</p>
            <textarea
              id={`${base}-${p}`}
              rows={p === 'action' ? 4 : 3}
              value={values[p]}
              onChange={(e) => {
                setCopied(false)
                setValues((v) => ({ ...v, [p]: e.target.value }))
              }}
              aria-describedby={`${base}-${p}-hint`}
              className="mt-2 block w-full rounded-md border border-line bg-paper px-3 py-2.5 focus:border-ink focus:outline-none focus-visible:outline-3 focus-visible:outline-maroon"
            />
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="font-medium">{labels.preview}</h3>
        <p className="mt-2 min-h-16 border-s-4 border-maroon bg-paper px-4 py-3 leading-relaxed" aria-live="polite">
          {answer || <span className="text-ink-soft">{labels.empty}</span>}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-arch"
            disabled={!answer}
            aria-disabled={!answer || undefined}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(answer)
                setCopied(true)
              } catch {
                setCopied(false)
              }
            }}
          >
            {copied ? labels.copied : labels.copy}
          </button>
          <button type="button" className="btn-quiet" onClick={() => setValues({ situation: '', task: '', action: '', result: '' })}>
            {labels.clear}
          </button>
        </div>
      </div>
    </section>
  )
}
