# Back-end contract (what the VPS back end must implement)

Written 2026-11-19 (roadmap step 5). The screens are finished and read and write only through two files:

- `apps/web/lib/data/index.ts`: every **read**, today returning sample data.
- `apps/web/lib/data/writes.ts`: every **write**, as server functions that already check their input with the shared rules in `packages/shared/src/schemas/forms.ts` and today save nothing (`saved: false`).

When the VPS exists, the back end reimplements these functions against PostgreSQL; the screens do not change. Tables and states follow plan V4 section 5, access rules section 6 (`production/PLATFORM-PLAN-V4.md`). Tables already written and tested: `profiles`, `settings`, `audit_log`, `partner_leads` (`supabase/migrations/`). Every other table below is still to be written, with the role tests plan V4 requires.

**Rules for every function:** find who is signed in on the server (never trust the browser); check the role and ownership in the database (row-level security), not only in code; parse the input with the named shared rule; write an `audit_log` row for every decision that changes a state; return `{ ok: true }` or `{ ok: false, errors }` where each error is a key under `forms.errors`.

## Reads

| Function | Returns | Who may read | Tables |
|---|---|---|---|
| `listProjects`, `getProject(slug)`, `projectLookup` | Open projects (public fields) | Anyone | `projects`, `project_steps`, `organizations` (name) |
| `listWorkshops`, `getWorkshop(slug)`, `workshopLookup` | Published workshops; meeting link only for confirmed attendees | Anyone | `workshops` |
| `listCourses`, `getCourse(slug)`, `courseLookup` | Published courses with modules and lessons | Anyone; lesson video only for enrolled or preview | `courses`, `course_modules`, `lessons` |
| `listSessionTypes` | Published 1-to-1 offers | Anyone | `session_types` |
| `listGuides`, `getGuide(slug)`, `guideLookup` | Published guides | Anyone | `guides` |
| `getLegalPage(kind)` | Privacy notice or terms (`privacy`, `terms`), both languages, sections with lists | Anyone | `pages` |
| `getPublicRecord(handle)` | Only fields the participant marked public, accepted work, attended workshops; never contact details | Anyone | `participant_profiles`, `enrollments`, `reviews`, `workshop_bookings` |
| `getParticipantHome` | Next step, active project, booked workshop, saved, finished | The participant | `enrollments`, `step_progress`, `workshop_bookings`, `saved_items` |
| `getMyWorkspace` | Steps, updates, questions, hand-ins, review of one project | The participant | `enrollments`, `step_progress`, `progress_updates`, `project_questions`, `submissions`, `reviews` |
| `listMyApplications`, `listMyInvitations`, `getMyInvitation` | Own applications and company invitations | The participant | `project_applications`, `talent_interests` |
| `getMyLearning` | Bookings with ticket, sessions, course progress | The participant | `workshop_bookings`, `session_bookings`, `course_enrollments`, `lesson_progress` |
| `getMyRecord` | Own profile and record | The participant | `profiles`, `participant_profiles`, `participant_skills` |
| `getMyOrganisation`, `listTeam` | Organisation details and members | Members, admins | `organizations`, `organization_members`, `organization_invites` |
| `listProjectPeople(slug)`, `listHandIns(slug)`, `listApplicants(slug)` | Progress, hand-ins, applicants on own project | The project's organisation, admins | `enrollments`, `step_progress`, `submissions`, `project_applications` |
| `listTalent` | Shortlist and invitations; contact only after acceptance | The organisation | `talent_interests` |
| `getTrainer`, `getTrainerProfile`, `listTrainerSessionTypes`, `listTrainerBookings` | Own workshops, attendees (names and attendance only), slots, bookings, profile | The trainer | `trainer_profiles`, `workshops`, `workshop_bookings`, `session_types`, `availability_slots`, `session_bookings` |
| `getQueues`, `listPeople`, `listOrganisations`, `listProjectStates`, `listOrders`, `listAudit`, `listSkills` | Everything waiting, all accounts, orders, audit | Admins only | all of the above, `orders`, `payments`, `audit_log`, `skills`, `fields` |

## Writes

| Function | Input rule | Who may call | Effect (tables, state change) |
|---|---|---|---|
| `requestSignInCode` | `signInEmailSchema` | Anyone (rate-limited) | Send a six-digit code by email (`email_outbox`); no account is revealed |
| `verifySignInCode` | `signInCodeSchema` | Anyone with a pending code | Start a session; create `profiles` on first sign-in |
| `completeOnboarding` | `participantOnboardingSchema` | New participant | `profiles`, `participant_profiles` |
| `registerOrganisation` | `orgRegistrationSchema` | Signed-in person | `organizations` (pending), `organization_members` (owner); admin queue |
| `applyAsTrainer` | `trainerApplicationSchema` | Signed-in person | `trainer_profiles` (pending); admin queue |
| `saveProfile` | `profileSchema` | The participant | `participant_profiles`, `participant_skills` |
| `saveSettings` | `settingsSchema` | The user | `profiles` (language), `participant_profiles` (handle unique, what is public), notice choices |
| `deleteAccount` | `deleteAccountSchema(word)` | The user | Remove personal data; revoke certificates and strip the name; keep order records without identity |
| `toggleSaved` | id | The participant | `saved_items` |
| `joinProject` | project slug | Participant, open project with seats | `enrollments` (active); seat count |
| `applyToProject` | project slug | Participant, apply-first project before the date | `project_applications` (applied) |
| `tickStep` | step id | The enrolled participant | `step_progress` |
| `postUpdate` | `updateSchema` | The enrolled participant | `progress_updates` (with files on the VPS) |
| `askQuestion` | `questionSchema` | The enrolled participant | `project_questions` (asker hidden from others) |
| `handIn` | `handInSchema` | The enrolled participant | `submissions` (new version); enrollment → submitted; notice to the company |
| `answerInvitation` | invitation id | The invited participant | `talent_interests` → accepted or declined; contact released only on accepted |
| `reserveWorkshopSeat` | workshop slug | Participant, seats left | `workshop_bookings` (reserved), `orders` (pending, manual payment) |
| `bookSessionSlot` | `slotBookingSchema` | Participant | `session_bookings` (reserved); slot taken |
| `markLessonDone` | lesson id | Enrolled participant | `lesson_progress` |
| `markNoticesRead` | notice ids | The user | `notifications` |
| `postProjectBrief`, `postProjectWork`, `postProjectJoin` | the three project rules | Organisation member | `projects` (draft), `project_steps` |
| `sendProjectForApproval` | draft id | Organisation member | `projects` → awaiting approval; admin queue |
| `answerQuestion` | `questionSchema` | Organisation member | `project_questions` |
| `selectApplicants` | application ids (no more than seats) | Organisation member | `project_applications` → accepted (others declined or waitlisted); `enrollments` for the accepted |
| `reviewHandIn` | `reviewSchema` | Organisation member (reviewer or owner) | `reviews`; enrollment → accepted, changes requested or declined; certificate on accepted (deferred) |
| `inviteTalent` | participant id | Organisation (talent partner) | `talent_interests` (sent) |
| `inviteTeamMember`, `removeTeamMember` | `teamInviteSchema` / member id | Organisation owner | `organization_invites`, `organization_members` |
| `saveOrganisationSettings` | `orgSettingsSchema` | Organisation owner | `organizations` (not the state) |
| `sendWorkshopForPublishing` | `workshopSchema` | Approved trainer | `workshops` → awaiting approval; price from `settings` |
| `markAttendance` | booking id | The workshop's trainer | `workshop_bookings` → attended or missed |
| `toggleAvailability` | slot id | The trainer | `availability_slots` (a booked slot cannot close) |
| `addSessionType` | `sessionTypeSchema` | The trainer | `session_types` (awaiting publishing) |
| `markSessionOutcome` | booking id | The trainer | `session_bookings` → attended or missed |
| `addLesson`, `sendCourseForPublishing` | course id | The trainer | `lessons`; `courses` → awaiting approval |
| `saveTrainerProfile` | `trainerProfileSchema` | The trainer | `trainer_profiles` |
| `decideQueueItem`, `verifyOrganisation`, `approveProject`, `publishTraining` | item id | Admin | State changes per plan V4 section 5, each written to `audit_log`, each sends a notice |
| `markOrderPaid`, `waiveOrder` | order id | Admin | `orders` → paid or waived, `payments` (method `manual`, who confirmed); booking → confirmed; meeting link released |
| `saveGuideCard` | `guideCardSchema` | Admin | `guides` (both languages) |
| `addSkill` | `skillSchema` | Admin | `skills` |
| `saveSwitches` | flags | Admin | `settings` (payment flags can never be switched on here; already enforced by `set_setting`) |

## Emails (step 6) and certificates (step 8)

Email templates and their placeholders are listed in `docs/EMAILS.md` once step 6 is done. Certificates wait for the owner.
