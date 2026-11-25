'use client'

import { PrototypeForm } from '@/components/ui/prototype-form'
import { useState, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { guideCardSchema, orgSettingsSchema, profileSchema, sessionTypeSchema, teamInviteSchema, teamRoles, trainerProfileSchema } from '@forsa/shared'
import { SelectField, TextArea, TextField } from '@/components/ui/field'
import { Tag } from '@/components/ui/states'
import { useFormCheck } from '@/lib/use-form-check'

/** "Saved" line shared by every prototype form: what happened, and that nothing was kept. */
function SavedNote({ text }: { text: string }) {
  const app = useTranslations('app')
  return (
    <p role="status" className="font-medium">
      {text} <span className="block text-sm font-normal text-maroon">{app('savedLocally')}</span>
    </p>
  )
}

function Actions({ label, saved, savedText }: { label: string; saved: boolean; savedText: string }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button type="submit" className="btn-arch">{label}</button>
      {saved ? <SavedNote text={savedText} /> : null}
    </div>
  )
}

const val = (fd: FormData, k: string) => String(fd.get(k) ?? '')

/** The participant's profile: a headline, a short bio, skills and one link. */
export function ProfileForm({ initial, publicLink }: { initial: { headline: string; skills: string }; publicLink: ReactNode }) {
  const t = useTranslations('profile')
  const { errors, check } = useFormCheck()
  const [saved, setSaved] = useState(false)
  return (
    <PrototypeForm
      noValidate
      className="max-w-2xl space-y-6"
      onChange={() => setSaved(false)}
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        setSaved(Boolean(check(profileSchema, { headline: val(fd, 'headline'), bio: val(fd, 'bio'), skills: val(fd, 'skills'), links: val(fd, 'links') })))
      }}
    >
      <TextField id="headline" label={t('headline')} hint={t('headlineHint')} defaultValue={initial.headline} error={errors.headline} />
      <TextArea id="bio" label={t('bio')} rows={4} error={errors.bio} />
      <TextArea id="skills" label={t('skills')} hint={t('skillsHint')} rows={4} defaultValue={initial.skills} error={errors.skills} />
      <TextField id="links" type="url" label={t('links')} hint={t('linksHint')} error={errors.links} />
      <Actions label={t('save')} saved={saved} savedText={t('saved')} />
      <div>{publicLink}</div>
    </PrototypeForm>
  )
}

type Member = { id: string; name: string; role: (typeof teamRoles)[number]; pending: boolean }

/** The organisation's team: members with roles, removal, and an invitation form. */
export function TeamManager({ members }: { members: Member[] }) {
  const t = useTranslations('orgTeam')
  const { errors, check } = useFormCheck()
  const [note, setNote] = useState('')
  return (
    <div className="grid max-w-5xl gap-12 lg:grid-cols-[1fr_22rem]">
      <section aria-labelledby="members">
        <h2 id="members" className="font-display text-2xl font-bold">{t('members')}</h2>
        <p className="mt-2 text-sm text-ink-soft">{t('rolesHelp')}</p>
        <ul className="mt-4 divide-y divide-line border-y border-line" role="list">
          {members.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="arch inline-block h-8 w-6 flex-none bg-paper-deep" aria-hidden="true" />
              <span className="font-medium">{m.name}</span>
              <Tag tone={m.role === 'owner' ? 'accent' : 'plain'}>{t(`roles.${m.role}`)}</Tag>
              {m.pending ? <span className="text-sm text-ink-soft">{t('pending')}</span> : null}
              {m.role !== 'owner' ? (
                <button type="button" className="btn-quiet ms-auto underline underline-offset-4" onClick={() => setNote(t('removed', { name: m.name }))}>
                  {t('remove', { name: m.name })}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="invite" className="panel p-5">
        <h2 id="invite" className="font-display text-2xl font-bold">{t('invite')}</h2>
        <PrototypeForm
          noValidate
          className="mt-4 space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            const v = check(teamInviteSchema, { email: val(fd, 'email'), role: val(fd, 'role') })
            if (v) setNote(t('invited', { email: v.email }))
          }}
        >
          <TextField id="email" type="email" label={t('email')} autoComplete="off" error={errors.email} />
          <SelectField id="role" label={t('role')} options={teamRoles.filter((r) => r !== 'owner').map((r) => ({ value: r, label: t(`roles.${r}`) }))} error={errors.role} />
          <button type="submit" className="btn-arch w-full">{t('inviteCta')}</button>
        </PrototypeForm>
      </section>
      {note ? <div className="lg:col-span-2"><SavedNote text={note} /></div> : null}
    </div>
  )
}

/** Organisation details and what the team receives. */
export function OrgSettingsForm({ initial }: { initial: { orgName: string; sector: string } }) {
  const t = useTranslations('orgSettings')
  const { errors, check } = useFormCheck()
  const [saved, setSaved] = useState(false)
  return (
    <PrototypeForm
      noValidate
      className="max-w-2xl space-y-10"
      onChange={() => setSaved(false)}
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        setSaved(Boolean(check(orgSettingsSchema, { orgName: val(fd, 'orgName'), sector: val(fd, 'sector'), website: val(fd, 'website'), about: val(fd, 'about') })))
      }}
    >
      <fieldset className="space-y-6">
        <legend className="font-display text-2xl font-bold">{t('details')}</legend>
        <p className="text-ink-soft">{t('detailsLead')}</p>
        <div className="flex items-center gap-2 text-sm font-medium text-maroon">
          <span className="arch inline-block h-5 w-3.5 bg-maroon" aria-hidden="true" />
          {t('verified')}
        </div>
        <TextField id="orgName" label={t('orgName')} defaultValue={initial.orgName} error={errors.orgName} />
        <TextField id="sector" label={t('sector')} defaultValue={initial.sector} error={errors.sector} />
        <TextField id="website" type="url" label={t('website')} error={errors.website} />
        <TextArea id="about" label={t('about')} hint={t('aboutHint')} rows={3} error={errors.about} />
      </fieldset>
      <fieldset>
        <legend className="font-display text-2xl font-bold">{t('notices')}</legend>
        <div className="mt-4 space-y-1">
          {(['noticeHandIns', 'noticeQuestions', 'noticeDigest'] as const).map((k) => (
            <label key={k} className="flex min-h-12 items-center gap-3">
              <input type="checkbox" name={k} defaultChecked className="size-5 accent-maroon" />
              {t(k)}
            </label>
          ))}
        </div>
      </fieldset>
      <Actions label={t('save')} saved={saved} savedText={t('saved')} />
    </PrototypeForm>
  )
}

/** A trainer adds a session type (published by the team before participants see it). */
export function SessionTypeForm() {
  const t = useTranslations('trainerSessions')
  const { errors, check } = useFormCheck()
  const [added, setAdded] = useState(false)
  return (
    <PrototypeForm
      noValidate
      className="panel space-y-5 p-5"
      onChange={() => setAdded(false)}
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        setAdded(Boolean(check(sessionTypeSchema, { name: val(fd, 'name'), minutes: val(fd, 'minutes') })))
      }}
    >
      <h3 className="text-lg font-bold">{t('addType')}</h3>
      <TextField id="name" label={t('typeName')} error={errors.name} />
      <TextField id="minutes" label={t('typeMinutes')} inputMode="numeric" defaultValue="30" error={errors.minutes} />
      <button type="submit" className="btn-arch">{t('addCta')}</button>
      {added ? <SavedNote text={t('added')} /> : null}
    </PrototypeForm>
  )
}

/** Marking a past or current booking as done or missed. */
export function BookingMarks({ doneLabel, noShowLabel, doneText, noShowText }: { doneLabel: string; noShowLabel: string; doneText: string; noShowText: string }) {
  const [state, setState] = useState<'' | 'done' | 'no_show'>('')
  if (state) return <p role="status" className="text-sm font-medium">{state === 'done' ? doneText : noShowText}</p>
  return (
    <span className="flex flex-wrap gap-2">
      <button type="button" className="min-h-11 rounded-full border border-ink px-4 text-sm" onClick={() => setState('done')}>{doneLabel}</button>
      <button type="button" className="min-h-11 rounded-full border border-line px-4 text-sm" onClick={() => setState('no_show')}>{noShowLabel}</button>
    </span>
  )
}

/** The trainer's profile with a live preview of how participants see it. */
export function TrainerProfileForm({ name, initial }: { name: string; initial: { expertise: string; bio: string } }) {
  const t = useTranslations('trainerProfile')
  const { errors, check } = useFormCheck()
  const [saved, setSaved] = useState(false)
  const [live, setLive] = useState(initial)
  return (
    <div className="grid max-w-5xl gap-12 lg:grid-cols-[1fr_20rem]">
      <PrototypeForm
        noValidate
        className="space-y-6"
        onChange={(e) => {
          setSaved(false)
          const fd = new FormData(e.currentTarget)
          setLive({ expertise: val(fd, 'expertise'), bio: val(fd, 'bio') })
        }}
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          setSaved(Boolean(check(trainerProfileSchema, { expertise: val(fd, 'expertise'), bio: val(fd, 'bio'), links: val(fd, 'links') })))
        }}
      >
        <TextField id="expertise" label={t('expertise')} defaultValue={initial.expertise} error={errors.expertise} />
        <TextArea id="bio" label={t('bio')} hint={t('bioHint')} rows={5} defaultValue={initial.bio} error={errors.bio} />
        <TextField id="links" type="url" label={t('links')} error={errors.links} />
        <label className="flex min-h-12 items-center gap-3">
          <input type="checkbox" name="remote" defaultChecked className="size-5 accent-maroon" />
          {t('remote')}
        </label>
        <Actions label={t('save')} saved={saved} savedText={t('saved')} />
      </PrototypeForm>
      <aside aria-labelledby="preview" className="lg:sticky lg:top-6 lg:self-start">
        <h2 id="preview" className="text-sm font-medium text-ink-soft">{t('preview')}</h2>
        <div className="panel mt-3 p-5">
          <span className="arch block h-20 w-14 bg-night" aria-hidden="true" />
          <p className="font-display mt-4 text-2xl font-bold">{name}</p>
          <p className="mt-1 font-medium text-maroon">{live.expertise}</p>
          <p className="mt-3 whitespace-pre-line text-ink-soft">{live.bio}</p>
        </div>
      </aside>
    </div>
  )
}

type GuideCard = { slug: string; titleAr: string; titleEn: string; summaryAr: string; summaryEn: string; minutes: string }

/** The admin's guide editor: pick a guide, edit its card in both languages, see it as visitors do. */
export function GuideEditor({ guides, locale }: { guides: GuideCard[]; locale: 'ar' | 'en' }) {
  const t = useTranslations('adminGuides')
  const { errors, check } = useFormCheck()
  const [slug, setSlug] = useState(guides[0]!.slug)
  const [draft, setDraft] = useState<Record<string, GuideCard>>(Object.fromEntries(guides.map((g) => [g.slug, g])))
  const [saved, setSaved] = useState(false)
  const g = draft[slug]!
  const set = (k: keyof GuideCard) => (e: { target: { value: string } }) => {
    setSaved(false)
    setDraft((d) => ({ ...d, [slug]: { ...d[slug]!, [k]: e.target.value } }))
  }
  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
      <ul className="space-y-1" role="list">
        {guides.map((x) => (
          <li key={x.slug}>
            <button
              type="button"
              aria-pressed={x.slug === slug}
              onClick={() => { setSlug(x.slug); setSaved(false) }}
              className={`-ms-px flex min-h-11 w-full items-center gap-2 border-s-2 py-1.5 ps-3 text-start ${x.slug === slug ? 'border-maroon font-bold' : 'border-transparent hover:border-line'}`}
            >
              <span className="flex-1">{locale === 'ar' ? draft[x.slug]!.titleAr : draft[x.slug]!.titleEn}</span>
              <Tag>{t('published')}</Tag>
            </button>
          </li>
        ))}
      </ul>
      <div className="grid gap-10 xl:grid-cols-[1fr_20rem]">
        <PrototypeForm
          noValidate
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            setSaved(Boolean(check(guideCardSchema, { titleAr: g.titleAr, titleEn: g.titleEn, summaryAr: g.summaryAr, summaryEn: g.summaryEn })))
          }}
        >
          <h2 className="font-display text-2xl font-bold">{t('editing', { title: locale === 'ar' ? g.titleAr : g.titleEn })}</h2>
          <TextField id="titleAr" lang="ar" dir="rtl" label={t('titleAr')} value={g.titleAr} onChange={set('titleAr')} error={errors.titleAr} />
          <TextArea id="summaryAr" lang="ar" dir="rtl" label={t('summaryAr')} rows={3} value={g.summaryAr} onChange={set('summaryAr')} error={errors.summaryAr} />
          <TextField id="titleEn" lang="en" dir="ltr" label={t('titleEn')} value={g.titleEn} onChange={set('titleEn')} error={errors.titleEn} />
          <TextArea id="summaryEn" lang="en" dir="ltr" label={t('summaryEn')} rows={3} value={g.summaryEn} onChange={set('summaryEn')} error={errors.summaryEn} />
          <Actions label={t('save')} saved={saved} savedText={t('saved')} />
        </PrototypeForm>
        <aside aria-labelledby="guide-preview">
          <h2 id="guide-preview" className="text-sm font-medium text-ink-soft">{t('preview')}</h2>
          <div className="panel mt-3 p-5">
            <p className="font-display text-2xl font-bold">{locale === 'ar' ? g.titleAr : g.titleEn}</p>
            <p className="mt-2 text-ink-soft">{locale === 'ar' ? g.summaryAr : g.summaryEn}</p>
            <p className="mt-4 text-sm">{g.minutes}</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
