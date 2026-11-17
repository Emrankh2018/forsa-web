'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { partnerWays, type PartnerWay } from '@forsa/shared'
import { submitPartnerLead, type LeadFormState } from '@/app/[locale]/partners/actions'
import { CheckboxGroup, TextArea, TextField } from '@/components/ui/field'
import { ErrorState, SuccessState } from '@/components/ui/states'
import { SubmitButton } from '@/components/ui/submit-button'

/** The partner interest form. Works without scripts; with scripts it keeps values and moves focus. */
export function InterestForm({ preselect }: { preselect?: PartnerWay }) {
  const t = useTranslations('partners')
  const u = useTranslations('ui')
  const locale = useLocale()
  const initial: LeadFormState = {
    status: 'idle',
    errors: {},
    values: { orgName: '', contactName: '', email: '', phone: '', ways: preselect ? [preselect] : [], details: '' },
    attempt: 0,
  }
  const [state, action] = useActionState(submitPartnerLead, initial)
  const summary = useRef<HTMLDivElement>(null)
  const done = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.status === 'error') summary.current?.focus()
    if (state.status === 'success') done.current?.focus()
  }, [state.attempt, state.status])

  if (state.status === 'success') {
    return (
      <div ref={done} tabIndex={-1} className="outline-none">
        <SuccessState title={t('successTitle')} body={t('successBody')} />
      </div>
    )
  }

  const err = (k: keyof LeadFormState['errors']) => (state.errors[k] ? t(`errors.${k}`) : undefined)
  const v = state.values
  const fieldMessages = (Object.keys(state.errors) as Array<keyof LeadFormState['errors']>).map((k) => t(`errors.${k}`)).join(' ')

  return (
    <form key={state.attempt} action={action} noValidate className="space-y-6">
      {state.status === 'error' ? (
        <div ref={summary} tabIndex={-1} className="outline-none">
          <ErrorState title={t('errorSummary')} body={state.formError ? t(`errors.${state.formError}`) : fieldMessages} />
        </div>
      ) : null}
      <input type="hidden" name="locale" value={locale} />
      <div className="hidden" aria-hidden="true">
        <input name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <TextField id="orgName" label={t('orgName')} required requiredLabel={u('required')} defaultValue={v.orgName} error={err('orgName')} autoComplete="organization" maxLength={120} />
        <TextField id="contactName" label={t('contactName')} required requiredLabel={u('required')} defaultValue={v.contactName} error={err('contactName')} autoComplete="name" maxLength={100} />
        <TextField id="email" type="email" label={t('email')} required requiredLabel={u('required')} defaultValue={v.email} error={err('email')} autoComplete="email" maxLength={254} />
        <TextField id="phone" type="tel" label={t('phone')} hint={t('phoneHint')} defaultValue={v.phone} error={err('phone')} autoComplete="tel" maxLength={20} />
      </div>
      <CheckboxGroup
        id="ways"
        legend={t('ways')}
        hint={t('waysHint')}
        required
        requiredLabel={u('required')}
        error={err('ways')}
        values={v.ways}
        options={partnerWays.map((w) => ({ value: w, label: t(w) }))}
      />
      <TextArea id="details" label={t('details')} hint={t('detailsHint')} defaultValue={v.details} error={err('details')} maxLength={2000} />
      <p className="text-sm text-ink-soft">{t('privacy')}</p>
      <SubmitButton label={t('send')} pendingLabel={u('sending')} />
    </form>
  )
}
