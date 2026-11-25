# Forsa final frontend audit

25 November 2026 · Asia/Qatar

## Scope

Reviewed the version 4 web frontend in Arabic and English. Coverage included public discovery, search and filters, sample sign-in and booking, the participant, organisation, trainer and admin workspaces, legal drafts, keyboard behaviour and narrow layouts. The app was served from its local standalone production build with sample data. The frontend is ready for backend and database implementation, with no open frontend defects found in the reviewed scope.

## Final review changes

- The Privacy and Terms pages identify themselves as drafts before the contents links. On a 390 px screen the notices previously appeared below the first viewport.
- Language switching preserves the URL's supported filters, role and return context without writing a locale cookie. The current locale still comes from the URL and the bare homepage opens in Arabic.
- The project and trainer regression tests wait for the client-only forms to become interactive before entering text. The earlier WebKit failures came from the automation trying to fill the inert server-rendered forms.
- The previous repair pass is included. It restored sample workshop and course journeys, aligned admin and participant state, corrected the project review summary and narrow join layout, and clarified preview limitations.

## Verification

- The standalone production build, frontend copy guards, lint, typecheck and 41 shared unit tests passed.
- Chromium covered phone, tablet and desktop layouts. The initial run passed 778 cases with 57 configured skips and two initial navigation timeouts. Both timed-out admin cases passed on rerun, bringing the total to 780 passed, including all 66 frontend readiness cases.
- The Firefox and WebKit readiness runs covered 22 cases each at 390 px. Forty-three passed initially. The Firefox workshop booking case timed out during navigation and passed on rerun, bringing the total to 44 passed.
- At 320 CSS px, 198 route variants returned HTTP 200 without document overflow, controls outside the layout or uncaught page errors. Role labels fit at five widths in each language. At 390 px, the draft notice appeared before the contents and inside the initial viewport on all four legal pages. Every contents link resolved to a section and the first link on each page worked by keyboard.
- Axe reported no automated violations on ten sampled routes. The 37 text and background pairs it flagged for manual contrast review were calculated separately and had a minimum contrast ratio of 5.05:1.
- Browser verification used desktop-hosted engines and simulated viewports. It did not include physical devices, the Safari application or a screen-reader session.

## Handoff

The GitHub review branch is `review/frontend-readiness-2026-11-25`. The repo's Vercel integration can build a preview from it while the public site stays on its existing release. Backend implementation, database migrations and hosting changes remain outside this audit. The legal pages remain drafts for owner and legal review.
