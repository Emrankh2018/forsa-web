'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { participantOnboardingSchema, participantStatuses } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { CheckboxGroup, TextArea, TextField } from '@/components/ui/field'
import { ErrorState, SuccessState } from '@/components/ui/states'
import { useFormCheck } from '@/lib/use-form-check'

const steps = [
  { key: 'about', fields: ['fullName', 'city', 'phone'] },
  { key: 'study', fields: ['status', 'university', 'major', 'graduationYear'] },
  { key: 'fields', fields: ['fields'] },
  { key: 'profile', fields: ['bio', 'adult', 'consent'] },
] as const

/**
 * Participant onboarding in four short steps, checked with the shared rules step by step. Values
 * stay when going back. The door at the side opens a little more with each step.
 */
export function Onboarding({ fieldOptions, stepNumbers }: { fieldOptions: Array<{ value: string; label: string }>; stepNumbers: string[] }) {
  const t = useTranslations('onboarding')
  const f = useTranslations('forms')
  const app = useTranslations('app')
  const o = useTranslations('org')
  const { errors, check } = useFormCheck()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [v, setV] = useState<Record<string, string | string[] | boolean>>({ status: '', fields: [], adult: false, consent: false })
  const heading = useRef<HTMLHeadingElement>(null)
  const summary = useRef<HTMLDivElement>(null)

  const val = (k: string) => (typeof v[k] === 'string' ? (v[k] as string) : '')
  const set = (k: string) => (e: { target: { value: string } }) => setV((x) => ({ ...x, [k]: e.target.value }))
  const data = () => ({
    fullName: val('fullName'), city: val('city'), phone: val('phone'), status: val('status'), university: val('university'),
    major: val('major'), graduationYear: val('graduationYear'), fields: (v.fields as string[]) ?? [], bio: val('bio'),
    adult: v.adult === true, consent: v.consent === true,
  })

  if (done) {
    return (
      <>
        <SuccessState title={t('doneTitle')} body={t('doneBody')} action={<Link href="/me" className="btn-arch">{t('goHome')}</Link>} />
        <p className="mt-3 text-sm text-maroon">{app('savedLocally')}</p>
      </>
    )
  }

  const current = steps[step]!
  return (
    <div className="grid gap-10 lg:grid-cols-[12rem_1fr]">
      <ol className="flex gap-2 lg:flex-col" aria-label={t('title')}>
        {steps.map((s, i) => (
          <li key={s.key} aria-current={i === step ? 'step' : undefined} className={`flex items-center gap-3 ${i === step ? 'font-bold' : 'text-ink-soft'}`}>
            <span className={`arch flex h-10 w-7 flex-none items-end justify-center pb-0.5 text-sm ${i < step ? 'bg-maroon text-on-night' : i === step ? 'bg-ink text-paper' : 'bg-paper-deep'}`}>{stepNumbers[i]}</span>
            <span className="hidden lg:inline">{t(`steps.${s.key}`)}</span>
          </li>
        ))}
      </ol>
      <form
        noValidate
        className="max-w-2xl space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          const ok = check(participantOnboardingSchema, data(), [...current.fields])
          if (!ok) {
            requestAnimationFrame(() => summary.current?.focus())
            return
          }
          if (step < steps.length - 1) {
            setStep(step + 1)
            requestAnimationFrame(() => heading.current?.focus())
          } else setDone(true)
        }}
      >
        <h2 ref={heading} tabIndex={-1} className="font-display text-3xl font-bold outline-none">{t(`steps.${current.key}`)}</h2>
        {Object.keys(errors).length ? (
          <div ref={summary} tabIndex={-1} className="outline-none"><ErrorState title={f('fix')} body={Object.values(errors).join(' ')} /></div>
        ) : null}

        {current.key === 'about' ? (
          <>
            <TextField id="fullName" label={t('fullName')} autoComplete="name" value={val('fullName')} onChange={set('fullName')} error={errors.fullName} />
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField id="city" label={t('city')} hint={f('optional')} value={val('city')} onChange={set('city')} error={errors.city} />
              <TextField id="phone" type="tel" label={t('phone')} hint={f('optional')} value={val('phone')} onChange={set('phone')} error={errors.phone} />
            </div>
          </>
        ) : null}

        {current.key === 'study' ? (
          <>
            <fieldset aria-describedby={errors.status ? 'status-error' : undefined}>
              <legend className="font-medium">{t('status')}</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {participantStatuses.map((s) => (
                  <label key={s} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-line px-3 has-[:checked]:border-ink has-[:checked]:bg-paper-deep">
                    <input type="radio" name="status" value={s} checked={v.status === s} onChange={() => setV((x) => ({ ...x, status: s }))} className="size-5 accent-maroon" />
                    {t(s)}
                  </label>
                ))}
              </div>
              {errors.status ? <p id="status-error" className="mt-2 text-sm font-medium text-maroon">{errors.status}</p> : null}
            </fieldset>
            {v.status !== 'no_degree' ? (
              <div className="grid gap-6 sm:grid-cols-2">
                <TextField id="university" label={t('university')} value={val('university')} onChange={set('university')} error={errors.university} />
                <TextField id="major" label={t('major')} hint={f('optional')} value={val('major')} onChange={set('major')} error={errors.major} />
                <TextField id="graduationYear" label={t('graduationYear')} hint={f('optional')} inputMode="numeric" value={val('graduationYear')} onChange={set('graduationYear')} error={errors.graduationYear} />
              </div>
            ) : null}
          </>
        ) : null}

        {current.key === 'fields' ? (
          <div
            onChange={(e) => {
              const box = e.target as HTMLInputElement
              const list = new Set((v.fields as string[]) ?? [])
              if (box.checked) list.add(box.value)
              else list.delete(box.value)
              setV((x) => ({ ...x, fields: [...list] }))
            }}
          >
            <CheckboxGroup id="fields" legend={t('fields')} options={fieldOptions} values={(v.fields as string[]) ?? []} error={errors.fields} />
          </div>
        ) : null}

        {current.key === 'profile' ? (
          <>
            <TextArea id="bio" label={t('bio')} hint={t('bioHint')} rows={4} value={val('bio')} onChange={set('bio')} error={errors.bio} />
            {(['adult', 'consent'] as const).map((k) => (
              <div key={k}>
                <label className="flex min-h-12 items-center gap-3">
                  <input type="checkbox" checked={v[k] === true} onChange={(e) => setV((x) => ({ ...x, [k]: e.target.checked }))} aria-invalid={errors[k] ? true : undefined} aria-describedby={errors[k] ? `${k}-error` : undefined} className="size-5 accent-maroon" />
                  {t(k)}
                </label>
                {errors[k] ? <p id={`${k}-error`} className="text-sm font-medium text-maroon">{errors[k]}</p> : null}
              </div>
            ))}
          </>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="btn-arch">{step < steps.length - 1 ? o('next') : t('finish')}</button>
          {step > 0 ? <button type="button" className="btn-quiet underline underline-offset-4" onClick={() => setStep(step - 1)}>{o('previous')}</button> : null}
        </div>
      </form>
    </div>
  )
}
