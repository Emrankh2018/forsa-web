# Forsa platform v4 — progress

## Resume here
**HOLD (D-115): no phase 3, no database or back-end work until the owner's Hostinger VPS exists.** Front-end only. Certificates are deferred by the owner (not designed until the owner says).
Latest: roadmap 2 (`../../production/ROADMAP-VPS-READY.md`) steps 1 to 7 are done (the website runs as a standalone Node server for the VPS, security headers, search basics, contact page, resilience, lighter pages, patch updates); step 8 audit: `docs/AUDIT-2026-11-19-B.md`. Deploying the website to the VPS: `docs/VPS-DEPLOY.md`. Last commit: see `git log -1`.
2026-11-20: privacy and terms were rewritten as launch drafts (see "Legal pages" below). The partner pack is in `../../production/partner-pack/`.
2026-11-25: the frontend repair pass closed all 11 audit findings and related issues. The [final frontend audit](docs/FRONTEND-AUDIT-2026-11-25.md) records the release candidate and verification.
Next exact step: wait for the owner to confirm the VPS is available. Use the verified frontend recorded in the final audit as the handoff for backend and database implementation.

---

Plan: `../../production/PLATFORM-PLAN-V4.md`. Builder: Claude Opus 5.5 in the owner's session, one operator. Owner-only items: `docs/OWNER-TODO.md`.

## Versions (checked 2026-11-17 on npm and Context7)

| Package | Version | Note |
|---|---|---|
| Node | 26.8.1 locally, 24 in CI | `engines` >= 24 |
| next | 16.4.6 | `proxy.ts` replaces middleware; `PageProps`/`LayoutProps` helpers from `next typegen` |
| next-intl | 4.15.1 | `defineRouting`, `createMiddleware` in `proxy.ts`, `getRequestConfig` |
| react / react-dom | 19.3.1 | |
| tailwindcss | 4.3.5 | tokens in `@theme` in `app/globals.css` |
| typescript | 6.0.x | TS 7 exists but typescript-eslint and Next do not support it yet |
| eslint | 9.39.x | eslint 10 skipped for the same reason |
| vitest | 5.1.0 | |
| @electric-sql/pglite | 0.5.16 | database tests without Docker |
| @playwright/test | 1.64.1 | `playwright-core` pinned by `overrides` so @axe-core/playwright uses the same one |

## Phase 0 — Foundations

| Slice | What | Commit |
|---|---|---|
| 1 | npm workspaces; `packages/shared` (locale, numerals, money in dirhams, Qatar date, messages ar/en with a type that forces the same keys); `apps/web` shell at `/ar` and `/en` with `lang`/`dir`, Amiri + IBM Plex Sans Arabic + IBM Plex Sans via `next/font/google`, identity colours as Tailwind tokens, first-line motif, door symbol, language switch, skip link, not-found, noindex and security headers | 093bbed |
| 2 | Base migration `20261117000100_base.sql`: `profiles`, `settings`, `audit_log`; `private` schema for helpers; RLS forced; role guarded twice; `set_setting` (admin only, logged, payment flags can never be switched on); PGlite harness and 22 access tests; copy checker with self-test | 667a1e5 |
| 3 | Playwright (390/820/1366 px, both languages: render, direction, fonts, noindex, no sideways overflow, language switch, keyboard order, 404, axe); CI workflow; README; this file; OWNER-TODO | 8bfc4a2 |
| 4 | External setup: GitHub private repo `Emrankh2018/forsa-web` (pushed); Supabase `forsa-web-dev` (id `sqsrwlpbxnhfpollfqku`, ap-south-1, free, $0/month) with the base migration applied; Vercel project `forsa-web` (team STARK, root `apps/web`, framework Next.js, Node 24) | 28353c8 |
| 5 | Preview build fixes: the web workspace carries its own `typescript` and `@types/node` and has no test config (Vercel installs only that workspace) | b286bd8 and the phase 1 commit |

### Hosting rules (Vercel)
- **2026-11-17, owner's instruction:** the site is published at the old demo's address **https://forsa-demo.vercel.app** (it replaced the old demo there; the old demo still exists in the Vercel project `forsa-demo` and can be pointed back). Production builds of `forsa-web` are therefore switched on: every push to `main` builds production. The site still sends `noindex` (`FORSA_ENV` is not `production`) until the go-live gate.
- Earlier rule, now replaced by the owner's instruction: production builds were skipped and the first automatic production deployment was cancelled.
- The address `forsa-demo.vercel.app` is attached as an alias to the latest `forsa-web` production deployment (it is still registered as a domain of the old `forsa-demo` project, which no tool here can remove, so after each production deploy the alias is re-pointed). To show the old demo again: assign the alias back to `dpl_4cwRZ1wBg1LCUc38P5cJhs1vXss1`.
- Previews still come from the `preview` branch and stay behind Vercel sign-in.
- **Live check 2026-11-17:** `forsa-demo.vercel.app` is public (no sign-in), serves commit a754522 (`dpl_6gMHoJ4xcjUMLYXf4L7b7pjHgiNY`), sends `noindex`; the full browser suite against it: **240 passed**.

### Supabase advisor
- One warning, accepted on purpose: `public.set_setting` is a security-definer function callable by signed-in users. It is the only write path to settings and checks for an admin itself (tested: participant and visitor refused with 42501). Every later state-change function follows the same pattern and will show the same warning.

Decisions taken in phase 0:
- The bare address always opens Arabic (`localeDetection: false`): the plan sets Arabic as the default and many Arabic readers use English-language browsers. A visitor switches with the language link.
- The language link's accessible name is its visible text («English» / «العربية»), so axe's label rule passes; the longer description is a tooltip.
- Decision numbers in `production/DECISION-LOG.md` for V4 start at D-106 because D-100 to D-105 were already used.

### Phase 0 report

| Check | Result |
|---|---|
| Copy check (self-test 11 cases + messages + sample data) | passed |
| Lint (root + Next rules) | passed, 0 problems |
| Typecheck (shared, web, supabase, e2e) | passed |
| Unit tests `packages/shared` | 8 passed |
| Database tests on PGlite `supabase` | 22 passed |
| Build `next build` | passed |
| Browser, shell (`e2e/shell.spec.ts`) at 390/820/1366, ar and en | 33 passed (render, `lang`/`dir`, Amiri + Plex fonts, noindex, no sideways overflow, language switch, keyboard order, 404, axe clean, no console errors) |
| Base migration on the real `forsa-web-dev` | applied; 12 access assertions correct in a rolled-back transaction (sign-up gives participant even if the sign-up data asks for admin; own profile only; role change refused 42501; non-admin `set_setting` refused; admin sees all and is logged; payments flag refused even for admin; visitor reads 3 public settings and no profiles). Database left empty afterwards |
| GitHub Actions CI | first run green (slice 3); later runs: see `gh run list` |
| Preview on Vercel | **working.** Two early builds failed on my configuration (missing type packages, then a stray test config); fixed. Preview `dpl_5eqCXNJbforiJK8SKU9t3frKFXNk` (commit aaaf3ad) READY at `forsa-web-git-preview-stark-2281.vercel.app`. **The full browser suite ran against it: 108 passed** (`E2E_BASE_URL=<preview> E2E_SHARE_URL=<temporary share link> npx playwright test`). Production build of the same commit skipped as intended. The owner offered Cloudflare Workers as a fallback if Vercel failed; not needed |

Not run in phase 0: nothing outstanding; GitHub CI (with browser journeys) runs on every push.

## Phase 1 — Design gate (STOP)

Two directions built as real pages under `/ar/design` and `/en/design` (the gate page explains both). Idea, shape, motion and the review against the brief: `docs/phase-1/DIRECTIONS.md`. Screenshots: `docs/phase-1/` (`<dir>-<page>-<lang>-<phone|desktop>.png`, and arrival frames `<dir>-arrival-<ms>.png`).

| Direction | Pages | Arrival |
|---|---|---|
| A «العتبة» The threshold | `/design/a` (home), `/design/a/projects/<slug>`, `/design/a/me` | The logo's door on night; the leaf swings to the logo's own angle, light falls on the floor, the view passes through the gap (GSAP, transform and opacity only) |
| B «السطر الأول» The first line | `/design/b`, `/design/b/projects/<slug>`, `/design/b/me` | The door drawn as one line rising from the floor (clip-path), the floor stretches into the first line, the bar drops in, the line settles exactly on the page's own first line |

Shared: arrival plays once per session (`?intro=1` replays), ends on any key, click, touch or scroll, never traps focus (overlay is `aria-hidden` with nothing focusable), is hidden before paint for returning visitors (inline script, no flash), removes itself by CSS after 5 s if scripts fail, never shows under reduced motion. Sample data is fictional and every page says so (`packages/shared/src/seed/sample.ts`).

| Check | Result |
|---|---|
| Browser, design gate (`e2e/design.spec.ts`): gate page, 4 pages × 2 directions × 2 languages × 3 widths | all passed: status 200, direction, h1, sample label, no sideways overflow, axe clean, no console errors |
| Arrival behaviour, both directions | passed: plays, ends on a key press, not again in the session, replays with `?intro=1`, ends by itself, never under reduced motion |
| Full browser suite | 108 passed |
| By eye (Claude opened the screenshots) | A home, A arrival, B participant home (phone and desktop) looked at; fixed: heavy doors (smaller, wider open, logo frame line), headline widows (`text-wrap: balance`), tick marks drawn as chevrons in Arabic (now a physical check mark) |

Known limits of the gate pages (they are design samples, not features): buttons lead to the participant page instead of signing in; "save" does nothing; the hall's room links jump to sections of the same page. Performance (largest paint) is not measured yet; it is part of phase 2's proof.

## Phase 2 — Design system and public site

Owner chose direction A «العتبة» on 2026-11-17 (D-114). Direction B and the gate pages were removed (git history and `docs/phase-1/` keep them).

| Slice | What | Commit |
|---|---|---|
| 8 | Proof: `e2e/site.spec.ts` (26 public pages × 2 languages × 3 widths: status, one h1, direction, no overflow, axe clean, no console errors; journey 1; keyboard dialog; no off-site return), `e2e/perf.spec.ts` (largest paint, throttled phone), evidence screenshots in `docs/evidence/` | 0aab9f1 |
| 7 | Content pages: `/about`, `/faq` (native disclosure list), `/privacy` and `/terms` (marked as drafts under legal review), `/trainers` (interest goes to the partner form with "give a workshop" ticked until accounts exist); honest `/sign-in` and `/join` placeholders that keep a safe `?next=` return path (`safeReturnPath` in shared, 2 unit tests against open redirects) | e00292e |
| 6 | Partners: migration `20261117000200_partner_leads.sql` (table with forced RLS, `submit_partner_lead` for visitors with validation and at most three forms per email per day, `set_partner_lead_state` for admins, both logged), applied to `forsa-web-dev`; 9 new PGlite tests (31 total); shared zod schema (Arabic digits accepted in phone) with 3 unit tests; `/partners` with four ways (doors), the interest form as a server action (keeps values after errors, error summary gets focus, hidden field against bots), direct-registration panel; `e2e/partners.spec.ts` (6 passed locally: errors and kept values, preselected way, honest 'not set up' message when the site has no database settings) | 4111737 |
| 5 | Guides: `/guides` and three real guides (`packages/shared/src/content/guides.ts`: CV, LinkedIn, interview) with an "on this page" index, checklists, next steps to the matching workshop and 1-to-1 session; the interview guide has the STAR answer builder (nothing stored). Copy checker now also reads the guides | 0af344c |
| 4 | Training: `/learn` hall of four doors, `/workshops` and `/workshops/[slug]` (facts, seats door, 250 QAR, book opens the sign-in prompt), `/sessions` (three kinds, booking not open, no price shown because none is set), `/courses` and `/courses/[slug]` (modules, lessons, free preview tag, enrol prompt, no price shown). Sample content extended (workshop outcomes, session types, courses) | 2f6c7f9 |
| 3 | `/projects`: text search (Arabic and English), field and join-mode filters as links and a plain GET form (works without scripts), result count, empty state with reset; `ProjectCard` shared with home (two doors per row on phones); project page join/apply/save open the sign-in prompt and return to the page | 5929ca3 |
| 2 | Component library `components/ui`: fields (text, textarea, select, checkbox group; label, hint, error linked by aria-describedby; LTR for email/url/tel), submit button with sending state, sign-in prompt dialog (returns with `?next=`), room header, loading/empty/error/success states, tags; `/showcase` (noindex) shows each in every state; evidence `docs/evidence/showcase-*.png` | fd04b6f |
| 1 | Direction A becomes the site: `app/site.css` (arch, door, room, floor, hall, arch buttons), `components/site/{header,footer,door}`, `components/ui/section-heading`, home at `/[locale]` with the arrival, public project page at `/projects/[slug]` (sample data until phase 4), messages regrouped by area (`messages/{ar,en}/site.ts`) | (this commit) |

### Phase 2 report

| Check | Result |
|---|---|
| Copy check (messages, sample data, guides) | passed |
| Lint, typecheck (all workspaces + e2e) | passed |
| Unit tests `packages/shared` | 13 passed (locale, money, Qatar date, messages, partner form schema, safe return path) |
| Database tests on PGlite | 31 passed (base 22 + partner leads 9) |
| Partner-leads migration on the real `forsa-web-dev` | applied; security advisor shows only the intended "security-definer function callable" warnings (`submit_partner_lead` for visitors, the two admin functions for signed-in users; each checks its caller itself) |
| Build | passed |
| Browser, full suite, **online Vercel preview** (`dpl_C8Cs42yeP5AhcEn5XUVJ3ev2ZeTS`, commit 0aab9f1) | **225 passed** (same suite as below, through a temporary share link) |
| Browser, full suite, local production build | **225 passed**: every public page at 390/820/1366 in Arabic and English with axe clean and no console errors; journey 1 (home → projects → filter → apply-first project → apply prompt → not now → save prompt → continue to sign-in with `?next=` → back to the same project); keyboard opens and Escape closes the prompt with focus returned; an off-site `?next=` is ignored; partner form errors keep typed values; preselected way ticked |
| Performance (`docs/evidence/perf.json`) | largest contentful paint on a simulated mid-range phone (390 px, CPU ×4, 1.6 Mbps / 150 ms, local production build): home ar 1.49 s, home en 1.30 s, projects 1.54 s, project 1.30 s, learn 1.12 s, interview guide 1.26 s, partners 1.27 s. All under the 2.5 s target. Transfer about 690 KB per first visit, mostly fonts; trimming font weights is a later optimisation |
| By eye | Claude looked at showcase, projects (phone), workshop, learn (phone), interview guide, partners, sign-in (phone); fixed: email field direction, project doors two per row on phones, invisible disabled buttons, oversized closed door on phones, a wording issue |

**Not proven in phase 2:**
- **The form entry stored online.** The form, the server action and the database function are built and tested (PGlite; and the function is live on `forsa-web-dev`), but the site has no database settings yet (OWNER-TODO #2), so on the preview it shows the honest "sending is not set up yet" message. With the two settings in place, `E2E_DB=1 npx playwright test e2e/partners.spec.ts` proves storage.
- Lighthouse itself was not run (not installed); the numbers above come from the browser's own paint timing under throttling.

Differences from the plan: sessions and courses show no price ("announced when booking opens") because no price is set; the plan's "three-step explanation" on the partners page was left out on purpose (it is the old template's numbered-steps row); `/sign-in` and `/join` are honest placeholders until phase 3.

## Front-end polish (during the back-end hold, D-115)

| Change | Why |
|---|---|
| Header rebuilt: phone = logo and actions on one line, navigation on a second swipeable line (one landmark, DOM order follows the desktop visual order); short "انضم / Join" button on phones; current area marked with the first line and `aria-current` | The phone header took three rows and the join button wrapped |
| `app/site.css` moved into Tailwind's components layer | Its classes overrode utilities such as `hidden` (sign-in showed twice on phones) |
| Phone action bar on project, workshop and course pages (seats or price beside the one action); the side panel's button shows from desktop width | On phones the action came only after the whole page |
| Not-found page as a closed door with the way home and the three main rooms; `error.tsx` for render failures | The old 404 did not use the design; there was no error screen |
| Language link written in the language it leads to | «العربية» rendered small in the Latin face |
| Guides: print button and print styles | The guide pages promised printing |
| Threshold transition between pages (React `ViewTransition` in `app/[locale]/template.tsx`): the old page steps back, the new one opens from the middle; header stays still; instant under reduced motion. Proven by a browser test that sees the `threshold-open` animation on navigation | Plan section 8: moving between areas as passing a threshold |
| Fonts: Amiri regular dropped (unused), English text face no longer preloaded | First visit about 690 KB → 570 KB; largest paint stays 1.2–1.6 s on the throttled phone |
| **Doors replace the menu (owner, 2026-11-17).** The header has no navigation: logo, language, and «ادخل / Come in» (an arch button whose small door swings open on hover and focus). The home hall has four doors, the fourth being «بابك / Your door» (night leaf with a keyhole) for accounts. Every inner page ends with "Where next?": the same four doors, small, the current room open and marked `aria-current`. `/join` is "Come in through your door": participant, organisation or trainer; the chosen door opens onto the honest "accounts open soon" note and keeps `?next=`; sign-in and join link to each other | Owner: the top menu repeated the doors; sign-in and sign-up should fit the design, not sit as plain links in a corner |
| A `loading.tsx` was tried and removed | It made unknown addresses answer 200 instead of 404, and pages are static until phase 3 |

Checks after polish: copy check, lint, typecheck, 13 unit + 31 database tests, build, **228 browser checks passed** on the local production build and on the online Vercel preview (`dpl_59Fp5HFX971nGcjgn6XRqDcFCSUx`, commit 4dfc3ea).

## Front-end work during the hold (owner asked for items 1, 3, 4, 5; certificates later)

### 1. Signed-in area prototypes (sample data, nothing saved, noindex, "prototype" band on every screen)
| Area | Screens |
|---|---|
| Participant `/me` | home (doorway opened by progress, next step), projects (active, applications, finished), workspace `/me/projects/cafe-launch-campaign` (accessible tabs: brief, steps to tick, updates, questions, hand-in with files, review), learning (workshop link hidden until confirmed, session, course progress), saved, invitations (accept releases contact) |
| Organisation `/org` | home ("what needs you" as doors), projects, project page (progress table per participant with step arches; questions with answer form; apply-first project: choose applicants up to the seats), review a hand-in (switch between hand-ins to compare; decision, feedback, strengths, rating as five small doors), post a project (four steps, values kept going back), talent (invite; contact shown only after acceptance) |
| Trainer `/trainer` | home (workshops as doors opened by how full they are), workshops (attendance marking), availability (week grid of open hours, booked hour locked), course builder (add lesson, free-preview flag) |
| Admin `/admin` | overview (counts per queue), queues (verify, approve, publish, paid or waived, leads), settings (prices and windows from the base migration; payments off) |
The "Come in" page's chosen door links to its area. Sample data: `packages/shared/src/seed/app-sample.ts` (fictional, checked by the copy checker).

### 3. Content and tools
- Fourth guide: networking (`/guides/networking`) with the 30-second introduction builder (word count and spoken time).
- CV guide: the CV line checker (`checkCvLine` in shared, 3 unit tests; flags duty openings, "I", no result, over 25 words; Arabic and English).
- English wording pass on the public pages.

### 4. Look and feel
- Lenis smooth scrolling on public pages only (not in the tools), off under reduced motion, anchors kept.
- One scroll moment on home: the "open now" doors swing to their seat angle in turn as they come into view (closed state added by script only, so no-script and reduced motion show the final state).
- Share images `public/og/forsa-{ar,en}.png` (1200×630, drawn in the site fonts so Arabic is shaped) wired as Open Graph and Twitter images; regenerate with `OG=1 npx playwright test e2e/og.spec.ts --project=desktop`.
- Email designs at `/showcase/emails` (sign-in code, booking confirmed, review received, company invitation) with inline styles ready to become real templates; nothing is sent.

### 5. Quality
- Keyboard: a new check tabs through five pages and requires a visible focus mark on every stop; workspace tabs move with arrow keys.
- Fixed from the accessibility run: prototype band moved inside the header landmark, a skipped heading level in the course builder, a low-contrast label on review tabs, scrolling tables made keyboard-reachable regions.
- Fixed: a visually hidden table label escaped its scrolling box and widened the phone page by 160 px (scroll boxes are now positioning contexts).
- **Lighthouse 13.6 on the live site** (mobile, `docs/evidence/lighthouse/*.json`): `/ar` performance 88, accessibility 100, best practices 100, LCP 1.2 s, CLS 0, TBT 330 ms (the arrival animation's script); `/en/projects` 96/100/100, LCP 1.1 s; `/ar/guides/cv` 96/100/100, LCP 1.1 s; `/ar/me` 99/100/100, LCP 1.1 s. SEO 60 everywhere only because pages ask not to be indexed until go-live (the single failing audit is `is-crawlable`).
- Fonts: already trimmed to the weights in use (Amiri Bold only; English text face loaded on demand); first visit about 570 KB. Removing more would drop weights the pages use.
- Not possible here: a real screen-reader session (no screen reader on this machine); axe and keyboard checks stand in, and the gap is stated.
- Checks: copy check, lint, typecheck, 16 unit + 31 database tests, build; **408 browser checks passed on the live site** (forsa-demo.vercel.app, commit 201bf43).

## Front-end work during the hold, part 2 (owner: "you can do from 1 to 4")

### 1. Missing prototype screens (all save nothing)
- Sign-in `/sign-in`: email, then a six-digit code (any six digits in the prototype), Google shown where it will be, then the way back to `?next=` (still refuses links off the site).
- Joining: the chosen door on `/join` continues to `/join/participant` (onboarding in four checked steps), `/join/organisation` (registration, then "under review") and `/join/trainer` (application, then "under review").
- Booking: `/workshops/<slug>/book` (hold a seat, then the ticket once the team confirms payment; payment stays manual) and `/sessions/<slug>/book` (week of open times in Qatar time).
- Participant area: course player `/me/learning/courses/<slug>/<lesson>` (progress kept for the browser tab only), `/me/settings` (language, notices, privacy, delete account with a typed word), `/me/notices`.

### 2. User-testing kit
- `/test` (not indexed): participant and company tasks that open in a new tab, an ease scale and a note after each, two closing questions, "Copy your answers" (clipboard only; nothing is sent). Facilitator script: `docs/user-testing.md`.

### 3. Shared form rules
- `packages/shared/src/schemas/forms.ts` (zod 4, messages are keys under `forms.errors`), 8 unit tests; used by every prototype form through `apps/web/lib/use-form-check.ts`. Forms use `noValidate` so the site's own messages show instead of the browser's.

### 4. Polish
- Arrival: GSAP is fetched only when the door plays (return visits and reduced motion never load it); the door stays hidden until it starts.
- Guides: "Your first week at work" and "Building a portfolio from scratch".
- FAQ: 14 questions (language, changes requested, trainers, posting a project, deleting an account, free guides).
- Removed the unused "accounts soon" component.

### Checks
- Copy check, lint, typecheck, 24 shared + 31 database tests, build.
- Full browser suite locally: 492 passed, 3 failed (the project wizard showed the browser's own required-field popup instead of the site's message); fixed with `noValidate`, then the 33 interaction checks and the new arrival check passed.
- **Live (forsa-demo.vercel.app, commit 9a8d34e, `dpl_5wBPuvm7HLLz5R2YjzcaLAqbmkaS`):** full browser suite 498 passed, 0 failed (39 skipped by design).
- Lighthouse on live `/ar` after the change: performance 85, accessibility 100, best practices 100, LCP 1.1 s, TBT 430 ms (`docs/evidence/lighthouse/ar-home-after-lazy-gsap.json`). No gain over the earlier 88: Lighthouse always loads as a first visit, so the door plays and GSAP is fetched anyway. The saving applies to return visits and reduced motion only. Lowering first-visit blocking would mean replacing the GSAP arrival with a CSS animation (owner's call; not done).

### Fix: the arrival replayed when coming back home (owner report, 2026-11-17)
- Cause: the "already seen" mark stored the page load's start time, and moving inside the site does not start a new page load, so returning home by the logo counted as a first visit.
- Fix (`components/arrival/use-arrival.ts`): the door plays once per visit (first page load in a tab). It is recorded in memory and in the tab's session storage only when it really starts; coming back home or reloading does not replay it; `?intro=1` still replays it on purpose.
- Proof: new browser check (both languages, three sizes) counts replays after "Come in" then the logo; it failed before the fix (1 replay) and passes after. Full suite 504 passed, 0 failed. The view-transition check now watches 2.5 s instead of 1.2 s (it failed under heavy load, not because of this change: 19 repeated passes with the fix).

## Roadmap until the VPS (`../../production/ROADMAP-PRE-VPS.md`), owner 2026-11-19

### Steps 1 to 3 (done)
- Step 1: `/me/profile`, public record `/p/reem`, `/org/team`, `/org/settings`, `/trainer/sessions`, `/trainer/profile`, `/admin/people`, `/admin/guides` (edit a guide card in both languages with preview), `/admin/audit` (CSV download made in the browser).
- Step 2: `/admin/organisations`, `/admin/projects`, `/admin/training`, `/admin/orders` (manual payment: mark paid or waive; online payment stated as off), `/admin/content` (fields, skills, switches; online payment locked). One shared `AdminList` (search, state filter, empty state, row actions).
- Step 3: `/trainer/workshops/new` and `/trainer/workshops/<slug>/edit`, sent for publishing; the "New workshop" button now opens it.
- New shared rules: profile, team invite, organisation settings, session type, trainer profile, guide card, skill, workshop (31 shared tests).
- Checks: copy, lint, typecheck, unit tests, build; full browser suite 627 passed, 0 failed (the one failing test had an ambiguous selector, fixed).

### Step 4 (done)
- "Not for your account" screen (`components/ui/not-yours.tsx`) and every screen state on one reference page `/showcase/states`.
- "Projects for you" on `/me`, ordered by `rankForYou` in shared (fields overlap first, ties keep order; 2 unit tests).
- Search and filters on `/workshops` (topic, online or in person) and `/courses` (topic) with a shared `ListFilters` (plain GET, works without scripts), empty states with a reset.
- Checks: 33 shared tests; full browser suite 666 passed, 0 failed after fixing one real issue (the filter area and the search box had the same accessible name).

### Steps 5 to 7
- Step 5, data seam: every page reads through `apps/web/lib/data/index.ts` (async reads, sample data today); 49 write functions in `apps/web/lib/data/writes.ts` already check input with the shared rules; `docs/BACKEND-CONTRACT.md` maps each read and write to plan V4 tables and access rules. `scripts/check-seam.mjs` fails if a screen imports sample data directly. Per-project reads now take the project (people and hand-ins on the café launch, applicants on the loyalty programme).
- Step 6, emails: 14 templates (Arabic and English, HTML and plain text, placeholders listed and tested, escaping, copy rules) in `packages/shared/src/emails/templates.ts`; `/showcase/emails` renders the real HTML; `docs/EMAILS.md`.
- Step 7, hardening: `scripts/check-controls.mjs` (no button without an action), `e2e/links.spec.ts` (crawls every internal link from both languages and all areas, all 200). Fixed: "Send the course for publishing" did nothing; "Add to calendar" now downloads a real calendar file (`makeIcs`, tested).
- Checks: copy, seam, controls, lint, typecheck, 39 shared + 31 database tests, build; full browser suite 667 passed, 0 failed.
- Live (commit c276d04, `dpl_wTAiSc1DMJhiefJNPjc7tMQVSZTP`): Lighthouse accessibility 100 and best practices 100 on `/ar`, `/en/projects`, `/ar/workshops`, `/en/me`, `/ar/admin/orders`; performance 86 to 92 (one outlier run of 69 on `/ar`, repeats 87 and 89); evidence `docs/evidence/lighthouse/step7-*.json`. Live link crawl and the interaction tests pass (the crawl's time limit raised to 7 minutes after it ran out once on the live site).


## Roadmap 2: ready for the VPS (`../../production/ROADMAP-VPS-READY.md`), owner 2026-11-19

| Step | What | Commit |
|---|---|---|
| 1 | `output: 'standalone'` (monorepo tracing root), `scripts/package-standalone.mjs` (`npm run standalone`, `--serve` for tests), `/api/health`, `deploy/nginx/forsa.conf`, `deploy/systemd/forsa-web.service`, `apps/web/.env.example`, `docs/VPS-DEPLOY.md`, one site address in `lib/site.ts`; `E2E_STANDALONE=1` runs the browser suite against the standalone server (CI does too) | 7da547a, 276c7c0 |
| 2 | CSP (Next.js static form: self only, `'unsafe-inline'` for Next's inline data and the arrival gate), HSTS, COOP; private areas `noindex` by header after go-live too | 7da547a |
| 3 | `robots.txt` (blocks all until `FORSA_ENV=production`; exact private rules from shared, unit-tested), `sitemap.xml` with language twins, canonical and per-page alternates on every public page (`lib/seo.ts`), descriptions on home and project pages, `favicon.ico`, Apple and manifest icons (`scripts/make-icons.mjs`), web app manifest, Organization data on home | 7da547a, 276c7c0 |
| 4 | `/contact`: Instagram, organisations form, questions; email only when `NEXT_PUBLIC_CONTACT_EMAIL` is set; footer link; FAQ points to it | 7da547a |
| 5 | `app/global-error.tsx` (both languages, text in `messages/fallback.ts`), reference code on the error page, tester kit keeps answers across reloads and shows the text when the clipboard is refused | 7da547a |
| 6 | Speed: shared package `sideEffects: false` and the header imports `@forsa/shared/locale` (zod off pages without forms: Arabic home 735 → 632 KB of script before compression); the browser gets only the message groups its code reads (`lib/client-messages.ts`, guard `scripts/check-client-messages.mjs`; home HTML 131 → 104 KB, 28 → 22 KB compressed) | 7da547a |
| 7 | Patch updates: next-intl 4.15.3, supabase-js 2.119.2, pglite 0.5.17, vitest 5.1.1; `npm audit` 0 | 276c7c0 |

Checks: copy (with the new browser-messages guard), lint, typecheck, 41 shared + 31 database tests, build; full browser suite against the standalone server **714 passed, 0 failed** (three runs: after steps 1-5, after trimming messages, after the updates); go-live, shell and link crawl after the audit fixes 42 passed. Running the suite with 2 workers avoids this machine running out of memory (4 workers crashed tabs) and is faster (about 9.5 minutes).

## Legal pages (2026-11-20, owner chose "Legal + partner pack")

| What | Where |
|---|---|
| Privacy notice (13 sections) and terms (15 sections), Arabic and English, written against Qatar's Law No. 13 of 2016: who is responsible, what is collected per role, purposes and basis, who sees what, storage outside Qatar, retention, rights and how to use them (30-day reply, complaint to the competent authority), security, age 18+, cookies and browser storage, changes, contact (Instagram and the contact page). Terms: accounts, proper use, projects (no money, two join modes, review duty), shared work rights (D-118), contact and hiring, workshops and refunds, certificates, no job promise, content, responsibility, suspension, Qatari law with the Arabic text prevailing | `packages/shared/src/content/legal.ts` (export `@forsa/shared/content/legal`) |
| Page layout: "on this page" index, draft notice and date, lists, contact buttons (Instagram, contact page, email when set) | `apps/web/components/site/legal-page.tsx`; pages `/privacy`, `/terms` |
| The legal pages read through the frontend data seam (`getLegalPage`). The seam guard and copy checker cover the legal content. | `lib/data/index.ts`, `scripts/check-seam.mjs`, `scripts/check-copy.mjs` |
| No cookie banner (D-121): the site sets no cookies of its own; only session storage | privacy page, section "Cookies and browser storage" |
| Values for the owner and legal adviser to confirm: D-122 | `production/DECISION-LOG.md` |

Checks: copy (with legal content), seam, controls, client messages, lint, typecheck, 41 shared + 31 database tests, build (the first build attempt failed fetching Google Fonts; the network check right after returned 200 and the rebuild passed); browser checks for `/privacy` and `/terms` at 390/820/1366 in both languages (status, one h1, direction, no sideways overflow, axe clean, no console errors): **12 passed**. By eye: Arabic phone (index, list section, contact buttons) and English desktop. Not run: the full 714-check suite (only these two pages changed) and a live deploy (nothing pushed).
