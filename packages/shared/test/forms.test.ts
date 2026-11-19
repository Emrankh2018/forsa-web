import { describe, expect, it } from 'vitest'
import {
  workshopSchema,
  skillSchema,
  guideCardSchema,
  orgSettingsSchema,
  profileSchema,
  sessionTypeSchema,
  teamInviteSchema,
  trainerProfileSchema,
  deleteAccountSchema, fieldErrors, handInSchema, orgRegistrationSchema, participantOnboardingSchema,
  projectBriefSchema, projectJoinSchema, projectWorkSchema, reviewSchema, settingsSchema, signInCodeSchema,
  signInEmailSchema, slotBookingSchema, trainerApplicationSchema,
} from '../src'

const errs = (r: { success: boolean; error?: unknown }) => (r.success ? {} : fieldErrors(r.error as never))

describe('sign-in', () => {
  it('accepts an email and a six-digit code, Arabic digits included', () => {
    expect(signInEmailSchema.safeParse({ email: ' Reem@Example.QA ' }).data).toEqual({ email: 'reem@example.qa' })
    expect(signInCodeSchema.safeParse({ code: '٤٨٢ ٩١٦' }).data).toEqual({ code: '482916' })
    expect(errs(signInCodeSchema.safeParse({ code: '1234' }))).toEqual({ code: 'code' })
  })
})

describe('participant onboarding', () => {
  const ok = {
    fullName: 'ريم', city: 'الدوحة', phone: '', status: 'near_graduate', university: 'جامعة قطر', major: 'تسويق',
    graduationYear: '٢٠٢٧', fields: ['marketing_media'], bio: '', adult: true, consent: true,
  }
  it('accepts a complete form', () => {
    expect(participantOnboardingSchema.safeParse(ok).success).toBe(true)
  })
  it('requires age, consent, a field, and a university unless skilled without a degree', () => {
    const e = errs(participantOnboardingSchema.safeParse({ ...ok, adult: false, consent: false, fields: [], university: '' }))
    expect(e).toMatchObject({ adult: 'adult', consent: 'consent', fields: 'pickOne' })
    expect(participantOnboardingSchema.safeParse({ ...ok, status: 'no_degree', university: '' }).success).toBe(true)
    expect(errs(participantOnboardingSchema.safeParse({ ...ok, graduationYear: '1990' }))).toEqual({ graduationYear: 'year' })
  })
})

describe('organisation and trainer', () => {
  it('checks registration numbers, links and capabilities', () => {
    const e = errs(orgRegistrationSchema.safeParse({
      orgName: 'Al Ramla Café', sector: 'Food', website: 'not a link', registrationNumber: '!!', capabilities: [],
      contactName: 'Maryam', contactEmail: 'maryam@example.qa', contactPhone: '', consent: true,
    }))
    expect(e).toEqual({ website: 'url', registrationNumber: 'registration', capabilities: 'pickOne' })
  })
  it('asks trainers for a real bio and up to six topics', () => {
    const e = errs(trainerApplicationSchema.safeParse({ fullName: 'Hala', expertise: 'CV writing', bio: 'short', links: '', topics: '', remoteOk: true, consent: true }))
    expect(e).toEqual({ bio: 'bioShort', topics: 'required' })
  })
})

describe('posting a project', () => {
  it('checks each step', () => {
    expect(errs(projectBriefSchema.safeParse({ title: 'Menu', brief: 'too short', field: 'x' }))).toEqual({ title: 'tooShort', brief: 'briefShort', field: 'pickOne' })
    expect(projectWorkSchema.safeParse({ deliverables: 'Plan\nPosts', acceptance: 'Clear Arabic', steps: 'Read\nPlan\nDesign' }).data).toEqual({
      deliverables: ['Plan', 'Posts'], acceptance: ['Clear Arabic'], steps: ['Read', 'Plan', 'Design'],
    })
    expect(errs(projectJoinSchema.safeParse({ mode: 'apply', seats: '0', applyBy: '2026-12-30', due: '2026-12-20' }))).toEqual({ seats: 'seats', applyBy: 'dates' })
    expect(projectJoinSchema.safeParse({ mode: 'open', seats: '10', applyBy: '', due: '2026-12-20' }).success).toBe(true)
  })
})

describe('review, hand-in, booking, settings', () => {
  it('needs feedback unless the work is accepted', () => {
    expect(errs(reviewSchema.safeParse({ decision: 'changes_requested', feedback: 'Fix', strengths: '', rating: 3 }))).toEqual({ feedback: 'feedback' })
    expect(reviewSchema.safeParse({ decision: 'accepted', feedback: '', strengths: 'Clear plan', rating: 5 }).success).toBe(true)
  })
  it('checks hand-ins, slots, handles and the delete confirmation', () => {
    expect(errs(handInSchema.safeParse({ text: 'Done', links: 'ftp://x' }))).toEqual({ text: 'handInShort', links: 'url' })
    expect(errs(slotBookingSchema.safeParse({ slot: '' }))).toEqual({ slot: 'pickSlot' })
    expect(errs(settingsSchema.safeParse({ locale: 'ar', handle: 'Reem Q' }))).toEqual({ handle: 'handle' })
    expect(settingsSchema.safeParse({ locale: 'en', handle: 'reem-q' }).success).toBe(true)
    expect(errs(deleteAccountSchema('احذف').safeParse({ confirm: 'delete' }))).toEqual({ confirm: 'deleteConfirm' })
    expect(deleteAccountSchema('احذف').safeParse({ confirm: ' احذف ' }).success).toBe(true)
  })
})

describe('profile, team, organisation, trainer and admin forms', () => {
  it('keeps profile skills as a short list and checks the link', () => {
    expect(profileSchema.safeParse({ headline: '', bio: '', skills: 'Canva\n\n Copywriting ', links: '' }).data?.skills).toEqual(['Canva', 'Copywriting'])
    expect(errs(profileSchema.safeParse({ headline: '', bio: '', skills: Array(13).fill('x').join('\n'), links: 'www.x' }))).toEqual({ skills: 'tooMany', links: 'url' })
  })
  it('checks team invitations and organisation settings', () => {
    expect(errs(teamInviteSchema.safeParse({ email: 'maryam@', role: 'boss' }))).toEqual({ email: 'email', role: 'pickOne' })
    expect(teamInviteSchema.safeParse({ email: ' Maryam@Example.com ', role: 'reviewer' }).data?.email).toBe('maryam@example.com')
    expect(errs(orgSettingsSchema.safeParse({ orgName: 'A', sector: 'Food', website: '', about: '' }))).toEqual({ orgName: 'tooShort' })
  })
  it('checks session lengths (Arabic digits too) and the trainer bio', () => {
    expect(sessionTypeSchema.safeParse({ name: 'CV clinic', minutes: '٣٠' }).data?.minutes).toBe(30)
    expect(errs(sessionTypeSchema.safeParse({ name: 'CV clinic', minutes: '5' }))).toEqual({ minutes: 'minutes' })
    expect(errs(trainerProfileSchema.safeParse({ expertise: 'CVs', bio: 'Short.', links: '' }))).toEqual({ bio: 'bioShort' })
  })
  it('needs both languages on a guide card', () => {
    expect(errs(guideCardSchema.safeParse({ titleAr: 'السيرة الأولى', titleEn: '', summaryAr: 'ملخص قصير جدا هنا للتجربة', summaryEn: 'A summary long enough to pass.' }))).toEqual({ titleEn: 'tooShort' })
  })
})

describe('admin content', () => {
  it('needs a field and the skill in both languages', () => {
    expect(errs(skillSchema.safeParse({ field: 'law', skillAr: 'ت', skillEn: '' }))).toEqual({ field: 'pickOne', skillAr: 'tooShort', skillEn: 'tooShort' })
    expect(skillSchema.safeParse({ field: 'applied_ai', skillAr: 'تحليل', skillEn: 'Analysis' }).success).toBe(true)
  })
})

describe('trainer workshop', () => {
  const ok = { title: 'A CV that reads fast', summary: 'You rewrite your CV line by line.', outcomes: 'A one-page CV', date: '2027-01-10', time: '17:00', minutes: '120', mode: 'online', place: '', seats: '25' }
  it('accepts an online workshop without a place', () => {
    expect(workshopSchema.safeParse(ok).success).toBe(true)
  })
  it('needs a place in person, a real time, and sensible length and seats', () => {
    expect(errs(workshopSchema.safeParse({ ...ok, mode: 'in_person', time: '25:00', minutes: '10', seats: '٦٠' }))).toEqual({ time: 'time', minutes: 'workshopMinutes', seats: 'seats', place: 'required' })
  })
})
