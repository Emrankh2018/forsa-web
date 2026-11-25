'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { signInCodeSchema, signInEmailSchema } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { TextField } from '@/components/ui/field'
import { PrototypeForm } from '@/components/ui/prototype-form'
import { SuccessState } from '@/components/ui/states'
import { useFormCheck } from '@/lib/use-form-check'

/**
 * Sign in without passwords: email, then the six-digit code (prototype: any six digits work and no
 * email is sent). Google sign-in is shown where it will be. Ends by offering the way back (?next=).
 */
export function SignInFlow({ next }: { next: string | null }) {
  const t = useTranslations('signInFlow')
  const a = useTranslations('account')
  const me = useTranslations('me.nav')
  const { errors, check } = useFormCheck()
  const [step, setStep] = useState<'email' | 'code' | 'done'>('email')
  const [email, setEmail] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)
  const go = (s: typeof step) => {
    setStep(s)
    requestAnimationFrame(() => heading.current?.focus())
  }
  const focusField = (form: HTMLFormElement, name: string) => {
    const field = form.elements.namedItem(name)
    if (field instanceof HTMLInputElement) requestAnimationFrame(() => field.focus())
  }

  if (step === 'done') {
    const goesToBooking = next?.startsWith('/workshops/') && next.endsWith('/book')
    const label = goesToBooking ? t('continueBooking') : next ? a('backTo') : me('home')
    return (
      <div>
        <SuccessState title={t('doneTitle')} body={t('doneBody')} headingRef={heading} />
        <Link href={next ?? '/me'} className="btn-arch mt-6">{label}</Link>
      </div>
    )
  }

  return (
    <div className="max-w-md">
      <h2 ref={heading} tabIndex={-1} className="font-display text-3xl font-bold outline-none">{step === 'email' ? t('title') : t('sentTitle')}</h2>
      <p className="mt-2 text-ink-soft">{step === 'email' ? t('lead') : t('sentBody')}</p>
      {step === 'email' ? (
        <PrototypeForm
          noValidate
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            const v = check(signInEmailSchema, { email: new FormData(e.currentTarget).get('email') ?? '' })
            if (v) {
              setEmail(v.email)
              go('code')
            } else focusField(e.currentTarget, 'email')
          }}
        >
          <TextField id="email" type="email" label={t('email')} autoComplete="email" defaultValue={email} error={errors.email} />
          <button type="submit" className="btn-arch w-full">{t('send')}</button>
          <p className="flex items-center gap-3 text-sm text-ink-soft" aria-hidden="true"><span className="h-px flex-1 bg-line" />{t('or')}<span className="h-px flex-1 bg-line" /></p>
          <button type="button" className="flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-line font-medium" onClick={() => go('done')}>
            <span className="font-bold" aria-hidden="true">G</span>
            {t('google')}
          </button>
        </PrototypeForm>
      ) : (
        <PrototypeForm
          noValidate
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (check(signInCodeSchema, { code: new FormData(e.currentTarget).get('code') ?? '' })) go('done')
            else focusField(e.currentTarget, 'code')
          }}
        >
          <p className="text-sm" dir="ltr">{email}</p>
          <TextField id="code" label={t('code')} inputMode="numeric" autoComplete="one-time-code" maxLength={11} error={errors.code} className="block min-h-14 w-full rounded-md border border-line bg-paper px-3 text-center text-2xl tracking-[0.4em] focus:border-ink focus:outline-none" />
          <button type="submit" className="btn-arch w-full">{t('verify')}</button>
          <button type="button" className="btn-quiet -ms-3 underline underline-offset-4" onClick={() => go('email')}>{t('otherEmail')}</button>
          <p className="text-sm text-maroon">{t('prototypeHint')}</p>
        </PrototypeForm>
      )}
    </div>
  )
}
