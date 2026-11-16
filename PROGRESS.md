# Forsa platform v4 — progress

## Resume here
Phase 0, slice 3 — CI, docs, browser journeys. Last commit: see `git log -1`. State: half-done (GitHub repo, Supabase dev project and Vercel preview not yet created).
Next exact step: create the private GitHub repo `forsa-web` and push `main`.

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
| 3 | Playwright (390/820/1366 px, both languages: render, direction, fonts, noindex, no sideways overflow, language switch, keyboard order, 404, axe); CI workflow; README; this file; OWNER-TODO | (this commit) |

Decisions taken in phase 0:
- The bare address always opens Arabic (`localeDetection: false`): the plan sets Arabic as the default and many Arabic readers use English-language browsers. A visitor switches with the language link.
- The language link's accessible name is its visible text («English» / «العربية»), so axe's label rule passes; the longer description is a tooltip.
- Decision numbers in `production/DECISION-LOG.md` for V4 start at D-106 because D-100 to D-105 were already used.
