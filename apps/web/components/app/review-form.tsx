'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { TextArea } from '@/components/ui/field'
import { SuccessState } from '@/components/ui/states'

type Decision = 'accepted' | 'changes_requested' | 'declined'

/**
 * The company's review of one hand-in: a decision, feedback the participant reads as written,
 * strengths (kept on the record when accepted) and a rating drawn as five small doors.
 */
export function ReviewForm({ ratingMarks }: { ratingMarks: string[] }) {
  const t = useTranslations('org')
  const app = useTranslations('app')
  const [decision, setDecision] = useState<Decision | null>(null)
  const [rating, setRating] = useState(0)
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <>
        <SuccessState title={t('reviewSent')} body={app(`state.${decision ?? 'accepted'}`)} />
        <p className="mt-3 text-sm text-maroon">{app('savedLocally')}</p>
      </>
    )
  }

  const choices: Array<[Decision, string]> = [
    ['accepted', t('accept')],
    ['changes_requested', t('changes')],
    ['declined', t('declineWork')],
  ]

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (decision) setSent(true)
      }}
    >
      <fieldset>
        <legend className="font-medium">{t('decision')}</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {choices.map(([v, label]) => (
            <label key={v} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-line px-3 has-[:checked]:border-ink has-[:checked]:bg-paper-deep">
              <input type="radio" name="decision" value={v} checked={decision === v} onChange={() => setDecision(v)} className="size-5 accent-maroon" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <TextArea id="feedback" label={t('feedback')} hint={t('feedbackHint')} rows={5} required={decision !== 'accepted'} />
      {decision === 'accepted' ? <TextArea id="strengths" label={t('strengths')} hint={t('strengthsHint')} rows={3} /> : null}
      <fieldset>
        <legend className="font-medium">{t('rating')}</legend>
        <div className="mt-3 flex gap-2">
          {ratingMarks.map((mark, i) => (
            <label key={i} className="cursor-pointer">
              <input type="radio" name="rating" value={i + 1} checked={rating === i + 1} onChange={() => setRating(i + 1)} className="peer sr-only" />
              <span className={`arch flex h-12 w-9 items-end justify-center pb-1 text-sm font-bold peer-focus-visible:outline-3 peer-focus-visible:outline-maroon ${i < rating ? 'bg-maroon text-on-night' : 'bg-paper-deep'}`}>
                {mark}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <button type="submit" className="btn-arch" disabled={!decision} aria-disabled={!decision || undefined}>{t('sendReview')}</button>
    </form>
  )
}
