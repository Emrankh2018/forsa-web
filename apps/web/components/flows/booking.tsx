'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { slotBookingSchema } from '@forsa/shared'
import { Door } from '@/components/site/door'
import { SuccessState, Tag } from '@/components/ui/states'
import { useFormCheck } from '@/lib/use-form-check'

/**
 * Booking a workshop seat with manual confirmation (plan V4 section 9): hold the seat, wait for the
 * Forsa team to confirm payment, then the ticket with the meeting link. The confirmation step is
 * simulated in the prototype.
 */
export function WorkshopBooking({ title, when, where, price, holdText, meetingLink }: { title: string; when: string; where: string; price: string; holdText: string; meetingLink: string }) {
  const t = useTranslations('booking')
  const st = useTranslations('app.state')
  const app = useTranslations('app')
  const [state, setState] = useState<'start' | 'reserved' | 'confirmed'>('start')
  const live = useRef<HTMLDivElement>(null)
  const go = (s: typeof state) => {
    setState(s)
    requestAnimationFrame(() => live.current?.focus())
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_18rem]">
      <div ref={live} tabIndex={-1} className="outline-none">
        {state === 'start' ? (
          <>
            <h2 className="font-display text-3xl font-bold">{t('summary')}</h2>
            <ul className="mt-6 divide-y divide-line border-t border-line" role="list">
              {[title, when, where].map((v, i) => (
                <li key={i} className="py-3 text-lg">{v}</li>
              ))}
            </ul>
            <dl className="flex items-baseline justify-between border-y border-line py-3">
              <dt className="text-ink-soft">{t('total')}</dt>
              <dd className="text-2xl font-bold text-maroon">{price}</dd>
            </dl>
            <h3 className="mt-8 font-medium">{t('howPaid')}</h3>
            <p className="mt-2 max-w-xl text-ink-soft">{t('howPaidBody')}</p>
            <p className="mt-2 text-sm">{holdText}</p>
            <button type="button" className="btn-arch mt-6" onClick={() => go('reserved')}>{t('reserve')}</button>
          </>
        ) : state === 'reserved' ? (
          <>
            <SuccessState title={t('reservedTitle')} body={t('reservedBody')} />
            <div className="mt-4"><Tag tone="accent">{st('reserved')}</Tag></div>
            <p className="mt-2 text-sm">{holdText}</p>
            <button type="button" className="btn-quiet -ms-3 mt-4 underline underline-offset-4" onClick={() => go('confirmed')}>{t('simulate')}</button>
          </>
        ) : (
          <article className="relative overflow-hidden rounded-t-[999px] bg-night px-8 pb-8 pt-28 text-on-night" aria-label={t('ticketTitle')}>
            <p className="text-sand">{t('ticketTitle')}</p>
            <p className="font-display mt-2 text-3xl font-bold">{title}</p>
            <p className="mt-3 text-on-night-soft">{when}</p>
            <p className="text-on-night-soft">{where}</p>
            <div className="mt-6 border-t border-night-line pt-4">
              <p className="text-sm text-on-night-soft">{t('meetingLink')}</p>
              <p className="mt-1 font-medium" dir="ltr">{meetingLink}</p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-sm bg-sand px-2 py-0.5 text-sm font-medium text-ink">{t('ticketConfirmed')}</span>
              <button type="button" className="btn-arch btn-arch--sand btn-arch--compact">{t('addToCalendar')}</button>
            </div>
            <p className="mt-6 text-sm text-on-night-soft">{t('cancelNote')}</p>
          </article>
        )}
        {state !== 'start' ? <p className="mt-4 text-sm text-maroon">{app('savedLocally')}</p> : null}
      </div>
      <div aria-hidden="true" className="hidden md:block">
        <Door open={state === 'start' ? 10 : state === 'reserved' ? 45 : 82} className="h-72" />
        <div className="floor mx-[8%]" />
      </div>
    </div>
  )
}

/** Picking a 1-to-1 time from the trainer's open slots (Qatar time). */
export function SlotPicker({ days }: { days: Array<{ label: string; slots: Array<{ id: string; label: string; full: string }> }> }) {
  const t = useTranslations('slots')
  const app = useTranslations('app')
  const { errors, check } = useFormCheck()
  const [chosen, setChosen] = useState('')
  const [done, setDone] = useState(false)
  const chosenFull = days.flatMap((d) => d.slots).find((s) => s.id === chosen)?.full ?? ''

  if (done) {
    return (
      <>
        <SuccessState title={t('doneTitle')} body={t('doneBody')} />
        <p className="mt-2 font-medium">{t('chosen', { when: chosenFull })}</p>
        <p className="mt-3 text-sm text-maroon">{app('savedLocally')}</p>
      </>
    )
  }
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (check(slotBookingSchema, { slot: chosen })) setDone(true)
      }}
    >
      <fieldset aria-describedby={errors.slot ? 'slot-error' : undefined}>
        <legend className="sr-only">{t('title')}</legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {days.map((d) => (
            <div key={d.label} className="panel p-4">
              <p className="font-medium">{d.label}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {d.slots.map((s) => (
                  <label key={s.id} className="cursor-pointer">
                    <input type="radio" name="slot" value={s.id} checked={chosen === s.id} onChange={() => setChosen(s.id)} className="peer sr-only" />
                    <span className="flex min-h-11 items-center rounded-t-[999px] border border-line px-4 pt-1 text-sm peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-3 peer-focus-visible:outline-maroon">
                      {s.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        {errors.slot ? <p id="slot-error" className="mt-3 text-sm font-medium text-maroon">{errors.slot}</p> : null}
      </fieldset>
      {chosen ? <p className="mt-4 font-medium" aria-live="polite">{t('chosen', { when: chosenFull })}</p> : null}
      <button type="submit" className="btn-arch mt-6">{t('confirm')}</button>
    </form>
  )
}
