# Forsa — platform (version 4)

Forsa makes near-graduates and new graduates ready for the job market: partner companies post real projects that participants do and hand in on the platform, and trainers run workshops, 1-to-1 sessions and courses. Arabic (default, right to left) and English.

Plan: `../../production/PLATFORM-PLAN-V4.md` (outside this repository). Progress and the resume point: `PROGRESS.md`. Things only the owner can do: `docs/OWNER-TODO.md`.

## Layout

```
apps/web/          Next.js app (App Router, next-intl, Tailwind): public pages, /me, /org, /trainer, /admin
packages/shared/   locale, money and Qatar-time helpers, interface messages (ar, en), later schemas and state rules
supabase/          migrations, seed, database access-rule tests on PGlite (no Docker)
e2e/               Playwright journeys at 390, 820 and 1366 px
scripts/           copy checker (banned wording, no text in components)
```

## Commands (Node 24, npm workspaces)

| Command | Does |
|---|---|
| `npm install` | Install everything |
| `npm run dev` | Dev server on http://localhost:8765 |
| `npm run check` | Copy check, lint, typecheck, unit and database tests, build |
| `npx playwright test` | Browser journeys against the built site (`npm run build` first) |

## Rules kept in code

- Row-level security enabled and forced on every table; every state change through one security-definer function that checks role and state and writes the audit log.
- No interface text in components: everything is in `packages/shared/src/messages/{ar,en}`.
- Money is integer dirhams computed on the server. Payments: only `manual` (admin confirmation) until the owner opens the payments gate.
- Preview builds send `noindex`. Production only at the go-live gate.
