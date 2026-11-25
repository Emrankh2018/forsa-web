/**
 * The data seam (roadmap step 5). Every screen reads through these functions and never touches the
 * sample files directly. Today they return the fictional sample data; when the VPS exists, each
 * function is reimplemented against the database (see docs/BACKEND-CONTRACT.md) and the screens do
 * not change. Reads are async on purpose, so the shape already matches a real data source.
 *
 * Reference data that ships with the code (field names, the seats helper, types) is re-exported
 * from ./reference and stays synchronous.
 */
import { courseBySlug, projectBySlug, sampleCourses, sampleParticipant, sampleProjects, sampleSessionTypes as publicSessionTypes, sampleWorkshops, workshopBySlug } from '@forsa/shared/seed'
import { guideBySlug, guides } from '@forsa/shared/content'
import { legalDocs, type LegalKind } from '@forsa/shared/content/legal'
import * as app from '@forsa/shared/seed/app'

export * from './reference'

// Public catalogue: anyone may read published items.
export async function listProjects() { return sampleProjects }
export async function getProject(slug: string) { return projectBySlug(slug) }
export async function listWorkshops() { return sampleWorkshops }
export async function getWorkshop(slug: string) { return workshopBySlug(slug) }
export async function listCourses() { return sampleCourses }
export async function getCourse(slug: string) { return courseBySlug(slug) }
export async function listSessionTypes() { return publicSessionTypes }
export async function listGuides() { return guides }
export async function getGuide(slug: string) { return guideBySlug(slug) }
/** Privacy notice or terms (launch draft in shared content; the `pages` table later). */
export async function getLegalPage(kind: LegalKind) { return legalDocs[kind] }

/** Lookups for screens that resolve several items by slug in one render (one read, many finds). */
export async function projectLookup() { const all = await listProjects(); return (slug: string) => all.find((p) => p.slug === slug) }
export async function workshopLookup(visibility: 'public' | 'all' = 'public') {
  const published = await listWorkshops()
  const workshops = visibility === 'all' ? [...published, ...await listPendingWorkshops()] : published
  return (slug: string) => workshops.find((w) => w.slug === slug)
}
export async function courseLookup() { const all = await listCourses(); return (slug: string) => all.find((c) => c.slug === slug) }
export async function guideLookup() { const all = await listGuides(); return (slug: string) => all.find((g) => g.slug === slug) }

// The signed-in participant (only their own data).
export async function getMyWorkspace() { return app.sampleWorkspace }
export async function getMyInvitation() { return app.sampleInvitation }
export async function getParticipantHome() { return sampleParticipant }
export async function getWorkspace(projectSlug: string) { return projectSlug === app.sampleWorkspace.projectSlug ? app.sampleWorkspace : undefined }
export async function listMyApplications() { return app.sampleApplications }
export async function listMyInvitations() { return [app.sampleInvitation] }
export async function getMyLearning() { return app.sampleLearning }
export async function getMyRecord() { return app.sampleRecord }
/** A public record by page name; only what the person chose to show. */
export async function getPublicRecord(handle: string) { return handle === app.sampleRecord.handle ? app.sampleRecord : undefined }

// The signed-in organisation (only its own projects and people).
export async function getMyOrganisation() { return app.sampleOrg }
/** People working on one of the organisation's projects (sample: the café launch). */
export async function listProjectPeople(projectSlug: string) { return projectSlug === app.sampleWorkspace.projectSlug ? app.sampleProjectPeople : [] }
/** Submitted hand-ins on one project, by participant id. */
export async function listHandIns(projectSlug: string): Promise<typeof app.sampleHandIns> { return projectSlug === app.sampleWorkspace.projectSlug ? app.sampleHandIns : {} }
/** Applicants to an apply-first project (sample: the loyalty programme). */
export async function listApplicants(projectSlug: string) { return projectSlug === 'loyalty-programme' ? app.sampleApplicants : [] }
export async function listTalent() { return app.sampleTalent }
export async function listTeam() { return app.sampleOrgTeam }

// The signed-in trainer.
export async function getTrainer() { return app.sampleTrainer }
export async function getTrainerProfile() { return app.sampleTrainerProfile }
export async function listTrainerSessionTypes() { return app.sampleSessionTypes }
export async function listTrainerBookings() { return app.sampleSessionBookings }

// The Forsa team (admin only).
export async function getQueues() { return app.sampleQueues }
export async function listPendingProjects() { return [app.samplePendingProject] }
export async function listPendingWorkshops() { return [app.samplePendingWorkshop] }
export async function listPeople() { return app.samplePeople }
export async function listOrganisations() { return app.sampleOrganisations }
export async function listProjectStates() { return app.sampleProjectStates }
export async function listOrders() { return app.sampleOrders }
export async function listAudit() { return app.sampleAudit }
export async function listSkills() { return app.sampleSkills }
