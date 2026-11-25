'use client'

import { PrototypeForm } from '@/components/ui/prototype-form'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { workshopSchema } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { TextArea, TextField } from '@/components/ui/field'
import { SuccessState } from '@/components/ui/states'
import { useFormCheck } from '@/lib/use-form-check'

export type WorkshopValues = { title: string; summary: string; outcomes: string; date: string; time: string; minutes: string; mode: 'online' | 'in_person'; place: string; seats: string }

const empty: WorkshopValues = { title: '', summary: '', outcomes: '', date: '', time: '17:00', minutes: '120', mode: 'online', place: '', seats: '25' }

/** The trainer's workshop form (new or edit), checked by the shared rule, then sent for publishing. */
export function WorkshopForm({ initial, price }: { initial?: WorkshopValues; price: string }) {
  const t = useTranslations('workshopForm')
  const app = useTranslations('app')
  const { errors, check } = useFormCheck()
  const [v, setV] = useState<WorkshopValues>(initial ?? empty)
  const [sent, setSent] = useState(false)
  const bind = (k: keyof WorkshopValues) => ({ value: v[k], onChange: (e: { target: { value: string } }) => setV((x) => ({ ...x, [k]: e.target.value })) })

  if (sent) {
    return (
      <>
        <SuccessState title={t('sentTitle')} body={t('sentBody')} action={<Link href="/trainer/workshops" className="btn-arch">{t('back')}</Link>} />
        <p className="mt-3 text-sm text-maroon">{app('savedLocally')}</p>
      </>
    )
  }

  return (
    <PrototypeForm
      noValidate
      className="max-w-2xl space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (check(workshopSchema, v)) setSent(true)
      }}
    >
      <TextField id="title" label={t('title')} {...bind('title')} error={errors.title} />
      <TextArea id="summary" label={t('summary')} rows={3} {...bind('summary')} error={errors.summary} />
      <TextArea id="outcomes" label={t('outcomes')} hint={t('outcomesHint')} rows={4} {...bind('outcomes')} error={errors.outcomes} />
      <div className="grid gap-6 sm:grid-cols-3">
        <TextField id="date" type="date" label={t('date')} {...bind('date')} error={errors.date} />
        <TextField id="time" type="time" label={t('time')} {...bind('time')} error={errors.time} />
        <TextField id="minutes" inputMode="numeric" label={t('minutes')} {...bind('minutes')} error={errors.minutes} />
      </div>
      <fieldset>
        <legend className="font-medium">{t('mode')}</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {(['online', 'in_person'] as const).map((m) => (
            <label key={m} className="flex min-h-16 cursor-pointer items-start gap-3 rounded-md border border-line p-3 has-[:checked]:border-ink has-[:checked]:bg-paper-deep">
              <input type="radio" name="mode" value={m} checked={v.mode === m} onChange={() => setV((x) => ({ ...x, mode: m }))} className="mt-1 size-5 accent-maroon" />
              <span>
                <span className="block font-medium">{m === 'online' ? t('online') : t('inPerson')}</span>
                <span className="block text-sm text-ink-soft">{m === 'online' ? t('onlineLine') : t('inPersonLine')}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {v.mode === 'in_person' ? <TextField id="place" label={t('place')} {...bind('place')} error={errors.place} /> : null}
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField id="seats" inputMode="numeric" label={t('seats')} {...bind('seats')} error={errors.seats} />
        <div>
          <p className="font-medium">{t('price')}</p>
          <p className="mt-2 flex min-h-12 items-center rounded-md bg-paper-deep px-3 font-bold">{price}</p>
          <p className="mt-1 text-sm text-ink-soft">{t('priceNote')}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" className="btn-arch">{t('send')}</button>
        <Link href="/trainer/workshops" className="btn-quiet underline underline-offset-4">{t('back')}</Link>
      </div>
    </PrototypeForm>
  )
}
