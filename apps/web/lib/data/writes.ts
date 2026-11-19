'use server'

/**
 * Every write the screens make (roadmap step 5), as server functions. Each one already checks its
 * input with the same shared rule the browser uses, so the server stays the authority. Today they
 * save nothing and say so (`saved: false`); on the VPS each body becomes the database call listed
 * in docs/BACKEND-CONTRACT.md, after checking who is signed in. Screens call these when the back end
 * is wired; until then forms stop after the browser check.
 */
import type { z } from 'zod'
import {
  deleteAccountSchema, fieldErrors, guideCardSchema, handInSchema, orgRegistrationSchema, orgSettingsSchema, participantOnboardingSchema,
  profileSchema, projectBriefSchema, projectJoinSchema, projectWorkSchema, questionSchema, reviewSchema, sessionTypeSchema, settingsSchema,
  signInCodeSchema, signInEmailSchema, skillSchema, slotBookingSchema, teamInviteSchema, trainerApplicationSchema, trainerProfileSchema,
  updateSchema, workshopSchema,
} from '@forsa/shared'

export type WriteResult = { ok: true; saved: false } | { ok: false; errors: Record<string, string> }

async function accept<S extends z.ZodType>(schema: S, input: unknown): Promise<WriteResult> {
  const r = schema.safeParse(input)
  return r.success ? { ok: true, saved: false } : { ok: false, errors: fieldErrors(r.error) }
}

const id = (input: unknown) => (typeof input === 'string' && input.length > 0 && input.length < 100 ? { ok: true as const, saved: false as const } : { ok: false as const, errors: { form: 'required' } })

// Sign-in and joining
export async function requestSignInCode(input: unknown) { return accept(signInEmailSchema, input) }
export async function verifySignInCode(input: unknown) { return accept(signInCodeSchema, input) }
export async function completeOnboarding(input: unknown) { return accept(participantOnboardingSchema, input) }
export async function registerOrganisation(input: unknown) { return accept(orgRegistrationSchema, input) }
export async function applyAsTrainer(input: unknown) { return accept(trainerApplicationSchema, input) }

// Participant
export async function saveProfile(input: unknown) { return accept(profileSchema, input) }
export async function saveSettings(input: unknown) { return accept(settingsSchema, input) }
export async function deleteAccount(input: unknown, word: string) { return accept(deleteAccountSchema(word), input) }
export async function toggleSaved(itemId: unknown) { return id(itemId) }
export async function joinProject(projectSlug: unknown) { return id(projectSlug) }
export async function applyToProject(projectSlug: unknown) { return id(projectSlug) }
export async function tickStep(stepId: unknown) { return id(stepId) }
export async function postUpdate(input: unknown) { return accept(updateSchema, input) }
export async function askQuestion(input: unknown) { return accept(questionSchema, input) }
export async function handIn(input: unknown) { return accept(handInSchema, input) }
export async function answerInvitation(invitationId: unknown) { return id(invitationId) }
export async function reserveWorkshopSeat(workshopSlug: unknown) { return id(workshopSlug) }
export async function bookSessionSlot(input: unknown) { return accept(slotBookingSchema, input) }
export async function markLessonDone(lessonId: unknown) { return id(lessonId) }
export async function markNoticesRead(noticeIds: unknown) { return Array.isArray(noticeIds) ? ({ ok: true, saved: false } as const) : ({ ok: false, errors: { form: 'required' } } as const) }

// Organisation
export async function postProjectBrief(input: unknown) { return accept(projectBriefSchema, input) }
export async function postProjectWork(input: unknown) { return accept(projectWorkSchema, input) }
export async function postProjectJoin(input: unknown) { return accept(projectJoinSchema, input) }
export async function sendProjectForApproval(draftId: unknown) { return id(draftId) }
export async function answerQuestion(input: unknown) { return accept(questionSchema, input) }
export async function selectApplicants(applicationIds: unknown) { return Array.isArray(applicationIds) ? ({ ok: true, saved: false } as const) : ({ ok: false, errors: { form: 'required' } } as const) }
export async function reviewHandIn(input: unknown) { return accept(reviewSchema, input) }
export async function inviteTalent(participantId: unknown) { return id(participantId) }
export async function inviteTeamMember(input: unknown) { return accept(teamInviteSchema, input) }
export async function removeTeamMember(memberId: unknown) { return id(memberId) }
export async function saveOrganisationSettings(input: unknown) { return accept(orgSettingsSchema, input) }

// Trainer
export async function sendWorkshopForPublishing(input: unknown) { return accept(workshopSchema, input) }
export async function markAttendance(bookingId: unknown) { return id(bookingId) }
export async function toggleAvailability(slotId: unknown) { return id(slotId) }
export async function addSessionType(input: unknown) { return accept(sessionTypeSchema, input) }
export async function markSessionOutcome(bookingId: unknown) { return id(bookingId) }
export async function addLesson(courseId: unknown) { return id(courseId) }
export async function sendCourseForPublishing(courseId: unknown) { return id(courseId) }
export async function saveTrainerProfile(input: unknown) { return accept(trainerProfileSchema, input) }

// Forsa team (admin)
export async function decideQueueItem(itemId: unknown) { return id(itemId) }
export async function verifyOrganisation(orgId: unknown) { return id(orgId) }
export async function approveProject(projectId: unknown) { return id(projectId) }
export async function publishTraining(itemId: unknown) { return id(itemId) }
export async function markOrderPaid(orderId: unknown) { return id(orderId) }
export async function waiveOrder(orderId: unknown) { return id(orderId) }
export async function saveGuideCard(input: unknown) { return accept(guideCardSchema, input) }
export async function addSkill(input: unknown) { return accept(skillSchema, input) }
export async function saveSwitches(flags: unknown) { return typeof flags === 'object' && flags !== null ? ({ ok: true, saved: false } as const) : ({ ok: false, errors: { form: 'required' } } as const) }
