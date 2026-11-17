# Forsa platform v4 — progress

## Resume here
Phase 2, slice 6 — partners page and stored interest form. Last commit: see `git log -1`. State: done (online storing waits for the two public database settings, see OWNER-TODO #2).
Next exact step: phase 2 slice 7 — `/about`, `/faq`, `/privacy`, `/terms`, `/trainers`, and honest placeholder pages for `/sign-in` and `/join` (accounts arrive in phase 3).

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
- **No production deploys before the go-live gate.** Vercel links `main` as its production branch, so the project has an ignored-build-step command that skips every build whose `VERCEL_ENV` is `production`. The first automatic deployment Vercel started from `main` was a production one; it was cancelled before it finished (`dpl_CmbFpewdA4ggFW3SFMhyKnnFXpJj`, CANCELED).
- **Previews come from the `preview` branch.** After each slice push `preview` first, then `main` (`git push origin main:preview && git push origin main`); Vercel skips a commit it has already seen, so the order matters. Stable preview address: `forsa-web-git-preview-stark-2281.vercel.app`.
- Previews keep the team's Vercel Authentication (only signed-in team members see them) and send `noindex`.

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
| 6 | Partners: migration `20261117000200_partner_leads.sql` (table with forced RLS, `submit_partner_lead` for visitors with validation and at most three forms per email per day, `set_partner_lead_state` for admins, both logged), applied to `forsa-web-dev`; 9 new PGlite tests (31 total); shared zod schema (Arabic digits accepted in phone) with 3 unit tests; `/partners` with four ways (doors), the interest form as a server action (keeps values after errors, error summary gets focus, hidden field against bots), direct-registration panel; `e2e/partners.spec.ts` (6 passed locally: errors and kept values, preselected way, honest 'not set up' message when the site has no database settings) | (next commit) |
| 5 | Guides: `/guides` and three real guides (`packages/shared/src/content/guides.ts`: CV, LinkedIn, interview) with an "on this page" index, checklists, next steps to the matching workshop and 1-to-1 session; the interview guide has the STAR answer builder (nothing stored). Copy checker now also reads the guides | 0af344c |
| 4 | Training: `/learn` hall of four doors, `/workshops` and `/workshops/[slug]` (facts, seats door, 250 QAR, book opens the sign-in prompt), `/sessions` (three kinds, booking not open, no price shown because none is set), `/courses` and `/courses/[slug]` (modules, lessons, free preview tag, enrol prompt, no price shown). Sample content extended (workshop outcomes, session types, courses) | 2f6c7f9 |
| 3 | `/projects`: text search (Arabic and English), field and join-mode filters as links and a plain GET form (works without scripts), result count, empty state with reset; `ProjectCard` shared with home (two doors per row on phones); project page join/apply/save open the sign-in prompt and return to the page | 5929ca3 |
| 2 | Component library `components/ui`: fields (text, textarea, select, checkbox group; label, hint, error linked by aria-describedby; LTR for email/url/tel), submit button with sending state, sign-in prompt dialog (returns with `?next=`), room header, loading/empty/error/success states, tags; `/showcase` (noindex) shows each in every state; evidence `docs/evidence/showcase-*.png` | fd04b6f |
| 1 | Direction A becomes the site: `app/site.css` (arch, door, room, floor, hall, arch buttons), `components/site/{header,footer,door}`, `components/ui/section-heading`, home at `/[locale]` with the arrival, public project page at `/projects/[slug]` (sample data until phase 4), messages regrouped by area (`messages/{ar,en}/site.ts`) | (this commit) |
