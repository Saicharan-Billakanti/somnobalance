# SomnoBalance backend handoff

## Follow-up review, 23 October 2026

The current user request resumes the original newsletter scope. The backend already has `POST /api/newsletter` using Brevo's DOI endpoint, and the legacy regeneration-check evaluation API subscribes only when `newsletterConsent: true`; both paths record server-side UTC request time and source in D1. The current quiz UI does not call that API, so the frontend release must be checked in the actual GitHub repository before claiming the quiz is wired end to end.

Proposed Resend and Brevo processor disclosures have now been added to the German and English privacy and cookie page source. Legal approval, provider account details, signed DPAs/AV-Verträge, sender and tracking settings, retention policy and live unsubscribe verification remain pending. Do not deploy the policy copy until legal confirms it.

Validation in this workspace: 38 tests pass; vinext build passes; changed-file ESLint passes; typecheck passes after running `node node_modules/next/dist/bin/next typegen` after the vinext build. Repository-wide lint still reports existing unrelated violations. The deployed Worker returned HTTP 200 for the home page, `/de/shop`, `/de/concept`, `/de/for-business` and the legal pages. These checks do not verify provider email delivery or confirmation flows.

No `.git` directory or Vercel/GitHub account session is available in this workspace. `vercel.json` is absent. The external Vercel project and GitHub App connection therefore remain unverified and cannot be removed from this checkout.

Updated 23 October 2026. A fresh Worker and D1 database were created in the authenticated Cloudflare account and the project was deployed. The current quiz UI is frontend-only and collects no email or newsletter consent, while its evaluation API supports explicit `newsletterConsent` through Brevo DOI. No real email submission, contact creation, custom DNS change, repository push or external account deletion was performed.

## Audit and scope

The supplied workspace had no `.git` directory, installed dependencies, test suite, environment example or CI workflows. Git status/remote-main comparison was therefore unavailable; existing first-party files were edited in place without resetting or merging. The Next.js 16.3.4 packaged route-handler and environment guides were read once dependency extraction made them available; official route documentation was consulted while installation was incomplete.

| Requirement | Existing implementation | Change / outstanding work | Files |
|---|---|---|---|
| Contact and public B2B enquiry | Zod validation, optional D1 storage, Resend HTTP helper that swallowed failures | Require storage/abuse controls, explicit mail outcomes, distinct subjects, Reply-To and escaping | `src/app/api/contact/route.ts`, `src/lib/mailer.ts` |
| Public partner application | Supabase Affiliate persistence; only presence checks; email omitted the message | Validate bounded strings/email, preserve storage, include relevant fields, exclude banking data from email | `src/app/api/partner/register/route.ts`, `src/lib/submission.ts` |
| Footer newsletter | `/api/contact` manual request; no mailing list | Brevo DOI endpoint, explicit consent, pending/error/loading feedback | `src/app/api/newsletter/route.ts`, `src/components/FooterNewsletterForm.tsx`, `src/lib/newsletter.ts` |
| Quiz | Current UI computes locally; legacy API accepts newsletter consent, falsely claimed subscription and sent results to admin | Fix legacy API; separately requested results go to participant; optional provider failures never discard evaluation | `src/app/api/regeneration-check/evaluate/route.ts` |
| Runtime | vinext/Vite Cloudflare RSC + SSR environments; D1 binding; Supabase/Stripe/Auth still read process.env | New provider config reads Worker `env` at request time | `src/lib/serverConfig.ts`, `wrangler.jsonc`, `vite.config.ts` |
| Consent durability | No newsletter records | D1 request evidence with UTC timestamp, server-selected source and version; no confirmation timestamp | `migrations/0003_newsletter_and_submission_limits.sql` |
| Abuse protection | Client-only business honeypot; Turnstile helper used by auth, not these forms | Server honeypot, stream size cap, origin check, durable HMAC-keyed IP/address limits and DOI cooldown | `src/lib/submission.ts`, public business form |
| Privacy | Generic policy statements; no named Resend/Brevo disclosures | Separate German/English legal-review draft, no claim of approved wording | `docs/privacy-provider-review.md` |
| Deployment | predeploy builds, deploy invokes vinext-cloudflare; domain claims only in README | Correct documentation; live URL/account configuration remain unverified | `package.json`, README |
| Vercel | `vercel.json` disabled Git deploys only; no runtime dependency found | Deleted obsolete file; external Vercel project and repository integration unchanged | deleted `vercel.json` |

The public B2B form carries company, interest, phone and message within the validated message field. The separate authenticated B2B application/catalog/chat flows retain their existing Supabase behavior. Existing order/payment/auth flows were surveyed and are not broadly rewritten by this mail/newsletter task.

Other pre-existing issues identified: mixed D1/Supabase records; Stripe webhook comments explicitly state affiliate commissions are not wired back into D1; the OTP service has a fallback signing secret; order-return handling needs a separate authorization review; cookie policy promises a permanent settings control that is not implemented in the consent component. These are not evidence of a complete audit or security certification of the whole application.

## What changed

- `mailer.ts`: Worker-compatible Resend HTTP, 10-second timeout, safe status-only logs, escaped HTML text, validated Reply-To, explicit provider acceptance/failure. OTP no longer logs codes or succeeds in demo mode. Existing non-enquiry callers retain their existing business behavior and may ignore the returned mail result; this work does not certify their delivery.
- Contact and partner routes: validation, abuse checks and truthful mail outcomes. Persistence happens before sending. A 502 with `persisted: true` means the enquiry/application was stored but mail acceptance failed. Inspect the stored record before resubmitting to avoid duplicate applications; there is no automatic mail retry/outbox.
- Newsletter service: only `POST /v3/contacts/doubleOptinConfirmation`; never ordinary contact-create or forced resubscription. Only email/list/template/redirect/tracking preference are sent, with no quiz answers, scores, health information, IP or source in the provider payload.
- Newsletter endpoint: `email` and literal `consent: true` required; source fixed server-side to `footer`. Unknown fields, including a claimed timestamp/source, are ignored. 202 has `newsletter.status: pending_confirmation`; 400/403/413/415/429/503 report validation, protection or service problems.
- Evaluation API: complete integer answers required. Literal newsletter consent starts the same DOI service with source `regeneration-check`. Response includes `newsletter.status` and `resultEmail` (`not_requested`, `accepted`, `failed`); evaluation remains usable on optional-service failure. Current quiz UI has no signup field and does not call this API, so no new quiz UI has been introduced.
- `tests/`: Node 24 test runner, TypeScript loader, test-only Worker bindings, in-memory SQLite/D1 adapter; external HTTP is mocked and unexpected destinations fail. No additional runtime/test dependencies were added.
- `.env.example`, `.gitignore`, package scripts and this documentation: reproducible setup and verification. Vercel-named transitive packages used internally by Next.js are retained; removing them would break the framework.

## Configuration

| Name | Kind | Requirement |
|---|---|---|
| `RESEND_API_KEY` | Worker secret | Sending key scoped to approved verified domain |
| `MAIL_FROM` | Worker secret | Verified sender, e.g. `SomnoBalance <no-reply@somnobalance.com>` |
| `MAIL_TO` | Worker secret | Client-approved recipient; `hello@somnobalance.com` is expected but NOT confirmed |
| `BREVO_API_KEY` | Worker secret | Approved Brevo account API key |
| `ABUSE_HMAC_KEY` | Worker secret | Random value at least 32 characters; no shared example secret |
| `BREVO_LIST_ID` | Server configuration | Positive integer list ID |
| `BREVO_DOI_TEMPLATE_ID` | Server configuration | Positive integer active DOI template ID |
| `BREVO_DOI_REDIRECT_URL` | Server configuration | Approved public HTTPS destination after confirmation |
| `DB` | D1 binding | Existing `somnobalance-db`; apply migration 0003 before rollout |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Existing server configuration/secrets | Still required for partner application persistence |

Never use `NEXT_PUBLIC_` for private values. Do not paste keys into chat or commit them. New code reads `cloudflare:workers` bindings directly. Existing services use `process.env`; the existing `nodejs_compat` flag and compatibility date after 2025-04-01 enable population from Worker variables/secrets, as documented by [Cloudflare](https://developers.cloudflare.com/workers/runtime-apis/nodejs/process/). Confirm actual deployed bindings; `.env` alone is not proof that Worker secrets exist.

For local Worker development, copy `.env.example` to ignored `.dev.vars`, fill securely, and use non-production accounts/recipients only after approval for real sends. Empty values fail closed. To exercise UI without sending, leave keys empty; use `npm test` for successful mocked flows. Use Node 24 for the built-in SQLite test adapter.

## Consent and limits

`NewsletterConsentRequest` in D1 stores email, validated server source, server UTC `submittedAt`, `consentVersion` and request outcome. Statuses are `requested`, `provider_accepted`, `provider_rejected`, `provider_unknown` and `duplicate`. None means subscribed. If the Worker stops after the request is recorded, `requested` can remain uncertain; reconcile with provider evidence. Brevo confirmation/list records must be verified and retained under the approved account policy. No webhook or redirect is treated as proof of confirmation, and no local `confirmedAt` is invented.

The footer version `2026-10-22-v1` corresponds to the existing text: “Mit der Anmeldung stimmen Sie dem Erhalt von E-Mails von SomnoBalance zu. Sie können sich jederzeit wieder abmelden.” English: “By subscribing you agree to receive emails from SomnoBalance. You can unsubscribe at any time.” The same version identifies the legacy API's explicit opt-in contract; quiz newsletter controls are excluded by project owner. Increment the version when that wording/contract changes.

Abuse counters live in `SubmissionLimit`, using HMAC hashes rather than raw IP/email values. Limits: 10 submissions per IP per 10 minutes, 5 per email per hour, DOI at most once per 15 minutes and 3 times per 24 hours across both sources. Counters are atomic across Worker instances and expire from their first request, not by isolate memory. Expired rows are removed on subsequent submissions; no background cleanup job is installed. Configure an edge WAF/rate-limit rule if distributed abuse exceeds these application controls. Origin checks reduce browser cross-site posts but are not authentication. Local requests without the Cloudflare IP header share a fallback bucket.

Duplicates receive the same neutral pending response, not subscription status. A suppressed repeat does not guarantee a fresh email was sent. Provider failures/timeouts are not automatically retried, to avoid multiplying confirmation emails. D1 evidence must be available before a DOI request is sent. Request evidence has no automatic retention deletion until the client/legal owner selects a policy; restrict database access accordingly.

## Provider account setup and live checklist

Resend:

1. In the authorized account, add/inspect `somnobalance.com` (or the approved sending subdomain) and confirm **verified** status. Account access was unavailable, so verification has not been checked.
2. Use exactly the DNS records generated by Resend. Preserve existing MX/email configuration; do not replace existing SPF blindly or publish conflicting SPF records at the same name. No SPF/DKIM values are invented here. See [domain verification](https://resend.com/docs/dashboard/domains/introduction).
3. Confirm `MAIL_FROM`, the client-approved `MAIL_TO`, a test submitter address, account region and tracking settings. Securely configure the key and sender values.
4. After explicit approval, submit each of contact, public business and partner forms; inspect Resend acceptance/event logs, actual recipient inbox/spam folder and Reply-To. Provider acceptance alone does not verify inbox delivery.

Brevo:

1. Use the approved account; complete account/sender/domain verification using provider-supplied records, preserving existing email DNS.
2. Create/select the marketing list and an active DOI template. Follow the [DOI API reference](https://developers.brevo.com/reference/create-doi-contact), rather than substituting an ordinary transactional template. The [template details API](https://developers.brevo.com/reference/get-smtp-template) exposes `isActive` and `doiTemplate` for account validation. Ensure the correct confirmation link works; a plain link to the redirect page is not double opt-in.
3. Configure list ID, template ID and approved HTTPS destination. No redirect page in this repository claims subscription based solely on a visit.
4. Configure unsubscribe handling in every newsletter campaign template and suppression behavior. Confirm optional tracking is disabled/appropriately consented; see legal-review draft.
5. After approval with a designated test address, verify request evidence, confirmation email, no marketing-list addition before confirmation, list addition after the real link, redirect, repeated requests, existing subscribed contact and unsubscribed contact behavior. Do not use live sends in ordinary automated tests.

Both providers require review of the applicable DPA/AV-Vertrag, account terms and transfer/retention details. Nothing here certifies that agreements have been signed or German-law requirements are satisfied. See [legal review draft](privacy-provider-review.md).

## Local validation and deployment commands

```powershell
npm ci
npm test
npm run typecheck
npm run lint
npm run build:vinext
# Optional compatibility check for the separate Next.js build:
npm run build

# Local D1 only; never change this to --remote without deployment approval:
npx wrangler d1 migrations apply somnobalance-db --local --config wrangler.jsonc
npm run dev:vinext
# Or preview a completed build:
npm run start:vinext
# In another terminal, with the built Worker running on port 8787:
node scripts/smoke-local.mjs
```

Check `/` (locale redirect), `/de/shop`, `/de/concept#methode` (HTTP requests omit the fragment; verify the element `id="methode"`) and `/de/for-business`. Also check contact, partner and footer messages. The new services need the migration even for local successful submissions.

Before production: review test results, the actual target account/Worker/domain and approved test recipient. The configured Worker is `somnobalance`, D1 is `somnobalance-db`. No actual deployment URL has been verified; obtain it from Cloudflare's Worker Domains & Routes or verified deployment output. Do not assume README domain claims prove routing.

After approval only, securely set secrets using interactive prompts:

```powershell
npx wrangler secret put RESEND_API_KEY --config wrangler.jsonc
npx wrangler secret put MAIL_FROM --config wrangler.jsonc
npx wrangler secret put MAIL_TO --config wrangler.jsonc
npx wrangler secret put BREVO_API_KEY --config wrangler.jsonc
npx wrangler secret put ABUSE_HMAC_KEY --config wrangler.jsonc
```

Set the three non-secret `BREVO_*` parameters under Wrangler `vars` using approved values, or configure them as server-side secrets via `wrangler secret put` as well; using secrets avoids committing account identifiers/URLs. Do not leave conflicting Dashboard-only values that a deploy could overwrite. Preserve existing Supabase, auth and payment secrets.

```powershell
# After approval, target/account confirmation and database backup:
npx wrangler d1 migrations apply somnobalance-db --remote --config wrangler.jsonc
npm run deploy:vinext
```

`npm run deploy:vinext` automatically invokes `predeploy:vinext` (`vinext build`) and then `vinext-cloudflare deploy --config dist/server/wrangler.json`. The deploy command also runs Vite `buildApp()` internally unless `--skip-build` is supplied, so the existing script builds twice. On 23 October 2026 it completed successfully and deployed version `41456380-ac74-4482-810e-a6cae10a6cfb` to https://somnobalance.mounipullepu42.workers.dev; subsequent secret updates produced active version `e848227a-2dd4-459e-b701-30d989b376a8`. Wrangler confirmed bindings for D1, assets and version metadata. Node fetch smoke checks returned HTTP 200 for `/de` and `/api/health`. Health reports Supabase, Supabase OTP and Stripe as unconfigured. Use fresh generated config after any binding changes. No interactive browser checks were performed.

## External Vercel removal

Deleting `vercel.json` only removes repository configuration. It does **not** stop a connected Vercel project from receiving Git events or deployment-failure emails. After separate approval, identify only the SomnoBalance Vercel project, disconnect its Git repository/build triggers (and any project-specific deploy hooks), or delete that specific project if requested. In GitHub organization/user Installed GitHub Apps → Vercel → Configure, remove access to **this repository only** if no other required project uses it. Do not uninstall the organization-wide app or affect other repositories. Verify project activity and notification settings afterward; no claim is made that the emails have stopped.

## Validation results and status

| Check | Actual result |
|---|---|
| Mocked backend tests | `npm test`: 31 passed, 0 failed; enquiries, partner persistence, provider/config failures, DOI duplicates/caps, consent evidence, quiz isolation and abuse checks |
| TypeScript | `npm run typecheck` passed |
| Changed-file lint | Passed for all changed TypeScript/TSX, tests and local smoke script |
| Repository lint | Failed: 126 errors, 23 warnings in untouched existing files (including explicit `any`, hook/state rules and unused values). No changed-file violations. Full local output: `.verification/lint.txt` |
| Cloudflare production build | Final `npm run build:vinext` passed; includes `/api/newsletter`. Initial run had a nonfatal sandbox denial writing Wrangler's external log; final run completed with the required local access. Provider secret names and API URLs were absent from generated browser JavaScript |
| Separate Next.js build | `npm run build` failed collecting `/api/admin/products`: Node cannot load existing `cloudflare:workers` imported by `src/lib/db.ts`. This existing runtime dependency requires the configured vinext/Cloudflare path; no Node compatibility rewrite was attempted |
| Local D1 migrations | 0001, 0002 and 0003 applied successfully to the local emulator; no remote DB touched |
| Built Worker HTTP checks | Final rebuilt Worker: `/` → 307; `/de`, `/de/shop`, `/de/concept` (anchor present), `/de/for-business`, `/de/contact`, `/de/partner` → 200; three invalid form APIs → 400; no-email quiz evaluation → 200 on `http://127.0.0.1:8787`. The public business page falls back to its guest view and logs missing existing Supabase auth configuration in this unconfigured local environment. Preview stopped after verification |
| Browser interaction / provider delivery | No visual browser automation or live provider acceptance, inbox receipt, DOI confirmation or unsubscribe test performed |

The test suite runs actual application routes/services with mocked HTTP and a SQLite adapter, not inside workerd. The separate local preview checks verify routing/rendering and invalid/no-email API behavior inside the built Worker. Neither proves live mail delivery.

| Area | Implemented | Tested locally | Verified live | Remaining blocker |
|---|---|---|---|---|
| Resend | Yes, three public enquiry flows | Mocked success/failure and validation | No | Approved recipient/sender, verified domain, secrets, approved live tests |
| Brevo | DOI service, footer API and durable request evidence; quiz integration excluded | Mocked API, duplicates, limits, failures, evidence | No | Account/list/active DOI template/HTTPS destination, unsubscribe/tracking settings, live confirmation |
| Cloudflare publishing | Build/config/migration prepared | Build, local D1 and HTTP smoke | No | Confirm target URL/account, secrets, production migration and deployment approval |
| Vercel removal | Obsolete repository file removed | No Cloudflare dependency found | No external changes | Separate project disconnection/repository app-access approval and verification |
| Legal review | German/English wording and checklist drafted | Implementation mapped to draft | Not approved | Legal/client review, DPA evidence, retention and tracking decisions |

## Draft frontend-team update

“The backend now integrates enquiry notifications with Resend and footer signup with Brevo double opt-in. Validation, durable consent-request records, spam limits are implemented; the quiz remains frontend-only and is excluded from backend integration. The approved page layouts and photos are preserved. Provider setup, approved sender/recipient, legal review and Cloudflare rollout/live email verification are still pending; this is not yet a live-delivery sign-off.”


## Continuation fixes ? 23 October 2026

Registration now checks Resend results. A saved account with a failed email request returns 502, `persisted: true`, `emailDelivery: failed` and verification details; the registration screen opens its existing resend workflow. OTP resend already checks delivery results. Phone OTP's public send route previously simulated success and verification accepted any six characters with a known fallback signing key. The profile-update token consumer made the fallback relevant to profile phone verification. Simulated dispatch/verification and the fallback key are removed; configure SESSION_SECRET (or JWT_SECRET) and the existing approved Supabase phone provider. No OTPs are logged.

The account UI loads orders by the authenticated user's email and initiates returns from that list. The return endpoint now applies that same ownership model through getCurrentUser: anonymous requests receive 401, missing/non-owned orders receive 404, owners retain the existing return service. Guest return links require a separately designed authenticated token flow; no guest authorization has been invented. D1's base Order schema still lacks the return metadata used by the Supabase update service, so D1-only returns need a separate schema/service implementation before enabling that feature. This focused work is not a complete security audit.

Contact, business and partner forms now recognize persisted=true on notification failure. They show a saved notice and remove the resubmission form. Transport loss after storage is still ambiguous; the existing limits reduce abuse but are not full idempotency. Operators should check existing records before creating another application.

### Safe manual notification recovery

1. Inspect ContactMessage in D1 for contact/business enquiries; inspect Affiliate in the approved Supabase project for partner applications. Match submission time and email under authorized access.
2. Reconcile with Resend provider logs before sending anything. Stored record, provider acceptance and inbox delivery are separate states. The current enquiry records have no durable notification-status column or outbox; a stored row alone does not establish failure.
3. For rejected requests, correct configuration, then have an authorized operator send the existing submission to the approved recipient once. Record the action and provider ID in the approved operational system. For timeouts or unknown outcomes, reconcile first; do not automatically retry or ask the applicant to resubmit. Manual sends require explicit approval.
4. No new queue/retry infrastructure or remote schema change was introduced in this round. A durable notification ledger and idempotency keys remain reliability improvements if operational volume requires them.

### Migration and repository review

Migration 0003 only creates new tables/indexes with IF NOT EXISTS. It contains no DROP, DELETE, UPDATE or ALTER of existing application data. Apply 0001, 0002, 0003 in numerical order through Wrangler's migration tracker. The legacy regeneration-check source enum remains for compatibility; the current frontend sends only footer newsletter requests.

Before future remote schema changes, export a backup to a restricted directory outside Git:

```powershell
npx wrangler d1 export somnobalance-db --remote --output <restricted-backup-path.sql> --config wrangler.jsonc
npx wrangler d1 migrations list somnobalance-db --remote --config wrangler.jsonc
```

Review the export and Cloudflare D1 Time Travel recovery options before changes. Recovery must target a reviewed backup/timepoint with owner approval; never blindly import over a live database. The three existing migrations were applied to the newly created empty D1 database during deployment setup.

Original configured target was replaced during the authorized fresh deployment on 23 October 2026. Current target: account `1311c940afd07e6f02160efba460273c`, Worker `somnobalance`, DB binding `DB`, database `somnobalance-db` / `f05964bf-8ee4-4198-9157-5f191c02b0f6` (APAC). The new D1 database is empty apart from migrations 0001–0003; no old database data was copied. `ABUSE_HMAC_KEY` and `SESSION_SECRET` were generated and stored as Worker secrets. Provider credentials and existing Supabase/Stripe/SMS configuration were not supplied and remain unconfigured. Domain routing remains unverified. Use Node 24 consistently for tests.

There is still no .git directory or remote. Latest frontend branch inclusion cannot be verified. Transfer only reviewed source/config/docs/test files into a clean checkout of the actual repository on a new branch; inspect git diff, reconcile concurrent frontend changes, and rerun checks. Do not copy node_modules, dist, .next, .wrangler, local secrets or .verification. Obtain the actual repository URL before that integration step. No Git initialization or push was performed.

Changed in this round: auth/register route and RegisterClient (delivery failure/resend), otpService (fail closed), orders/return route (ownership), ContactForm/BusinessLanding/PartnerLanding (persisted feedback), tests/register.mjs/current-user.mjs/backend.test.mjs (regressions), handoff/privacy draft (scope and recovery). The legacy evaluation endpoint and quiz UI were not edited.


### Actual continuation verification

- npm test: 38 passed, 0 failed. Includes registration accepted/rejected/missing/network cases, fail-closed phone OTP and anonymous/non-owner/owner return requests. Providers are mocked; return tests exercise the route with a test identity adapter.
- npm run typecheck: passed after npx next typegen repaired stale generated .next/types from the earlier failed Next build.
- Changed-file ESLint: passed for OTP service, registration/return routes, registration and three enquiry components, and tests. Repository-wide existing lint issues were not rewritten.
- npm run build:vinext: passed.
- Rebuilt local Worker smoke: root 307, /de and requested public pages 200, methode anchor present, invalid contact/partner/footer payloads 400, no-email legacy evaluation smoke 200. This legacy smoke is not current quiz integration.
- No browser interaction automation performed. Persisted feedback was verified by source inspection and API regression tests; real inbox, DOI confirmation, suppression and unsubscribe remain unverified.

Readiness: the Worker is deployed at https://somnobalance.mounipullepu42.workers.dev and the new D1 database has migrations 0001–0003. Resend/Brevo provider setup, existing Supabase/Stripe/SMS configuration, custom-domain routing, legal publication decisions and end-to-end live checks remain pending. Return functionality on D1-only storage remains a separate engineering blocker for enabling returns. External Vercel disconnection has not been verified.
