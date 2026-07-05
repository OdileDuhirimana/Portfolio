# Portfolio Site

A Next.js 16 (App Router) personal portfolio: a statically-generated marketing site with one real backend capability — a contact form that sends email through Resend, protected by shared validation, in-process rate limiting, and a real health check.

Live projects showcased by this site (NOVA Bank, EduSync, CareFlow, and others) are separate repositories with their own backends, databases, and APIs. This repository is the shell that presents them — its own scope is intentionally a static content site plus one mutation endpoint, not a multi-tenant SaaS product. That scope decision shapes several choices explained in [Tradeoffs](#tradeoffs) below.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Styling:** Tailwind CSS v4, CSS custom properties for the design token system (see `app/globals.css`)
- **Forms & validation:** `react-hook-form` + `zod`, one shared schema for client and server
- **Email delivery:** Resend HTTP API
- **Testing:** Vitest + React Testing Library + `@testing-library/user-event` (unit/integration), Playwright (E2E)
- **Error tracking:** Sentry (`@sentry/nextjs`), opt-in via `NEXT_PUBLIC_SENTRY_DSN` — no-op when unset
- **CI/CD:** GitHub Actions (lint, type-check, test, E2E, build on every PR; auto-deploy to Vercel on merge to `main`)
- **Deployment:** Vercel (primary, automated — see [CI/CD](#cicd)) or Docker (standalone Next.js output)

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser (Client)                        │
│                                                                    │
│  Static pages (/, /about, /projects, /project/[slug], ...)       │
│  — prerendered at build time from data/projects.ts               │
│                                                                    │
│  ContactForm (Client Component)                                  │
│  — validates with the SAME zod schema the server uses            │
└───────────────────────────┬────────────────────────────────────┘
                             │ POST /api/contact
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         app/api/contact/route.ts  →  createContactHandler.ts     │
│                                                                    │
│  0. CSRF check: Origin/Referer must match Host                   │
│  1. Rate limit check       (injected: lib/rate-limit.ts)         │
│  2. Re-validate payload    (lib/validation/contact.ts)           │
│  3. Honeypot check         (silently accept, log, skip send)     │
│  4. Read recipient config  (injected: lib/config/site.ts)        │
│  5. Delegate send          (injected: lib/email/sendContactEmail) │
│  6. Standard envelope      (lib/api/response.ts)                 │
│  7. Structured log per outcome (lib/logger.ts, correlation ID)   │
└───────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
                     Resend Email API
                             │
                             ▼
                  Owner's inbox (CONTACT_TO_EMAIL)

┌─────────────────────────────────────────────────────────────────┐
│                     app/api/health/route.ts                      │
│  Verifies RESEND_API_KEY / CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL │
│  are present. Used by the Docker HEALTHCHECK and can back an     │
│  external uptime monitor.                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Layering

| Layer | Location | Responsibility |
|---|---|---|
| Presentation | `app/**/page.tsx`, `components/*.tsx` | Rendering, layout, user interaction |
| Domain content | `data/projects.ts`, `data/skills.ts`, `data/resume-content.ts` | Single source of truth for portfolio content, experience, and education |
| Configuration | `lib/config/site.ts` | Single source of truth for identity/contact info, env-driven |
| Cross-cutting services | `lib/validation`, `lib/email`, `lib/rate-limit`, `lib/api`, `lib/seo`, `lib/logger`, `lib/monitoring` | Shared logic used by both client components and route handlers |
| Routes | `app/api/*/route.ts` | Thin wiring only — injects real dependencies into a handler factory |

The email-sending logic lives in `lib/email/sendContactEmail.ts`, not inline in the route handler — this is the seam that lets the route be unit-tested by mocking one function instead of global `fetch`, and is the extension point if a second provider is ever added.

### Dependency injection on `/api/contact`

`app/api/contact/route.ts` no longer calls `checkRateLimit`, `sendContactEmail`, etc. as hardcoded module imports inside its own logic. Instead, `app/api/contact/createContactHandler.ts` exports a factory — `createContactHandler(deps)` — whose only imports are *types*, not concrete implementations. `route.ts` is the single place that wires the real modules in:

```ts
export const POST = createContactHandler({
  checkRateLimit,
  sendContactEmail,
  getContactRecipientEmail,
  createLogger: createRequestLogger,
  getEmailProviderEnv: () => ({ resendApiKey: process.env.RESEND_API_KEY, fromEmail: process.env.CONTACT_FROM_EMAIL }),
});
```

This is what makes `app/api/contact/__tests__/createContactHandler.test.ts` possible: every test in that file constructs the handler from plain hand-written fake functions, with zero `vi.mock("@/lib/...")` calls. The older `__tests__/route.test.ts` (module-mock-based) still exists and still passes — both are valid, but only the DI-seam test file demonstrates real inversion of control rather than mocking-by-module-path.

## Getting Started

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local
# edit .env.local — see "Environment Variables" below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See `.env.example` for the full annotated list. Summary:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_OWNER_NAME` | Recommended | Name shown in nav, footer, hero, and page titles |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional | Public email link (Footer, About, Contact page) |
| `NEXT_PUBLIC_CONTACT_PHONE` | Optional | Public phone/WhatsApp link |
| `NEXT_PUBLIC_GITHUB_URL` / `_TWITTER_URL` / `_INSTAGRAM_URL` / `_LINKEDIN_URL` | Optional | Social links; omitted links are hidden, not broken |
| `RESEND_API_KEY` | Required for contact form | Resend API key |
| `CONTACT_FROM_EMAIL` | Required for contact form | Verified Resend sender |
| `CONTACT_TO_EMAIL` | Required for contact form | Server-only delivery inbox — never exposed to the client |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Used for canonical URLs, sitemap, Open Graph |
| `NEXT_PUBLIC_HF_USER` / `_HF_USER2` | Optional | Hugging Face usernames for live ML demo links |
| `NEXT_PUBLIC_OWNER_ROLE` / `_OWNER_LOCATION` / `_GITLAB_URL` | Optional | Resume-only fields (see [Resume generation](#resume-generation) below) — not used anywhere in the site itself |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Enables client-side error reporting in `app/error.tsx`; unset means console-only (see `lib/monitoring/errorTracking.ts`) |

No contact detail, name, or secret is ever hardcoded in source. Every identity/contact value renders conditionally — if a variable is unset, that specific link is simply omitted rather than showing a broken placeholder.

## Resume generation

`resume.md` (the file `pandoc` converts to build `public/cv.pdf` from) is **generated, not committed**. The tracked source of truth is `resume.template.md` — placeholders only, no personal contact details — plus `data/resume-content.json` for experience/education (the same data `app/about/page.tsx` renders, via `data/resume-content.ts`).

```bash
# 1. Set NEXT_PUBLIC_OWNER_NAME / _CONTACT_EMAIL / _CONTACT_PHONE / _GITHUB_URL /
#    _GITLAB_URL / _LINKEDIN_URL / _TWITTER_URL / _OWNER_ROLE / _OWNER_LOCATION
#    in .env.local
npm run resume:generate   # writes resume.md locally (gitignored)
pandoc resume.md -f markdown -t html5 --standalone -o resume.html
# ... then export resume.html to PDF and save as public/cv.pdf
```

This closes a real audit finding: a prior remediation pass fixed hardcoded contact literals in every component (`Footer`, `About`, the legal pages) but missed `resume.md`, which stayed tracked with a real name/phone/email/social handles in plain text — the exact class of drift `lib/config/site.ts`'s own doc-comment warns about, just not yet applied to this file. `resume.md` is now gitignored (see `.gitignore`) and templated the same way every other contact surface on this site already was.

**`public/cv.pdf` is intentionally different**: it's the actual downloadable resume a recruiter clicks "Download CV" to get, and a real CV is expected to contain real contact information to be useful — that's not a bug. Regenerate it from a scrubbed `resume.md` (via the steps above) whenever contact details change; never hand-edit its content.

## Scripts

```bash
npm run dev              # start dev server
npm run build             # production build
npm run start             # run the production build
npm run lint               # ESLint
npm run test               # run the unit/integration test suite once
npm run test:watch         # watch mode
npm run test:coverage      # with coverage report
npm run test:e2e           # Playwright end-to-end suite
npm run resume:generate    # regenerate resume.md from resume.template.md + env vars
```

## Testing

**Unit/integration (Vitest + React Testing Library, `npm run test`)** — 97 tests across 18 files, ~95% statement coverage on everything the suite touches (`npm run test:coverage`), including:

- `lib/validation/contact.ts` — every validation branch (min lengths, email format, whitespace trimming, missing/wrong-typed fields)
- `lib/rate-limit.ts` — window behavior, per-key isolation, reset after expiry
- `lib/config/site.ts` / `lib/seo.ts` — confirms no hardcoded fallback values ever leak in when env vars are unset
- `lib/email/sendContactEmail.ts` — success/provider-error/network-error paths, and crucially, that the HTML-escaping XSS defense this README's Security section claims is actually exercised, not just asserted
- `lib/logger.ts` / `lib/monitoring/errorTracking.ts` — structured log shape, correlation IDs, Sentry no-op-when-unset behavior
- `app/api/contact/route.ts` and `createContactHandler.ts` — CSRF rejection, malformed JSON, honeypot short-circuit (with an audit-log assertion), every validation failure, missing server config, provider success/failure/network-error, rate-limit enforcement (with an audit-log assertion), and — separately — the same behaviors re-tested against the DI seam using hand-written fakes instead of `vi.mock`
- `app/api/health/route.ts` — both the healthy and degraded envelope shapes, confirming it now matches `/api/contact`'s response contract
- `data/__tests__/resume-content.test.ts` — guardrail asserting `app/about/page.tsx` imports experience/education from the shared data module rather than re-hardcoding it (mirrors `site.test.ts`'s "no hardcoded fallback" pattern for this specific drift class)
- `components/*.tsx` — `ContactForm`, `Navbar`, `CategoryTabs`, `ProjectSearchInput`, `QRPopover`, `ProjectGrid`, `ProjectsPageClient` (pagination/sort/filter URL-state behavior)

**End-to-end (Playwright, `npm run test:e2e`)** — `e2e/contact-form.spec.ts` drives a real Chromium browser against a real running dev server: navigates to `/contact`, fills the form, submits, and asserts the success UI renders and the form resets. The outbound `/api/contact` call is intercepted at the network boundary (not a real Resend account) — this test's job is proving the real page + real client-side wiring works end-to-end, not re-verifying Resend's API.

CI (`.github/workflows/ci.yml`) runs lint, a TypeScript check, the full unit/integration suite, the Playwright E2E suite, and a production build on every push and pull request to `main`.

## CI/CD

`.github/workflows/ci.yml` has three jobs:

1. **`lint-build-test`** — lint, `tsc --noEmit`, unit/integration tests, production build. Runs on every push/PR to `main`.
2. **`e2e`** — installs Chromium and runs the Playwright suite against a locally-started dev server. Runs on every push/PR to `main`, independent of job 1.
3. **`deploy`** — deploys to Vercel production. Gated on `lint-build-test` passing (`needs: lint-build-test`) and only runs on a real push to `main` (never on pull-request events, so a fork's PR can't trigger a production deploy). Uses the Vercel CLI (`vercel pull` → `vercel build --prod` → `vercel deploy --prebuilt --prod`) rather than a third-party GitHub Action, so the exact same build Vercel would produce from a manual `vercel --prod` is what CI deploys.

**Required GitHub Actions secrets for the `deploy` job** (Settings → Secrets and variables → Actions): `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (from `vercel link` locally, or the Vercel dashboard). Without these three secrets, `lint-build-test` and `e2e` still run and gate PRs correctly — only the `deploy` job fails, which is a safe failure mode (no accidental partial deploy).

### Rollback procedure

If a deploy to production breaks the live site:

1. **Fastest: roll back via Vercel directly.** Vercel keeps every previous deployment immutable and addressable. In the Vercel dashboard → Deployments, find the last known-good deployment and click "Promote to Production" — this repoints the production domain at that build in seconds, with no rebuild and no git operations. Equivalently via CLI: `vercel rollback [deployment-url]` (or `vercel rollback` with no argument to roll back to the immediately preceding production deployment).
2. **If the bad change also needs to come out of `main`:** revert the merge commit rather than force-pushing (`git revert -m 1 <merge-commit-sha>`), then push — this re-triggers CI/CD and deploys the reverted state through the normal pipeline rather than bypassing it. Force-pushing `main` is never necessary for a rollback and risks other in-flight branches.
3. **If the break is caused by a bad environment variable** (e.g. a rotated `RESEND_API_KEY` that's now invalid) rather than bad code: fix the Vercel project's environment variable directly and trigger a redeploy of the current `main` (no code change or revert needed) — check `/api/health` first to confirm this is actually the cause (a `degraded` response with the misconfigured var listed is a strong signal).
4. **Always verify after rolling back:** hit `/api/health` on the production URL and confirm `ok: true`; manually submit the contact form once to confirm the full path still works end-to-end (the Playwright suite covers this locally, but a live post-rollback smoke check on the real Resend account is the only way to confirm the production email path specifically).

## Deployment

### Vercel (recommended, automated)

Production deploys happen automatically on merge to `main` via the `deploy` job in `.github/workflows/ci.yml` — see [CI/CD](#cicd) above for the required secrets. No manual step is needed for the common case.

For a one-off manual deploy (e.g. before CI/CD was wired up, or to test a branch against production Vercel settings), the CLI still works exactly as before:

```bash
vercel --prod
```

### Docker

```bash
docker build -t portfolio-site .
docker run --env-file .env -p 3000:3000 portfolio-site
```

The container's `HEALTHCHECK` polls `GET /api/health`, which returns `200` with `{ "ok": true, "data": { "status": "ok", "checks": {...} } }` or `{ "ok": false, "code": "DEGRADED", "details": { "checks": {...} } }` — `DEGRADED` means the contact form's email env vars are missing, not that the site is down.

### Staging / preview environments

There is no separate long-lived staging deployment for this project (a personal portfolio site doesn't have the traffic or team-coordination needs that justify maintaining a second full environment). The practical equivalent already exists via Vercel's git integration: **every pull request gets its own preview deployment** at a unique, shareable URL, built from the same `vercel build` pipeline production uses, with its own isolated environment variables (configurable per-branch in the Vercel dashboard under Settings → Environment Variables → Preview). This is the convention to follow for anything that needs review before merging to `main`: open a PR, use its preview URL to verify the change live, then merge — `main` merges are what trigger the production `deploy` job.

## Security

- **Input validation:** one zod schema (`lib/validation/contact.ts`) is imported by both the client form and the API route — the server never trusts the client's validation result and re-runs the same schema.
- **CSRF:** `/api/contact` rejects any request whose `Origin` (or `Referer`, as a fallback) doesn't match its own `Host` header, with 403 `INVALID_ORIGIN` — see `createContactHandler.ts` for why this is checked against the request's own `Host` rather than a hardcoded production URL (Vercel preview deployments get a new host per build).
- **XSS:** all user-supplied contact-form fields are HTML-escaped before being interpolated into the outbound email (`lib/email/sendContactEmail.ts`), and this is now covered by a test that injects `<script>` and asserts it comes out escaped, not just documented. No component in this codebase uses `dangerouslySetInnerHTML`.
- **Rate limiting:** `lib/rate-limit.ts` — see [Tradeoffs](#tradeoffs) for why this is in-process rather than a distributed store.
- **Audit logging (lightweight):** every contact-form outcome (delivered, rate-limited, honeypot-caught, misconfigured, provider failure) produces one structured JSON log line via `lib/logger.ts`, tagged with a correlation ID. Rate-limit/honeypot log lines include a one-way, truncated SHA-256 hash of the client IP for grouping repeat events — never the raw IP, which is personal data. This is a log line, not a persisted database row (see [Tradeoffs](#tradeoffs) on why there's no database here); it's the smallest version of "who did what when" that doesn't require one.
- **Security headers:** `next.config.ts` sets CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy on every response.
- **Secrets:** `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are read only from environment variables, are never prefixed `NEXT_PUBLIC_`, and are never logged. `.env` / `.env.local` are gitignored; only `.env.example` (placeholders only) is committed.
- **Dependency vulnerabilities:** `npm audit` currently reports advisories in `next`'s transitive `postcss` dependency, fixable only by a `next` version bump outside this project's pinned range. Deliberately not force-upgraded as part of this pass (a major/minor framework bump is a separate, higher-risk change that deserves its own review, not a side effect of a security/testing pass) — tracked here rather than silently ignored.

## API Documentation

`docs/openapi.yaml` — an OpenAPI 3.0 spec for both routes (`POST /api/contact`, `GET /api/health`), including every documented status code, error code, and example request/response body. Import it into Swagger UI, Postman, or Insomnia to explore or test the API without reading the route source.

## Tradeoffs

**In-process rate limiting instead of a distributed store.** `/api/contact` is protected by an in-memory sliding-window limiter (`lib/rate-limit.ts`), not Upstash Redis or Vercel KV. On a serverless platform with multiple concurrent instances, an attacker distributed across instances could exceed the nominal limit, and a redeploy resets counters. For this site's real traffic profile — a personal contact form, not a high-volume product — this stops the realistic threat (a single script hammering the endpoint) without adding a paid external dependency. The correct next step if traffic ever justifies it: swap the limiter's storage for a shared KV store behind the same `checkRateLimit` function signature, with no call-site changes needed.

**No database.** All portfolio content lives in typed, version-controlled TypeScript (`data/projects.ts`, `data/skills.ts`). This was a deliberate choice, not an oversight: content changes infrequently, benefits from type-checking and code review like any other code change, and a database would add operational surface (backups, migrations, an admin UI) with no corresponding benefit for a personal site with one non-technical write path (the contact form, which is delivery-only and never persisted).

**No authentication.** There are no user accounts, no owned resources, and nothing to authenticate against — every page is public by design.

**CSP allows `unsafe-inline` for scripts and styles.** Next.js's hydration bootstrap and Tailwind's runtime both rely on inline `<script>`/`<style>`, and this codebase has zero `dangerouslySetInnerHTML` usage (verified), so the residual risk is low relative to the complexity of wiring a nonce-based CSP through Next's App Router for a fully static site.

**Email template colors are literal hex values, not CSS custom properties.** `lib/email/emailTheme.ts` centralizes them into one named-constants object (closing a real "magic values" finding), but they're still literals, not `var(--gold)` references to `app/globals.css`'s frozen token set — most email clients (Gmail, Outlook, Apple Mail) strip `<style>` blocks and CSS custom properties from HTML email bodies, so every color in transactional email HTML has to be inlined regardless. `emailTheme.ts`'s values are kept in sync with the frozen palette by convention and a code comment, not by a shared import, because there is no way to share a browser CSS variable into an email client's rendering engine.

**Sentry integration is intentionally minimal, not the full `@sentry/nextjs` setup.** `lib/monitoring/errorTracking.ts` calls `Sentry.init`/`Sentry.captureException` directly from `app/error.tsx` — there's no `instrumentation.ts`, no `sentry.server.config.ts`/`sentry.edge.config.ts`, and `next.config.ts` is not wrapped with `withSentryConfig`. That fuller setup adds automatic server/edge-runtime capture and source-map upload for readable stack traces, but requires a real Sentry org/project and an auth token this environment doesn't have — and a broken build-time plugin would violate this project's "build must succeed with 0 errors" rule. Client-side error capture (the `app/error.tsx` boundary) works today when `NEXT_PUBLIC_SENTRY_DSN` is set; wiring the server-side pieces is the natural next step once a real Sentry project exists.

**Pagination on `/projects` is a client-side slice over a static array, not a real API contract — yet.** `components/ProjectsPageClient.tsx` implements `?page=&sort=` against the in-memory `data/projects.ts` array rather than fetching pages from a server. At today's ~14 projects this has no real performance benefit; it exists to demonstrate the pattern (URL-reflected state, page-size constant, prev/next bounds-checking) in a form that would carry over unchanged if `projects` ever became a fetched-from-an-API resource instead of a static import — see the code comment in `ProjectsPageClient.tsx` for the specific reasoning.

**The following rubric categories are structurally not applicable to this project's scope, not gaps:** database/ORM/migrations (no persistent datastore — see "No database" above), user authentication/authorization (no user accounts of any kind exist to protect), and REST API versioning/a large-surface API design (this site has exactly two endpoints; a `/v1/` prefix or content-negotiation scheme would be speculative infrastructure for an API surface that isn't growing). Forcing any of these in would be scope creep for a static portfolio site with one mutation endpoint, not genuine engineering improvement — see `docs/openapi.yaml` for the honest, complete documentation of the API surface that *does* exist.

## Challenges Faced

- **Validation drift between client and server.** The original implementation had the client validate with zod and the server independently re-implement the same rules with hand-rolled regex — they could (and did, subtly) diverge. Fixed by extracting one `contactSchema` both sides import.
- **Coupling the route handler directly to Resend's HTTP shape** made the contact endpoint impossible to unit-test without mocking global `fetch` inline inside a route test. Extracting `sendContactEmail()` as a narrow, mockable seam solved this and is also the extension point for adding a second provider later.
- **Personal contact details were hardcoded as literals in four separate files** (the API route's fallback, the Footer, the Contact page, the About page) — a real audit finding, not a hypothetical one. Fixed by centralizing everything through `lib/config/site.ts`, which reads exclusively from environment variables with no literal fallback, and conditionally hides any contact method whose env var is unset rather than rendering a broken link.
- **The contact-info remediation above was declared done while `resume.md` and `package.json`'s `"name"` field still carried real personal data** — a follow-up audit caught it within the same review cycle. The fix (centralizing `app/**`/`components/**`/`lib/**`) was real and well-tested, but "done" was scoped to application source, not the whole tree. `resume.md` is now generated from a placeholder template (see [Resume generation](#resume-generation)) and gitignored; `package.json`/`package-lock.json` use a generic project name. `data/__tests__/resume-content.test.ts` is the automated guardrail against the *specific* recurrence of this (hardcoded experience/education content drifting between `resume.md` and `app/about/page.tsx`) — there is intentionally no equivalent automated check for "is there PII anywhere in the tree," since that class of check is inherently a manual/audit-tool concern, not something a unit test can exhaustively cover.
- **`app/about/page.tsx`'s "Experience" section had already drifted from `resume.md`'s version** (different job title, missing a role, mismatched dates) within the same change that claimed to fix the contact-info duplication — the identical failure mode recurring in adjacent content that nobody had extracted a shared source for yet. Fixed by moving both into `data/resume-content.json` (consumed by `app/about/page.tsx` via a typed wrapper, and by `scripts/generate-resume.mjs` directly, since a plain Node script can't import `.ts`).

## Lessons Learned

- A "single source of truth" rule is only real if it's structurally enforced — having the rule documented in a project's own conventions didn't stop contact details, SEO metadata, and (separately, later) resume/experience content from being duplicated across files. Centralizing behind one config/data module (and covering it with a test that asserts "no hardcoded fallback/duplicate") makes the rule harder to silently violate again — but each content type needs its own guardrail test; fixing one duplication bug doesn't automatically catch the next one in different files.
- Extracting a thin service (`sendContactEmail`) before adding tests made the route's tests roughly a third the size they would have been mocking `fetch` directly, and made the test intent (validation vs. delivery vs. rate-limiting) much clearer.
- **A remediation pass that fixes what a rubric checks for isn't the same as fixing the underlying problem.** Scrubbing PII from every `.tsx`/`.ts` file the previous audit named, while leaving `resume.md` and `package.json` untouched, produced a codebase that looked clean to a grep scoped to "source code" but wasn't clean by the actual "never include PII" rule. The practical takeaway: a PII sweep needs to be `git grep`-scoped to the whole tracked tree, not to the directories a prior finding happened to mention.
- Introducing a dependency-injection seam (`createContactHandler.ts`) after the route already had good `vi.mock`-based test coverage was a genuinely different kind of test to write, not a strictly better one — the DI-seam tests are clearer about *what's* being substituted (a fake function, not a module path), but the mock-based tests remain equally valid for testing "does the real wired-up route work." Both are kept rather than treating the newer pattern as a wholesale replacement.

## Future Improvements

- Swap the in-process rate limiter for a shared store (Upstash Redis / Vercel KV) if the site ever needs airtight multi-instance limiting — see [Tradeoffs](#tradeoffs). Not implemented in this pass: it would require provisioning a real external KV service and a new dependency, neither of which was pre-approved.
- Wire the remaining `@sentry/nextjs` pieces (`instrumentation.ts`, server/edge configs, `withSentryConfig`) once a real Sentry org/project exists, for server-side capture and source-mapped stack traces — see [Tradeoffs](#tradeoffs).
- Add screenshots for the remaining backend-only projects if they ever grow a visual admin/demo UI — see the note on `data/projects.ts`'s `images` field below.
- Expand the Playwright suite beyond the one happy-path contact-form test (e.g. validation-error states, mobile nav, the `/projects` filter/sort/pagination flow) as the highest-value user journeys grow beyond just "send a message."

### Project screenshots

`data/projects.ts`'s `images` field is now populated for the four projects with a real, publicly-reachable visual frontend: Vitals CareOps, CampusConnect, SafeShop, and SkillBridge (captured live via Playwright at this repo's exact `CaseStudyLayout.tsx` aspect ratio, 1280×720). The remaining projects (NOVA Bank, EduSync, CareFlow, Gatherly, Trackella, FitSync, CareConnect, SentiAna, FraudGuard, PredictWise) are backend APIs or unpublished mobile apps with no deployed visual frontend to screenshot — `images` is intentionally left unset for these rather than screenshotting a Swagger UI page as a stand-in. Two of the four captured screenshots (CampusConnect, SafeShop) show a live "failed to load" / "0 items" state from their own free-tier backends being unresponsive at capture time — that's the real current state of those specific deployments, not a capture error; consider re-running the capture (or waking up the backend first) before relying on them for a hiring-manager-facing review.
