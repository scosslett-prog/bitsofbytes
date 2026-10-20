# Bits of Bytes

Course site for Cambridge IGCSE Computer Science (0478): lessons, activities, flash cards and past paper questions, with student accounts and teacher classes.

- **Front end:** a Vite project, deployed on Vercel.
- **Back end:** Supabase (Postgres, Auth and row level security). Project `cvijqlbtakistuikogoz`, Singapore region.

## How it fits together

| Path | What it is |
|---|---|
| `index.html` | Page shell (header, `#app`, footer) |
| `src/main.js` | Start-up: connects to Supabase, loads the signed-in account, fetches the lesson content this person may use, then runs the site scripts in order |
| `src/content.js` | Fetches lessons and past paper questions from the database (`course_content`), keeping a copy in the browser until the content changes |
| `src/store.js` | Accounts and progress. Guests keep progress in the browser. Signed-in progress is saved to the account a moment after each change. |
| `src/school.js` | Classes, licences, invitations, assignments and marks |
| `src/backend/supabase.js` | The only file that talks to Supabase |
| `src/backend/dev.js` | The same interface, talking to the local test server (`tests/devserver.py`) |
| `src/styles.css`, `src/app.css` | Styles |
| `public/app/*.js` | The site itself: syllabus and lessons, widgets and activities, exam questions, school pages, account pages, router. Plain browser scripts, run in order, that share globals. |
| `content/theory.html` | Every lesson's theory, as `<template id="th-…">` blocks. Not published with the site: it's uploaded to the database |
| `content/exams.json` | Past paper questions and mark schemes. Also uploaded, not published |
| `scripts/upload-content.mjs` | Uploads those two files to the database (`npm run upload-content`) |
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
| `lesson_theory`, `exam_papers`, `exam_questions` | The course content. Nobody can read these tables directly; `course_content()` sends each person what they may use |
| `site_settings` | One row: `payments` (the paywall switch) and the content version |

The permission rules decide who can see and change each row:
- Students see only their own data.
- Teachers see their own classes and those students' progress.
- Only an admin can give licences.
- Joining a class goes through `join_class` / `accept_invite`. These check that a licence is free.

## Running it locally

```bash
npm install
npm run dev                    # http://localhost:5173
```

The site connects to the live Supabase project by default; nothing needs setting up. (`.env.local` can point it somewhere else; see `.env.example`.) If the local test server below is running, it uses that instead.

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

1. **Vercel or Netlify:** import this repository as a new project. Both detect the settings (`vercel.json`, `netlify.toml`): build command `npm run build`, output folder `dist`.
2. **Environment variables:** none needed; the site has the live project's public address built in.
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

## Changing lesson content

Edit `content/theory.html` or `content/exams.json`, then upload them from the **Admin** page: **Course content and paywall → Upload again**. Running `npm run dev`, it reads the two files from this folder. On the live site it asks you to choose them. Browsers fetch the new content on their next visit.

The same panel turns the paywall on and off.

(`npm run upload-content` does the same from the command line. It needs the project's secret key in `.env.local` as `SUPABASE_SECRET_KEY=sb_secret_…`; never add that key to Vercel or Netlify, or commit it.)

## Database changes

Add a new file to `supabase/migrations/`, named with a timestamp and a short description. Never edit a migration that has already been applied. Run the file in the Supabase SQL Editor (or with `supabase db push`), and add tests to `tests/rls_test.py` for any new permission rules.

## Emails: confirming addresses and resetting passwords

Supabase sends the emails; Resend delivers them (Supabase's built-in sender only reaches your own team's addresses, a few an hour).

1. **Resend** (resend.com): add and verify a domain you own (Domains → Add domain, then add the DNS records it shows), and create an API key (API Keys → Create, permission "Sending access").
2. **Supabase → Authentication → Emails → SMTP Settings:** turn on **Enable custom SMTP**. Host `smtp.resend.com`, port `465`, username `resend`, password = the Resend API key, sender email e.g. `noreply@<your domain>`, sender name `Bits of Bytes`.
3. **Supabase → Authentication → Emails → Templates:** paste the templates from `supabase/templates/` (each file's first line is its subject):
   - Confirm signup → `confirm-signup.html`
   - Reset password → `reset-password.html`
   - Change email address → `change-email.html`
   Their links carry `?token_hash=…&type=…`, which the site verifies itself (`emailLink` in `src/main.js`), so they work on any device or browser, not only the one that asked.
4. **Supabase → Authentication → Sign In / Providers → Email:** turn on **Confirm email**.
5. **Supabase → Authentication → Rate Limits:** raise **emails per hour** (e.g. 100).
6. **Supabase → Authentication → URL Configuration:** the Redirect URLs must include the site (`https://<domain>/**`) and `http://localhost:5173/**`.

## Logo

`scripts/logo.py` draws the logo (`public/logo.svg`, and the small `public/favicon.svg`). The PNG versions (`logo.png` for search results, `logo-email.png` for the email templates, `apple-touch-icon.png` and the share image `og.png`) were made from those SVGs; redo them if the logo changes.

## Search engines and analytics

**Search:** `npm run build` runs `scripts/prerender.mjs` after Vite. It gives every public page its own address (`/paper-1`, `/topic/1-1`, `/lesson/1-1-binary`, `/exam-questions`, `/flash-cards`, `/pricing`, `/dashboard-preview`) and writes a real HTML page for each, with its own title, description, social preview (`public/og.png`), structured data (Course, LearningResource, breadcrumbs) and a readable outline of the page. It also writes `sitemap.xml`, `robots.txt` and `404.html`. Paid lesson text is never included. When someone opens one of those addresses, the app shows the matching page (`pathToRoute` in `src/main.js`), and `public/app/10-seo.js` keeps the title, description and canonical address right as people move around. The site address comes from Netlify's `URL` (or `SITE_URL`). If the step fails it only prints a warning, so it can't stop a deploy.

After going live (and again after moving to your own domain): in **Google Search Console** add the site, verify it, and submit `https://<your site>/sitemap.xml`.

**Google Analytics 4:** set the measurement ID (`G-…`) as `GA_ID` in `src/main.js` (or `VITE_GA_ID` in the host's environment variables). Visitors are asked first; nothing loads until they choose **Allow**, and **Cookie settings** in the footer lets them change their mind. Page views are sent with the clean addresses above; signed-in pages are grouped without any ids.

## Sign in with Google

The code is in place. The **Continue with Google** button appears by itself once the Google provider is switched on in Supabase (step 3):

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

How it behaves:
- People choose Student or Teacher (and can type a class code) before pressing Continue with Google; those choices are applied when they come back.
- Signing in with Google using the same email as an existing account signs into that account.
- School Google accounts (Google Workspace for Education) may need the school's IT admin to allow the app; for students under 18 the admin has to mark it as trusted.

## Payments with Stripe

Two ways to pay, both yearly or monthly subscriptions handled by Stripe:
- **Class licences** (teachers): a yearly subscription; the quantity is the number of licences. Teachers can still request licences and pay by invoice; you approve those on the Admin page.
- **Student subscription** (students on their own): monthly or yearly.

Without a licensed class or a subscription, only the first lesson of each section is open, with the past paper questions for those lessons. The rest isn't hidden in the page: the database doesn't send it.

The paywall switch is on the Admin page (stored in `site_settings.payments`), so it applies to every copy of the site at once. While it's off, everything is open to everyone.

How it works: the site calls the `billing` edge function to open Stripe Checkout or the Stripe customer portal. Stripe then calls the `stripe-webhook` edge function, which copies each subscription into `public.subscriptions`. Licence totals (`_licence_total`), access (`my_access()`, `has_full_access()`) and the content each person is sent (`course_content()`) are worked out from that table, so only Stripe can grant paid access.

Set-up:
1. Run `supabase/migrations/20261017050000_payments.sql` in the SQL Editor.
2. **Stripe → Product catalogue** (start in test mode): create
   - "Class licence": recurring, yearly, per unit (any currency; the site shows whatever Stripe uses);
   - "Student subscription": two recurring prices in the same currency, one monthly and one yearly.
   Copy each price ID (`price_…`).
3. **Stripe → Developers → API keys:** copy the secret key (`sk_test_…` in test mode).
4. **Stripe → Developers → Webhooks → Add endpoint:** URL `https://cvijqlbtakistuikogoz.supabase.co/functions/v1/stripe-webhook`, events `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `customer.subscription.paused`, `customer.subscription.resumed`. Copy the signing secret (`whsec_…`).
5. **Stripe → Settings → Billing → Customer portal:** turn on cancelling subscriptions, updating payment methods, viewing invoices, changing quantity, and switching between the monthly and yearly student prices.
6. **Supabase → Edge Functions → Secrets:** add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_LICENCE`, `STRIPE_PRICE_STUDENT_MONTHLY`, `STRIPE_PRICE_STUDENT_YEARLY` and `SITE_URL` (your site address, e.g. `https://bitsofbytes.co`).
7. Turn the paywall on from the Admin page. Test with Stripe's card `4242 4242 4242 4242`, any future date and any CVC.
8. When it all works, repeat steps 2–4 and 6 in Stripe's live mode with the live keys and prices.

The functions are in `supabase/functions/` and are deployed with JWT checking turned off (`supabase/config.toml`): `billing` checks the signed-in user itself, and the webhook checks Stripe's signature.

## Puzzles and rewards

- Every lesson has a tarsia puzzle: Easy (9 pieces) or Challenge (16 pieces). The pairs are in
  `public/app/06p-tarsia-pairs.js`, one line per pair (`half | other half`), at least 18 per lesson,
  and no half may appear twice in a lesson. Some number lessons make fresh pairs every time.
  The puzzle itself is `public/app/06q-tarsia.js`.
- Each lesson also has a **pairs match** (8 pairs from the same tarsia pairs), **memory pairs** (6 pairs on
  face-down cards; only misses of a pair already seen cost points) and a **crossword**
  (answers from the lesson's key terms and any tarsia pair whose term is one to three words), in
  `public/app/06t-puzzles.js`. A few number-only lessons have too few words for a crossword and just skip it.
  Results are saved beside the tarsia ones as `<lesson id>-m`, `-g` (memory) and `-x` (no database change needed).
- Teachers choose which puzzle types a lesson assignment includes (tarsia, pairs match, memory pairs, crossword) when
  "Complete each lesson" is chosen. The choice is saved as `assignments.spec.pz`; older assignments with
  `spec.tz` mean the tarsia puzzle only.
- Points, ranks (Bit → Terabyte) and achievements are worked out in `public/app/06r-rewards.js`
  from each student's best results, so nothing is earned twice. The total is saved for the class
  leaderboard, which teachers can switch off on the class's Progress tab.
- Database: `supabase/migrations/20261019000000_puzzles_rewards.sql` (already applied to the live project).
