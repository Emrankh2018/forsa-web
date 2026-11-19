# Emails (ready for a sender on the VPS)

Written 2026-11-19 (roadmap step 6). The templates live in `packages/shared/src/emails/templates.ts`. `renderEmail(kind, locale, values, baseUrl)` returns `{ subject, html, text }`: HTML with inline styles and the right direction for Arabic, and a plain-text version. Values are escaped in the HTML. A missing value throws instead of sending a broken email. Previews of all of them: `/ar/showcase/emails` and `/en/showcase/emails`.

Nothing is sent today. On the VPS: a sender on the Forsa domain (with SPF, DKIM and DMARC), an `email_outbox` table so a failed send is retried and never lost, and the user's notice choices from settings respected (the sign-in code always goes). Callers pass values already formatted for the language: dates in Qatar time, money with `formatMoney`, Arabic-Indic numerals in Arabic.

| Template | To | Sent when (contract function) | Placeholders | Action |
|---|---|---|---|---|
| `signInCode` | Anyone | `requestSignInCode` | `code` | none |
| `seatHeld` | Participant | `reserveWorkshopSeat` | `workshop`, `amount`, `hours` | `/me/learning` |
| `bookingConfirmed` | Participant | `markOrderPaid` or `waiveOrder` | `workshop`, `date` | `/me/learning` |
| `workshopReminder` | Participant | One day before a confirmed workshop or session | `workshop`, `date` | `/me/learning` |
| `dueReminder` | Participant | Two days before a project due date | `project`, `date` | `/me/projects` |
| `handInReceived` | Organisation | `handIn` | `participant`, `project` | `/org/projects` |
| `reviewAccepted` | Participant | `reviewHandIn` (accepted) | `company`, `project` | `/me/projects` |
| `reviewChanges` | Participant | `reviewHandIn` (changes requested) | `company`, `project` | `/me/projects` |
| `reviewDeclined` | Participant | `reviewHandIn` (declined) | `company`, `project` | `/me/projects` |
| `companyInvitation` | Participant | `inviteTalent` | `company` | `/me/invitations` |
| `organisationVerified` | Organisation | `verifyOrganisation` | `organisation` | `/org/new-project` |
| `projectApproved` | Organisation | `approveProject` | `project` | `/org/projects` |
| `trainerApproved` | Trainer | `decideQueueItem` (trainer approved) | `name` | `/trainer` |
| `adminDigest` | Admin | Weekly | `count` | `/admin/queues` |

Tests (`packages/shared/test/emails.test.ts`): every template fills in both languages, lists exactly the placeholders it uses, escapes HTML, refuses a missing value, and passes the copy rules.
