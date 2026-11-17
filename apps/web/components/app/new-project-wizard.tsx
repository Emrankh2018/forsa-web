'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { SelectField, TextArea, TextField } from '@/components/ui/field'
import { SuccessState } from '@/components/ui/states'

const steps = ['brief', 'work', 'join', 'review'] as const

/**
 * Post a project in four steps. The steps are drawn as a door opening a little more each time; the
 * values stay in the form when you go back. Nothing is sent in the prototype.
 */
export function NewProjectWizard({ fields, stepNumbers, stepOf }: { fields: Array<{ value: string; label: string }>; stepNumbers: string[]; stepOf: string[] }) {
  const t = useTranslations('org')
  const p = useTranslations('project')
  const app = useTranslations('app')
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Record<string, string>>({ mode: 'open', seats: '10' })
  const [sent, setSent] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)

  const go = (n: number) => {
    setStep(n)
    requestAnimationFrame(() => heading.current?.focus())
  }
  const bind = (k: string) => ({
    value: values[k] ?? '',
    onChange: (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value })),
  })

  if (sent) {
    return (
      <>
        <SuccessState title={t('sentTitle')} body={t('sentBody')} />
        <p className="mt-3 text-sm text-maroon">{app('savedLocally')}</p>
      </>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
      <ol className="flex gap-2 lg:flex-col" aria-label={t('wizardTitle')}>
        {steps.map((s, i) => (
          <li key={s} aria-current={i === step ? 'step' : undefined} className={`flex items-center gap-3 ${i === step ? 'font-bold' : 'text-ink-soft'}`}>
            <span className={`arch flex h-10 w-7 flex-none items-end justify-center pb-0.5 text-sm ${i < step ? 'bg-maroon text-on-night' : i === step ? 'bg-ink text-paper' : 'bg-paper-deep'}`}>{stepNumbers[i]}</span>
            <span className="hidden lg:inline">{t(`wizardSteps.${s}`)}</span>
          </li>
        ))}
      </ol>

      <form
        className="max-w-2xl space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (step < steps.length - 1) go(step + 1)
          else setSent(true)
        }}
      >
        <div>
          <p className="text-sm text-ink-soft">{stepOf[step]}</p>
          <h2 ref={heading} tabIndex={-1} className="font-display mt-1 text-3xl font-bold outline-none">{t(`wizardSteps.${steps[step]!}`)}</h2>
        </div>

        {step === 0 ? (
          <>
            <TextField id="title" label={t('fTitle')} required {...bind('title')} />
            <TextArea id="brief" label={t('fBrief')} hint={t('fBriefHint')} rows={6} {...bind('brief')} />
            <SelectField id="field" label={t('fField')} options={fields} {...bind('field')} />
          </>
        ) : null}
        {step === 1 ? (
          <>
            <TextArea id="deliverables" label={t('fDeliverables')} hint={t('fDeliverablesHint')} rows={4} {...bind('deliverables')} />
            <TextArea id="acceptance" label={t('fAcceptance')} rows={3} {...bind('acceptance')} />
            <TextArea id="steps" label={t('fSteps')} hint={t('fDeliverablesHint')} rows={5} {...bind('steps')} />
          </>
        ) : null}
        {step === 2 ? (
          <>
            <fieldset>
              <legend className="font-medium">{t('fMode')}</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {(['open', 'apply'] as const).map((m) => (
                  <label key={m} className="flex min-h-16 cursor-pointer items-start gap-3 rounded-md border border-line p-3 has-[:checked]:border-ink has-[:checked]:bg-paper-deep">
                    <input type="radio" name="mode" value={m} checked={values.mode === m} onChange={() => setValues((v) => ({ ...v, mode: m }))} className="mt-1 size-5 accent-maroon" />
                    <span>
                      <span className="block font-medium">{m === 'open' ? p('modeOpen') : p('modeApply')}</span>
                      <span className="block text-sm text-ink-soft">{m === 'open' ? p('modeOpenLine') : p('modeApplyLine')}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-6 sm:grid-cols-3">
              <TextField id="seats" type="number" min={1} max={50} label={t('fSeats')} {...bind('seats')} />
              {values.mode === 'apply' ? <TextField id="applyBy" type="date" label={t('fApplyBy')} {...bind('applyBy')} /> : null}
              <TextField id="due" type="date" label={t('fDue')} {...bind('due')} />
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <dl className="divide-y divide-line border-y border-line">
              {(['title', 'brief', 'deliverables', 'steps', 'seats', 'due'] as const).map((k) => (
                <div key={k} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
                  <dt className="text-sm text-ink-soft">{t(`f${k[0]!.toUpperCase()}${k.slice(1)}` as 'fTitle')}</dt>
                  <dd className="whitespace-pre-line">{values[k] || '—'}</dd>
                </div>
              ))}
            </dl>
            <p className="border-s-4 border-maroon ps-4 text-ink-soft">{t('trainingNote')}</p>
          </>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="btn-arch">{step < steps.length - 1 ? t('next') : t('sendForApproval')}</button>
          {step > 0 ? <button type="button" className="btn-quiet underline underline-offset-4" onClick={() => go(step - 1)}>{t('previous')}</button> : null}
        </div>
      </form>
    </div>
  )
}
