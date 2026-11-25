'use client'

import { PrototypeForm } from '@/components/ui/prototype-form'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { TextArea } from '@/components/ui/field'
import { Tag } from '@/components/ui/states'

/** Choose applicants for an apply-first project, up to the number of seats. */
export function ApplicantPicker({ applicants, seats, seatsTexts }: { applicants: Array<{ id: string; name: string; note: string }>; seats: number; seatsTexts: string[] }) {
  const t = useTranslations('org')
  const app = useTranslations('app')
  const [chosen, setChosen] = useState<string[]>([])
  const [sent, setSent] = useState(false)
  const full = chosen.length >= seats
  return (
    <div>
      <p className="text-sm font-medium" aria-live="polite">{seatsTexts[chosen.length]}</p>
      <ul className="mt-4 divide-y divide-line border-y border-line" role="list">
        {applicants.map((a) => {
          const on = chosen.includes(a.id)
          return (
            <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{a.name}</p>
                <p className="text-sm text-ink-soft">{a.note}</p>
              </div>
              {sent ? (
                <Tag tone={on ? 'accent' : 'plain'}>{on ? t('selected') : t('notSelected')}</Tag>
              ) : (
                <button
                  type="button"
                  aria-pressed={on}
                  disabled={!on && full}
                  aria-disabled={(!on && full) || undefined}
                  onClick={() => setChosen(on ? chosen.filter((x) => x !== a.id) : [...chosen, a.id])}
                  className={on ? 'btn-arch btn-arch--compact' : 'btn-arch btn-arch--compact !bg-transparent !text-ink shadow-[inset_0_0_0_1px_var(--color-line)]'}
                >
                  {on ? t('selected') : t('select')}
                </button>
              )}
            </li>
          )
        })}
      </ul>
      {sent ? (
        <p className="mt-4 text-sm text-maroon" role="status">{app('savedLocally')}</p>
      ) : (
        <button type="button" className="btn-arch mt-6" disabled={chosen.length === 0} aria-disabled={chosen.length === 0 || undefined} onClick={() => setSent(true)}>
          {t('confirmSelection')}
        </button>
      )}
    </div>
  )
}

/** Answer an open question; the answer is shown to everyone on the project. */
export function AnswerQuestion({ id }: { id: string }) {
  const t = useTranslations('org')
  const app = useTranslations('app')
  const [done, setDone] = useState<string | null>(null)
  if (done) {
    return (
      <div className="mt-2" role="status">
        <p className="border-s-4 border-maroon ps-3">{done}</p>
        <p className="mt-1 text-sm text-maroon">{app('savedLocally')}</p>
      </div>
    )
  }
  return (
    <PrototypeForm
      className="mt-3 space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        const v = new FormData(e.currentTarget).get(id)
        if (typeof v === 'string' && v.trim()) setDone(v.trim())
      }}
    >
      <TextArea id={id} label={t('answerLabel')} rows={2} />
      <button type="submit" className="btn-arch btn-arch--compact">{t('answer')}</button>
    </PrototypeForm>
  )
}
