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
