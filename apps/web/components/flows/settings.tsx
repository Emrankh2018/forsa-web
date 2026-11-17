'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { deleteAccountSchema, settingsSchema } from '@forsa/shared'
import { TextField } from '@/components/ui/field'
import { SuccessState } from '@/components/ui/states'
import { useFormCheck } from '@/lib/use-form-check'

/** Participant settings: language, notices, public-record choices, and account deletion. */
export function Settings() {
  const t = useTranslations('settings')
  const app = useTranslations('app')
  const locale = useLocale()
  const { errors, check } = useFormCheck()
  const del = useFormCheck()
  const [saved, setSaved] = useState(false)
  const [deleted, setDeleted] = useState(false)

  return (
    <div className="max-w-2xl space-y-14">
      <form
        noValidate
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          setSaved(Boolean(check(settingsSchema, { locale: fd.get('locale') ?? locale, handle: fd.get('handle') ?? '' })))
        }}
        onChange={() => setSaved(false)}
      >
        <fieldset>
          <legend className="font-display text-2xl font-bold">{t('language')}</legend>
          <div className="mt-4 flex gap-2">
            {(['ar', 'en'] as const).map((l) => (
              <label key={l} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-line px-4 has-[:checked]:border-ink has-[:checked]:bg-paper-deep">
                <input type="radio" name="locale" value={l} defaultChecked={locale === l} className="size-5 accent-maroon" />
                <span lang={l}>{l === 'ar' ? t('langAr') : t('langEn')}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-2xl font-bold">{t('notices')}</legend>
          <div className="mt-4 space-y-1">
            {(['noticeEmail', 'noticeReminders', 'noticeDigest'] as const).map((k, i) => (
              <label key={k} className="flex min-h-12 items-center gap-3">
                <input type="checkbox" name={k} defaultChecked={i < 2} className="size-5 accent-maroon" />
                {t(k)}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-2xl font-bold">{t('record')}</legend>
          <p className="mt-2 text-ink-soft">{t('recordLead')}</p>
          <div className="mt-4">
            <TextField id="handle" label={t('handle')} hint={t('handleHint')} defaultValue="reem" dir="ltr" error={errors.handle} />
          </div>
          <div className="mt-4 grid gap-1 sm:grid-cols-2">
            {(['showName', 'showCity', 'showProjects', 'showCertificates'] as const).map((k, i) => (
              <label key={k} className="flex min-h-12 items-center gap-3">
                <input type="checkbox" name={k} defaultChecked={i !== 1} className="size-5 accent-maroon" />
                {t(k)}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="btn-arch">{t('save')}</button>
          {saved ? <p role="status" className="font-medium">{t('saved')} <span className="block text-sm text-maroon">{app('savedLocally')}</span></p> : null}
        </div>
      </form>

      <section aria-labelledby="danger" className="rounded-lg border border-maroon p-6">
        <h2 id="danger" className="font-display text-2xl font-bold text-maroon">{t('danger')}</h2>
        <p className="mt-2">{t('dangerBody')}</p>
        {deleted ? (
          <div className="mt-4">
            <SuccessState title={t('deletedTitle')} body={t('deletedBody')} />
          </div>
        ) : (
          <form
            noValidate
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (del.check(deleteAccountSchema(t('deleteWord')), { confirm: new FormData(e.currentTarget).get('confirm') ?? '' })) setDeleted(true)
            }}
          >
            <TextField id="confirm" label={t('deleteLabel')} autoComplete="off" error={del.errors.confirm} />
            <button type="submit" className="min-h-12 rounded-md bg-maroon px-5 font-medium text-on-night">{t('deleteCta')}</button>
          </form>
        )}
      </section>
    </div>
  )
}
