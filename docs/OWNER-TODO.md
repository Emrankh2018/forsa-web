# Owner to-do — things only the owner can do

Opus lists here anything that needs the owner's hands, accounts or decisions, and keeps building everything that does not depend on it. Names of settings only, never values. Newest first.

| # | Added | What | Where | Why | Unblocks | State |
|---|---|---|---|---|---|---|
| 3 | 2026-11-17 | Subscribe to the Hostinger VPS and tell Opus when it is ready (operating system and access are set by you; never paste passwords into the chat) | Hostinger | The database will run on your own server (D-115) | Phase 3 and all back-end work | Open |
| 2 | 2026-11-17 | **On hold (D-115):** the two public database settings are not needed while the database moves to your VPS. Was: give the site its two **public** database settings: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (project `forsa-web-dev`, Supabase dashboard > Project Settings > API). Add them in Vercel (project `forsa-web`, Environment Variables, Preview) and in `apps/web/.env.local` on your machine. Both are public by design (they ship to browsers), but the plan says only you place keys; or tell Opus it may set these two itself | Vercel and your machine | Without them the partner form says sending is not set up yet | The interest form storing online; phase 3 sign-in | Open |
| 1 | 2026-11-17 | Choose one of the two design directions (or a mix) | https://forsa-web-git-preview-stark-2281.vercel.app/ar/design (sign in to Vercel first; previews are private to the team) and screenshots in `docs/phase-1/` | The plan's design gate: no feature screen is built before this choice | Phase 2 onwards | Done: direction A (D-114) |
