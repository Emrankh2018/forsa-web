'use client'

import { PrototypeForm } from '@/components/ui/prototype-form'
import { useRef, useState, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { orgCapabilities, orgRegistrationSchema, trainerApplicationSchema } from '@forsa/shared'
import { CheckboxGroup, TextArea, TextField } from '@/components/ui/field'
import { ErrorState } from '@/components/ui/states'
import { Door } from '@/components/site/door'
import { useFormCheck } from '@/lib/use-form-check'

function useSubmit<T>(run: (form: FormData) => T | null) {
  const [done, setDone] = useState(false)
  const summary = useRef<HTMLDivElement>(null)
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (run(new FormData(e.currentTarget))) setDone(true)
    else requestAnimationFrame(() => summary.current?.focus())
  }
  return { done, summary, onSubmit }
}

/** "Under review": the request waits behind a closed door, with what happens next. */
function UnderReview({ title, body, steps, next }: { title: string; body: string; steps?: string[]; next: string | null }) {
  const app = useTranslations('app')
  const account = useTranslations('account')
  return (
    <div className="grid items-end gap-8 sm:grid-cols-[9rem_1fr]" role="status">
      <Door open={6} className="h-48" />
      <div>
        <p className="font-display text-3xl font-bold">{title}</p>
        <p className="mt-3 max-w-xl text-lg leading-relaxed">{body}</p>
        {steps ? (
          <ol className="mt-5 space-y-2" role="list">
            {steps.map((s, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className={`arch inline-block h-6 w-4 ${i === 0 ? 'bg-maroon' : 'bg-paper-deep'}`} aria-hidden="true" />
                {s}
              </li>
            ))}
          </ol>
        ) : null}
        <p className="mt-4 text-sm text-maroon">{app('savedLocally')}</p>
        {next ? <Link href={next} className="btn-arch mt-6">{account('backTo')}</Link> : null}
      </div>
    </div>
  )
}

export function OrgRegistration({ next }: { next: string | null }) {
  const t = useTranslations('orgReg')
  const f = useTranslations('forms')
  const { errors, check } = useFormCheck()
  const { done, summary, onSubmit } = useSubmit((form) =>
    check(orgRegistrationSchema, {
      orgName: form.get('orgName') ?? '', sector: form.get('sector') ?? '', website: form.get('website') ?? '',
      registrationNumber: form.get('registrationNumber') ?? '', capabilities: form.getAll('capabilities'),
      contactName: form.get('contactName') ?? '', contactEmail: form.get('contactEmail') ?? '', contactPhone: form.get('contactPhone') ?? '',
      consent: form.get('consent') === 'on',
    }),
  )
  if (done) return <UnderReview title={t('reviewTitle')} body={t('reviewBody')} steps={[t('reviewStep1'), t('reviewStep2'), t('reviewStep3')]} next={next} />
  return (
    <PrototypeForm noValidate onSubmit={onSubmit} className="max-w-2xl space-y-6">
      {Object.keys(errors).length ? <div ref={summary} tabIndex={-1} className="outline-none"><ErrorState title={f('fix')} body={Object.values(errors).join(' ')} /></div> : null}
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField id="orgName" label={t('orgName')} autoComplete="organization" error={errors.orgName} />
        <TextField id="sector" label={t('sector')} error={errors.sector} />
        <TextField id="website" type="url" label={t('website')} hint={f('optional')} placeholder="https://" error={errors.website} />
        <TextField id="registrationNumber" label={t('registrationNumber')} error={errors.registrationNumber} />
      </div>
      <div>
        <label htmlFor="document" className="block font-medium">{t('document')}</label>
        <p id="document-hint" className="mt-1 text-sm text-ink-soft">{t('documentHint')}</p>
        <input id="document" type="file" accept=".pdf,image/*" aria-describedby="document-hint" className="mt-2 block w-full text-sm file:me-4 file:min-h-11 file:rounded-md file:border-0 file:bg-ink file:px-4 file:text-paper" />
      </div>
      <CheckboxGroup id="capabilities" legend={t('capabilities')} options={orgCapabilities.map((c) => ({ value: c, label: t(c) }))} error={errors.capabilities} />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField id="contactName" label={t('contactName')} autoComplete="name" error={errors.contactName} />
        <TextField id="contactEmail" type="email" label={t('contactEmail')} autoComplete="email" error={errors.contactEmail} />
        <TextField id="contactPhone" type="tel" label={t('contactPhone')} hint={f('optional')} error={errors.contactPhone} />
      </div>
      <div>
        <label className="flex items-start gap-3">
          <input type="checkbox" name="consent" className="mt-1 size-5 flex-none accent-maroon" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? 'consent-error' : undefined} />
          {t('consent')}
        </label>
        {errors.consent ? <p id="consent-error" className="mt-1 text-sm font-medium text-maroon">{errors.consent}</p> : null}
      </div>
      <button type="submit" className="btn-arch">{t('submit')}</button>
    </PrototypeForm>
  )
}

export function TrainerApplication({ next }: { next: string | null }) {
  const t = useTranslations('trainerApp')
  const f = useTranslations('forms')
  const { errors, check } = useFormCheck()
  const { done, summary, onSubmit } = useSubmit((form) =>
    check(trainerApplicationSchema, {
      fullName: form.get('fullName') ?? '', expertise: form.get('expertise') ?? '', bio: form.get('bio') ?? '',
      links: form.get('links') ?? '', topics: form.get('topics') ?? '', remoteOk: form.get('remoteOk') === 'on', consent: form.get('consent') === 'on',
    }),
  )
  if (done) return <UnderReview title={t('reviewTitle')} body={t('reviewBody')} next={next} />
  return (
    <PrototypeForm noValidate onSubmit={onSubmit} className="max-w-2xl space-y-6">
      {Object.keys(errors).length ? <div ref={summary} tabIndex={-1} className="outline-none"><ErrorState title={f('fix')} body={Object.values(errors).join(' ')} /></div> : null}
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField id="fullName" label={t('fullName')} autoComplete="name" error={errors.fullName} />
        <TextField id="expertise" label={t('expertise')} error={errors.expertise} />
      </div>
      <TextArea id="bio" label={t('bio')} rows={5} error={errors.bio} />
      <TextField id="links" type="url" label={t('links')} hint={f('optional')} placeholder="https://" error={errors.links} />
      <TextArea id="topics" label={t('topics')} hint={t('topicsHint')} rows={4} error={errors.topics} />
      <label className="flex min-h-12 items-center gap-3">
        <input type="checkbox" name="remoteOk" className="size-5 accent-maroon" defaultChecked />
        {t('remoteOk')}
      </label>
      <div>
        <label className="flex items-start gap-3">
          <input type="checkbox" name="consent" className="mt-1 size-5 flex-none accent-maroon" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? 'consent-error' : undefined} />
          {t('consent')}
        </label>
        {errors.consent ? <p id="consent-error" className="mt-1 text-sm font-medium text-maroon">{errors.consent}</p> : null}
      </div>
      <button type="submit" className="btn-arch">{t('submit')}</button>
    </PrototypeForm>
  )
}
