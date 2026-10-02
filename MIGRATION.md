# Supabase → Cloudflare D1 Migration Runbook

## Status: MIGRATION COMPLETED — D1 Database Active

---

## 0. What changed and what did NOT change

### Changed
| Before | After |
|---|---|
| `@supabase/supabase-js` REST client | Cloudflare D1 binding (`env.DB`) |
| `src/lib/supabase.ts` (removed) | `src/lib/db.ts` |
| `nodemailer` (SMTP) | Resend HTTP API (`src/lib/mailer.ts`) |
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | D1 binding `somnobalance-db` (`44a3b55e-a932-455e-b80d-1f440fb16168`) |
| `SMTP_HOST/PORT/USER/PASS` | `RESEND_API_KEY` |

### NOT changed
- Authentication system (bcrypt + HMAC-SHA256 session cookies) — identical
- `src/lib/auth.ts` — untouched
- `src/lib/adminAuth.ts` — untouched
- `SESSION_SECRET` — HMAC key for session cookies
- `ADMIN_PASSWORD` — unchanged
- All UI components, pages, styles, dictionaries — untouched
- Stripe integration logic — untouched
- Cart, products, i18n — untouched
- Cookie names (`sb_session`, `admin_session`) — unchanged
- Session TTLs — unchanged

---

## PHASE 1 — BACKUP (do this before anything else)

### 1.1 Export Supabase data as CSV

In the Supabase Dashboard (https://supabase.com/dashboard):

1. Go to **Table Editor**
2. For each table (`User`, `Order`, `OrderItem`, `ContactMessage`):
   - Open the table
   - Click **Export** → **Export to CSV**
   - Save as `backup_User.csv`, `backup_Order.csv`, `backup_OrderItem.csv`, `backup_ContactMessage.csv`

### 1.2 Export schema via SQL editor

In Supabase Dashboard → **SQL Editor**, run:

```sql
-- Verify row counts before export
SELECT 'User'           AS tbl, COUNT(*) AS rows FROM "User"
UNION ALL
SELECT 'Order'          AS tbl, COUNT(*) AS rows FROM "Order"
UNION ALL
SELECT 'OrderItem'      AS tbl, COUNT(*) AS rows FROM "OrderItem"
UNION ALL
SELECT 'ContactMessage' AS tbl, COUNT(*) AS rows FROM "ContactMessage";
```

Record these numbers. You will compare them against D1 after import.

### 1.3 Keep Supabase running

Do NOT delete the Supabase project. Do NOT drop any tables.
The old application continues to work as a rollback path until D1 is verified.

---

## PHASE 2 — CREATE D1 DATABASE

### 2.1 Install/update wrangler

```bash
npm install -g wrangler
wrangler --version   # should be 4.x
wrangler login       # authenticate with your Cloudflare account
```

### 2.2 Create the D1 database

```bash
npx wrangler d1 create somnobalance-db
```

This outputs something like:
```
✅ Successfully created DB 'somnobalance-db'
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "somnobalance-db",
      "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
  ]
}
```

**Copy the `database_id` and paste it into `wrangler.jsonc`** replacing `REPLACE_WITH_YOUR_D1_DATABASE_ID`.

### 2.3 Apply the schema migration

```bash
npx wrangler d1 execute somnobalance-db --file=./migrations/0001_init.sql
```

Verify the tables were created:
```bash
npx wrangler d1 execute somnobalance-db --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
```

Expected output: `ContactMessage`, `Order`, `OrderItem`, `User`

---

## PHASE 3 — DATA MIGRATION

### 3.1 Convert CSV exports to INSERT SQL

Use this Python script (run locally — requires Python 3):

```python
# convert_csv_to_sql.py
import csv, sys, json

def quote(v):
    if v == '' or v is None:
        return 'NULL'
    return "'" + str(v).replace("'", "''").replace('\\', '\\\\') + "'"

def fix_ts(v):
    """Convert '2024-01-15 10:30:00+00' → '2024-01-15T10:30:00.000Z'"""
    if not v or v == '':
        return 'NULL'
    v = v.strip()
    if 'T' in v:
        return quote(v if v.endswith('Z') else v.replace('+00:00','Z').replace('+00','Z'))
    v = v.replace(' ', 'T')
    if '+' in v:
        v = v[:v.index('+')]
    if '.' not in v:
        v += '.000'
    return quote(v + 'Z')

table = sys.argv[1]   # e.g. User
file  = sys.argv[2]   # e.g. backup_User.csv

with open(file, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

if not rows:
    print(f"-- No rows in {file}")
    sys.exit(0)

cols = list(rows[0].keys())
ts_cols = {'createdAt', 'updatedAt'}

print(f'-- {table}: {len(rows)} rows')
print(f'INSERT INTO "{table}" ({", ".join(chr(34)+c+chr(34) for c in cols)}) VALUES')
parts = []
for row in rows:
    vals = []
    for c in cols:
        v = row[c]
        if c in ts_cols:
            vals.append(fix_ts(v))
        elif v == '' or v is None:
            vals.append('NULL')
        else:
            vals.append(quote(v))
    parts.append('  (' + ', '.join(vals) + ')')
print(',\n'.join(parts) + ';')
```

Run for each table **in this order** (Order before OrderItem due to FK):

```bash
python convert_csv_to_sql.py User         backup_User.csv         > insert_User.sql
python convert_csv_to_sql.py Order        backup_Order.csv        > insert_Order.sql
python convert_csv_to_sql.py OrderItem    backup_OrderItem.csv    > insert_OrderItem.sql
python convert_csv_to_sql.py ContactMessage backup_ContactMessage.csv > insert_ContactMessage.sql
```

### 3.2 Import data into D1

```bash
npx wrangler d1 execute somnobalance-db --file=./insert_User.sql
npx wrangler d1 execute somnobalance-db --file=./insert_Order.sql
npx wrangler d1 execute somnobalance-db --file=./insert_OrderItem.sql
npx wrangler d1 execute somnobalance-db --file=./insert_ContactMessage.sql
```

### 3.3 Verify row counts

```bash
npx wrangler d1 execute somnobalance-db --command="SELECT 'User' AS tbl, COUNT(*) AS rows FROM \"User\" UNION ALL SELECT 'Order', COUNT(*) FROM \"Order\" UNION ALL SELECT 'OrderItem', COUNT(*) FROM \"OrderItem\" UNION ALL SELECT 'ContactMessage', COUNT(*) FROM \"ContactMessage\";"
```

Compare against the numbers recorded in Phase 1.2.

**Expected: every count matches exactly.**

### 3.4 Verify data integrity

```bash
# Orphaned OrderItems (must return 0 rows)
npx wrangler d1 execute somnobalance-db --command="SELECT oi.id FROM \"OrderItem\" oi LEFT JOIN \"Order\" o ON o.id = oi.orderId WHERE o.id IS NULL;"

# Duplicate emails (must return 0 rows)
npx wrangler d1 execute somnobalance-db --command="SELECT email, COUNT(*) n FROM \"User\" GROUP BY email HAVING n > 1;"

# Duplicate stripeSessionIds (must return 0 rows)
npx wrangler d1 execute somnobalance-db --command="SELECT stripeSessionId, COUNT(*) n FROM \"Order\" WHERE stripeSessionId IS NOT NULL GROUP BY stripeSessionId HAVING n > 1;"

# Bcrypt hash format check (prefix must be $2b$ or $2a$, length 60)
npx wrangler d1 execute somnobalance-db --command="SELECT id, email, LENGTH(passwordHash) AS len, SUBSTR(passwordHash,1,4) AS prefix FROM \"User\" LIMIT 10;"
```

**Do not proceed to Phase 4 if any verification fails.**

---

## PHASE 4 — SET CLOUDFLARE SECRETS

Set every secret via wrangler (never commit these to git):

```bash
# Keep the SAME value as your current SESSION_SECRET to preserve active user sessions
npx wrangler secret put SESSION_SECRET

# Keep the SAME value as your current ADMIN_PASSWORD
npx wrangler secret put ADMIN_PASSWORD

# Stripe keys (same values as current)
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET

# Resend email API key (get from https://resend.com/api-keys)
npx wrangler secret put RESEND_API_KEY
```

Set plain (non-secret) environment variables in `wrangler.jsonc` under a `[vars]` section,
or in the Cloudflare Dashboard → Workers → somnobalance → Settings → Variables:

```jsonc
"vars": {
  "MAIL_FROM": "SomnoBalance <noreply@yourdomain.com>",
  "MAIL_TO": "faw@willing1863.com",
  "NODE_ENV": "production"
}
```

**MAIL_FROM must use a domain you have verified in Resend.**
See: https://resend.com/docs/dashboard/domains/introduction

---

## PHASE 5 — RESEND EMAIL SETUP

1. Sign up at https://resend.com (free tier: 3,000 emails/month, 100/day)
2. Add and verify your sending domain (DNS records provided by Resend)
3. Create an API key: Dashboard → API Keys → Create API Key
4. Set `RESEND_API_KEY` via `npx wrangler secret put RESEND_API_KEY`
5. Set `MAIL_FROM` to a verified sender address

If you cannot verify a domain immediately, Resend allows sending from
`onboarding@resend.dev` on the free tier for testing only.

---

## PHASE 6 — BCRYPT FREE-TIER TEST (CRITICAL)

### Background

Cloudflare Workers **Free** plan: 10 ms CPU time per request.
Cloudflare Workers **Paid** plan ($5/month): 30 seconds CPU time per request.

`bcryptjs` at cost factor 12 requires approximately 200–400 ms of CPU time.
This **will exceed the free-tier limit** and cause HTTP 1102 errors on login/register.

### How to test

After deploying (Phase 7):

1. Log in to the admin panel at `https://your-worker.workers.dev/en/admin`
2. Visit: `https://your-worker.workers.dev/api/admin/bcrypt-bench`
3. Read the `recommendation` field in the JSON response

### Decision tree

```
bcrypt cost_12 fits in 10 ms?
├── YES → no action needed, free plan works
└── NO
    ├── Upgrade to Workers Paid ($5/month) → keep cost_12, no code changes
    └── Stay on Free →
        ├── Option A: Lower cost factor (security tradeoff — document explicitly)
        └── Option B: Gradual migration to Web Crypto PBKDF2
                      (new registrations use PBKDF2, existing bcrypt verified
                       on login then rehashed to PBKDF2 — see Phase 6b below)
```

### Phase 6b — Gradual PBKDF2 migration (only if Workers Paid is not viable)

This is a safe, non-destructive migration strategy:

1. Add a `hashAlgo TEXT DEFAULT 'bcrypt'` column to the `User` table
2. On login: detect `hashAlgo`, verify with the correct algorithm
3. After successful bcrypt verification: rehash with PBKDF2, update `passwordHash` and `hashAlgo`
4. New registrations: use PBKDF2 directly
5. Over time, all active users migrate automatically
6. Inactive users (never log in again) keep their bcrypt hash indefinitely — this is safe

**Do not implement Phase 6b until the benchmark confirms it is necessary.**
**Do not lower the bcrypt cost factor without documenting the security tradeoff.**

---

## PHASE 7 — BUILD AND DEPLOY

### 7.1 Install dependencies

```bash
npm install
```

### 7.2 Local development test

```bash
# Test with local D1 (wrangler creates a local SQLite file)
npx wrangler d1 execute somnobalance-db --local --file=./migrations/0001_init.sql
npm run dev:vinext
```

Visit http://localhost:3001 and test:
- Home page loads
- Shop page loads
- Login page loads
- Register a new test account
- Log in with the test account
- Log out
- Admin login
- Admin panel shows orders/messages

### 7.3 Production build and deploy

```bash
npm run build:vinext
npm run deploy:vinext
```

Or using wrangler directly:
```bash
npx wrangler deploy
```

### 7.4 Update Stripe webhook endpoint

In the Stripe Dashboard → Developers → Webhooks:
- Update the endpoint URL from your old deployment to:
  `https://somnobalance.workers.dev/api/webhooks/stripe`
  (or your custom domain)

---

## PHASE 8 — POST-DEPLOY TESTING CHECKLIST

### Authentication
- [ ] Register a new account → session cookie set, redirected to home
- [ ] Log in with existing migrated account → correct name shown in header
- [ ] Log in with wrong password → "Incorrect email or password" error
- [ ] Log out → session cookie cleared, user shown as logged out
- [ ] `/api/auth/me` returns `{ user: null }` when not logged in
- [ ] `/api/auth/me` returns user object when logged in
- [ ] Session persists across page refreshes
- [ ] Session expires after 30 days (verify cookie maxAge)

### Admin
- [ ] `/[lang]/admin/login` renders correctly
- [ ] Wrong admin password → "Incorrect password" error
- [ ] Correct admin password → redirected to admin panel
- [ ] Admin panel shows orders table
- [ ] Admin panel shows contact messages table
- [ ] Admin logout clears cookie and redirects to login

### Orders
- [ ] Checkout form submits → order created in D1
- [ ] Stripe checkout session created → redirect to Stripe
- [ ] Stripe webhook `checkout.session.completed` → order status updated to PAID
- [ ] `/api/orders/[id]` returns order with items
- [ ] Order with unknown ID returns 404

### Contact
- [ ] Contact form submits → message saved in D1
- [ ] Notification email sent via Resend
- [ ] Contact form works when Resend is not configured (logs to console, returns ok)

### Data integrity
- [ ] Migrated users can log in with their original passwords
- [ ] Migrated orders appear in admin panel
- [ ] Migrated contact messages appear in admin panel
- [ ] OrderItem counts match original Supabase counts

### Security
- [ ] `/[lang]/admin` without admin cookie → redirect to login
- [ ] `/api/admin/bcrypt-bench` without admin cookie → 401
- [ ] Stripe webhook with invalid signature → 400
- [ ] No secrets visible in page source or network responses
- [ ] No `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` in any response

---

## PHASE 9 — REMOVE SUPABASE DEPENDENCIES

Only after all Phase 8 checks pass:

### 9.1 Remove the npm package

```bash
npm uninstall @supabase/supabase-js
```

### 9.2 Remove Supabase source files

```bash
# Windows
del src\lib\supabase.ts
```

### 9.3 Remove Prisma runtime dependencies (keep CLI for schema reference only)

The following packages are only needed for Prisma CLI migrations against PostgreSQL.
They are NOT used at runtime after the D1 migration:

```bash
npm uninstall @prisma/adapter-pg pg
```

Keep `prisma` and `@prisma/client` only if you want to keep the schema.prisma as
documentation. They are not used at runtime.

### 9.4 Verify no remaining Supabase references

```bash
# Windows — search for any remaining Supabase references
findstr /r /s "supabase" src\
findstr /r /s "SUPABASE" src\
findstr /r /s "getSupabase" src\
```

All results should return nothing.

### 9.5 Remove old Supabase secrets from Cloudflare

In Cloudflare Dashboard → Workers → somnobalance → Settings → Variables:
- Delete `SUPABASE_URL`
- Delete `SUPABASE_SERVICE_ROLE_KEY`

Also remove SMTP variables if replaced by Resend:
- Delete `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

---

## PHASE 10 — ROLLBACK PROCEDURE

If anything goes wrong before Phase 9 (Supabase removal):

1. The Supabase project is still running — no data was deleted
2. Revert the changed source files from git:
   ```bash
   git checkout src/lib/currentUser.ts
   git checkout src/app/api/auth/login/route.ts
   git checkout src/app/api/auth/register/route.ts
   git checkout src/app/api/orders/route.ts
   git checkout "src/app/api/orders/[id]/route.ts"
   git checkout src/app/api/contact/route.ts
   git checkout src/app/api/webhooks/stripe/route.ts
   git checkout "src/app/[lang]/admin/page.tsx"
   git checkout src/lib/mailer.ts
   git checkout wrangler.jsonc
   ```
3. Redeploy the reverted version
4. The application will use Supabase again immediately

---

## FINAL ARCHITECTURE

### Old
```
Next.js 16 (App Router)
  └─ API Routes
       └─ @supabase/supabase-js (REST over HTTPS, service role key)
            └─ Supabase PostgreSQL
  └─ nodemailer (SMTP)
```

### New
```
Next.js 16 (App Router) → Cloudflare Workers (via vinext)
  └─ API Routes
       └─ src/lib/db.ts (D1 binding, parameterized SQL)
            └─ Cloudflare D1 (SQLite)
  └─ src/lib/mailer.ts (Resend HTTP API)
```

Authentication: unchanged (bcrypt + HMAC-SHA256 cookies)
Stripe: unchanged
UI: unchanged
i18n: unchanged

---

## ENVIRONMENT VARIABLES REFERENCE

### Required Cloudflare Worker secrets (set via `wrangler secret put`)

| Secret | Description |
|---|---|
| `SESSION_SECRET` | HMAC key for `sb_session` cookies — **keep identical to current value** |
| `ADMIN_PASSWORD` | Admin panel password |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `RESEND_API_KEY` | Resend transactional email API key |

### Required plain variables (wrangler.jsonc `vars` or Cloudflare Dashboard)

| Variable | Example value |
|---|---|
| `MAIL_FROM` | `SomnoBalance <noreply@yourdomain.com>` |
| `MAIL_TO` | `faw@willing1863.com` |
| `NODE_ENV` | `production` |

### Removed after migration

| Variable | Reason |
|---|---|
| `SUPABASE_URL` | Replaced by D1 binding |
| `SUPABASE_SERVICE_ROLE_KEY` | Replaced by D1 binding |
| `DATABASE_URL` | Prisma CLI only, not runtime |
| `DIRECT_URL` | Prisma CLI only, not runtime |
| `SMTP_HOST` | Replaced by Resend |
| `SMTP_PORT` | Replaced by Resend |
| `SMTP_USER` | Replaced by Resend |
| `SMTP_PASS` | Replaced by Resend |

---

## CLOUDFLARE RESOURCES REQUIRED

| Resource | Name | Plan |
|---|---|---|
| Workers | somnobalance | Free (subject to bcrypt test result) |
| D1 Database | somnobalance-db | Free (5 GB storage, 5M reads/day, 100K writes/day) |
| R2 Storage | Not needed | — |

---

## FREE-TIER LIMITATIONS

| Limit | Free | Paid |
|---|---|---|
| CPU time per request | 10 ms | 30 s |
| Worker requests/day | 100,000 | Unlimited (billed) |
| D1 reads/day | 5,000,000 | 25B included |
| D1 writes/day | 100,000 | 50M included |
| D1 storage | 5 GB | 5 GB included |

**The bcrypt CPU limit is the only likely blocker for the free plan.**
Run the benchmark at `/api/admin/bcrypt-bench` after first deploy to confirm.

---

## MANUAL STEPS REQUIRED FROM YOU

In order, these are the steps that require your action:

1. **Export Supabase CSVs** — Dashboard → Table Editor → Export each table
2. **Record Supabase row counts** — run the COUNT query in SQL Editor
3. **Run `npx wrangler d1 create somnobalance-db`** — copy the database_id
4. **Paste database_id into `wrangler.jsonc`**
5. **Run schema migration** — `npx wrangler d1 execute somnobalance-db --file=./migrations/0001_init.sql`
6. **Convert CSVs to SQL** — run the Python script for each table
7. **Import data** — run the four `wrangler d1 execute` import commands
8. **Verify row counts and integrity** — run all verification queries
9. **Sign up for Resend** — verify your sending domain
10. **Set all Cloudflare secrets** — `wrangler secret put` for each secret
11. **Add `vars` to wrangler.jsonc** — MAIL_FROM, MAIL_TO, NODE_ENV
12. **Deploy** — `npm run deploy:vinext`
13. **Update Stripe webhook URL** — Stripe Dashboard → Developers → Webhooks
14. **Run bcrypt benchmark** — visit `/api/admin/bcrypt-bench` after deploy
15. **Decide on Workers Free vs Paid** — based on benchmark result
16. **Run Phase 8 testing checklist** — verify all functionality
17. **Remove Supabase package and files** — only after all tests pass
18. **Delete Supabase secrets from Cloudflare Dashboard**
19. **Notify me before deleting the Supabase project** — final approval step
