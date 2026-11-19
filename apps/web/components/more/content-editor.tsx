'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { skillSchema } from '@forsa/shared'
import { SelectField, TextField } from '@/components/ui/field'
import { Tag } from '@/components/ui/states'
import { useFormCheck } from '@/lib/use-form-check'

type FieldGroup = { key: string; label: string; skills: string[] }

/** The admin's lists and switches: fields (fixed), skills per field, and platform switches. */
export function ContentEditor({ groups }: { groups: FieldGroup[] }) {
  const t = useTranslations('adminLists.content')
  const app = useTranslations('app')
  const { errors, check } = useFormCheck()
  const [added, setAdded] = useState('')
  const [saved, setSaved] = useState(false)
  return (
    <div className="max-w-4xl space-y-14">
      <section aria-labelledby="fields-h">
        <h2 id="fields-h" className="font-display text-2xl font-bold">{t('fields')}</h2>
        <p className="mt-2 text-ink-soft">{t('fieldsLead')}</p>
        <ul className="mt-4 flex flex-wrap gap-2" role="list">
          {groups.map((g) => <li key={g.key}><Tag>{g.label}</Tag></li>)}
        </ul>
      </section>

      <section aria-labelledby="skills-h">
        <h2 id="skills-h" className="font-display text-2xl font-bold">{t('skills')}</h2>
        <div className="mt-4 grid gap-8 sm:grid-cols-2">
          {groups.map((g) => (
            <div key={g.key}>
              <h3 className="font-medium">{g.label}</h3>
              <ul className="mt-2 flex flex-wrap gap-2" role="list">
                {g.skills.map((s) => <li key={s}><Tag>{s}</Tag></li>)}
              </ul>
            </div>
          ))}
        </div>
        <form
          noValidate
          className="panel mt-8 grid gap-5 p-5 sm:grid-cols-3"
          onChange={() => setAdded('')}
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            const v = check(skillSchema, { field: String(fd.get('skillField') ?? ''), skillAr: String(fd.get('skillAr') ?? ''), skillEn: String(fd.get('skillEn') ?? '') })
            if (v) setAdded(t('added', { field: groups.find((g) => g.key === v.field)!.label }))
          }}
        >
          <h3 className="text-lg font-bold sm:col-span-3">{t('addSkill')}</h3>
          <SelectField id="skillField" label={t('fields')} options={groups.map((g) => ({ value: g.key, label: g.label }))} error={errors.field} />
          <TextField id="skillAr" lang="ar" dir="rtl" label={t('skillAr')} error={errors.skillAr} />
          <TextField id="skillEn" lang="en" dir="ltr" label={t('skillEn')} error={errors.skillEn} />
          <div className="flex flex-wrap items-center gap-4 sm:col-span-3">
            <button type="submit" className="btn-arch">{t('add')}</button>
            {added ? <p role="status" className="font-medium">{added} <span className="block text-sm font-normal text-maroon">{app('savedLocally')}</span></p> : null}
          </div>
        </form>
      </section>

      <form
        aria-labelledby="switches-h"
        className="space-y-4"
        onChange={() => setSaved(false)}
        onSubmit={(e) => {
          e.preventDefault()
          setSaved(true)
        }}
      >
        <h2 id="switches-h" className="font-display text-2xl font-bold">{t('switches')}</h2>
        <label className="flex min-h-12 items-center gap-3">
          <input type="checkbox" name="applyMode" defaultChecked className="size-5 accent-maroon" />
          {t('switchApplyMode')}
        </label>
        <label className="flex min-h-12 items-center gap-3">
          <input type="checkbox" name="sessions" defaultChecked className="size-5 accent-maroon" />
          {t('switchSessions')}
        </label>
        <label className="flex min-h-12 items-center gap-3 text-ink-soft">
          <input type="checkbox" name="payments" disabled aria-describedby="payments-locked" className="size-5" />
          {t('switchPayments')}
          <span id="payments-locked" className="text-sm">({t('locked')})</span>
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="btn-arch">{t('save')}</button>
          {saved ? <p role="status" className="font-medium">{t('saved')} <span className="block text-sm font-normal text-maroon">{app('savedLocally')}</span></p> : null}
        </div>
      </form>
    </div>
  )
}
