# Bits of Bytes

Course site for Cambridge IGCSE Computer Science (0478): lessons, activities, flash cards and past paper questions, with student accounts and teacher classes.

- **Front end:** a Vite project, deployed on Vercel.
- **Back end:** Supabase (Postgres, Auth and row level security). Project `cvijqlbtakistuikogoz`, Singapore region.

## How it fits together

| Path | What it is |
|---|---|
| `index.html` | Page shell (header, `#app`, footer) |
| `src/main.js` | Start-up: connects to Supabase, loads the signed-in account, fetches the lesson content, then runs the site scripts in order |
| `src/store.js` | Accounts and progress. Guests keep progress in the browser. Signed-in progress is saved to the account a moment after each change. |
| `src/school.js` | Classes, licences, invitations, assignments and marks |
| `src/backend/supabase.js` | The only file that talks to Supabase |
| `src/backend/dev.js` | The same interface, talking to the local test server (`tests/devserver.py`) |
| `src/styles.css`, `src/app.css` | Styles |
| `public/app/*.js` | The site itself: syllabus and lessons, widgets and activities, exam questions, school pages, account pages, router. Plain browser scripts, run in order, that share globals. |
| `public/content/theory.html` | Every lesson's theory, as `<template id="th-…">` blocks |
| `public/content/exams.json` | Past paper questions and mark schemes |
| `supabase/migrations/*.sql` | Database schema, permission rules (row level security) and functions |
| `tests/` | Permission tests and browser tests against a local Postgres |

### Where the data lives

| Table | Holds |
|---|---|
| `profiles` | One row per account: name, email, role (student, teacher or admin), school |
| `user_progress` | One row per quick check, vocabulary test, activity or exam question attempted |
| `user_state` | Everything else a student keeps (flash cards, confidence ratings, open units), as one document |
| `classes`, `class_members`, `class_invites` | Classes, who is in them, and pending email invitations |
| `licence_grants`, `licence_requests` | Licences given to teachers, and teachers' requests for more |
| `assignments`, `assignment_submissions`, `teacher_marks`, `assignment_seen` | Assignments, students' exam answers, marks changed by teachers, and which assignments a student has seen |

The permission rules decide who can see and change each row:
- Students see only their own data.
- Teachers see their own classes and those students' progress.
- Only an admin can give licences.
- Joining a class goes through `join_class` / `accept_invite`. These check that a licence is free.

## Running it locally

```bash
npm install
cp .env.example .env.local     # points at the live Supabase project
npm run dev                    # http://localhost:5173
```

Without `.env.local` the site runs in guest-only mode, and accounts are switched off.

### Tests (no Supabase needed)

These run against a local Postgres on `/tmp:54329`, with `tests/supabase_stub.sql` standing in for Supabase's `auth` schema:

```bash
python3 tests/rls_test.py                                   # permission rules, 50 checks
python3 tests/devserver.py --db bobe2e --port 8787 --reset  # serves the site plus a local backend
python3 tests/e2e_backend.py                                # teacher, admin and students, end to end
python3 tests/activity_save.py                              # a quick check and activity reach the database
python3 tests/smoke.py                                      # every page renders as a guest
```

## Deploying

1. **Vercel:** Add New → Project → import this repository. Vercel detects Vite.
2. **Environment variables:** in the Vercel project, open Settings → Environment Variables. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the values in `.env.example`, then redeploy.
3. **Supabase → Authentication → URL Configuration:**
   - Set **Site URL** to the Vercel address (later, your own domain).
   - Under **Redirect URLs**, add `https://<your-domain>/**` and `http://localhost:5173/**`.
4. **Supabase → Authentication → Emails:** Supabase's built-in email service only sends a few emails an hour, and only to your Supabase team's own addresses. Before students sign up, do one of these:
   - Connect your own email service (Authentication → Emails → SMTP Settings; for example Resend or Postmark).
   - Or turn off **Confirm email** (Authentication → Sign In / Providers → Email) for now.
5. **Make yourself admin:** sign up on the live site, then run this in the Supabase SQL Editor:
   ```sql
   update profiles set role = 'admin' where email = 'you@example.com';
   ```
   Sign out and back in, and an **Admin** link appears. From there you approve teachers' licence requests, or give licences directly.

## Database changes

Add a new file to `supabase/migrations/`, named with a timestamp and a short description. Never edit a migration that has already been applied. Run the file in the Supabase SQL Editor (or with `supabase db push`), and add tests to `tests/rls_test.py` for any new permission rules.

## Sign in with Google

The code is in place. The button appears once `VITE_GOOGLE_SIGN_IN=on` is set, which should only happen after the provider is set up:

1. Run `supabase/migrations/20261017040000_google_sign_in.sql` in the SQL Editor.
2. **Google Cloud console:** create (or choose) a project, then open the [Google Auth Platform](https://console.cloud.google.com/auth/overview).
   - **Branding:** app name "Bits of Bytes", support email, logo (optional), and the home, privacy policy and terms page links.
   - **Audience:** set the user type to External, then publish the app (while it's "Testing", only listed test users can sign in).
   - **Data Access:** add the `openid` scope; email and profile are there already.
   - **Clients → Create client:** choose Web application.
     - Authorized JavaScript origins: your site address (e.g. `https://bitsofbytes.co`) and `http://localhost:5173`.
     - Authorized redirect URI: `https://cvijqlbtakistuikogoz.supabase.co/auth/v1/callback`.
     - Copy the Client ID and Client secret.
3. **Supabase → Authentication → Sign In / Providers → Google:** turn it on and paste the Client ID and secret.
4. **Supabase → Authentication → URL Configuration:** the Site URL and Redirect URLs must include your site (`https://<domain>/**`) and `http://localhost:5173/**`.
5. Set `VITE_GOOGLE_SIGN_IN=on` in `.env.local` and in Vercel, then redeploy.

How it behaves:
- People choose Student or Teacher (and can type a class code) before pressing Continue with Google; those choices are applied when they come back.
- Signing in with Google using the same email as an existing account signs into that account.
- School Google accounts (Google Workspace for Education) may need the school's IT admin to allow the app; for students under 18 the admin has to mark it as trusted.

## Payments with Stripe

Two ways to pay, both yearly or monthly subscriptions handled by Stripe:
- **Class licences** (teachers): a yearly subscription; the quantity is the number of licences. Teachers can still request licences and pay by invoice; you approve those on the Admin page.
- **Student subscription** (students on their own): monthly or yearly.

Without a licensed class or a subscription, only the first lesson of each section is open. Nothing is locked until `VITE_PAYMENTS=on`.

How it works: the site calls the `billing` edge function to open Stripe Checkout or the Stripe customer portal. Stripe then calls the `stripe-webhook` edge function, which copies each subscription into `public.subscriptions`. Licence totals (`_licence_total`) and access (`my_access()`) are worked out from that table, so only Stripe can grant paid access.

Set-up:
1. Run `supabase/migrations/20261017050000_payments.sql` in the SQL Editor.
2. **Stripe → Product catalogue** (start in test mode): create
   - "Class licence": recurring, yearly, per unit, in GBP;
   - "Student subscription": two recurring prices in GBP, one monthly and one yearly.
   Copy each price ID (`price_…`).
3. **Stripe → Developers → API keys:** copy the secret key (`sk_test_…` in test mode).
4. **Stripe → Developers → Webhooks → Add endpoint:** URL `https://cvijqlbtakistuikogoz.supabase.co/functions/v1/stripe-webhook`, events `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `customer.subscription.paused`, `customer.subscription.resumed`. Copy the signing secret (`whsec_…`).
5. **Stripe → Settings → Billing → Customer portal:** turn on cancelling subscriptions, updating payment methods, viewing invoices, changing quantity, and switching between the monthly and yearly student prices.
6. **Supabase → Edge Functions → Secrets:** add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_LICENCE`, `STRIPE_PRICE_STUDENT_MONTHLY`, `STRIPE_PRICE_STUDENT_YEARLY` and `SITE_URL` (your site address, e.g. `https://bitsofbytes.co`).
7. Set `VITE_PAYMENTS=on` in `.env.local` and in Vercel. Test with Stripe's card `4242 4242 4242 4242`, any future date and any CVC.
8. When it all works, repeat steps 2–4 and 6 in Stripe's live mode with the live keys and prices.

The functions are in `supabase/functions/` and are deployed with JWT checking turned off (`supabase/config.toml`): `billing` checks the signed-in user itself, and the webhook checks Stripe's signature.
