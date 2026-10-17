-- Bits of Bytes: lesson content and past paper questions are kept in the database, and each
-- person is sent only what they may use. Without full access (staff, a licensed class or a
-- student subscription) that is the first lesson of each section, and the past paper questions
-- for those lessons. Nothing here can be read directly: the only way in is course_content().
-- The content is uploaded with scripts/upload-content.mjs.

-- one row of site-wide settings. payments = false sends everything to everyone (no paywall).
create table public.site_settings (
  id               boolean primary key default true check (id),
  payments         boolean not null default false,
  content_version  text not null default '',
  updated_at       timestamptz not null default now()
);
insert into public.site_settings default values;

create table public.lesson_theory (
  id          text primary key,              -- lesson id, e.g. 1-1-binary
  ord         integer not null,
  free        boolean not null default false,
  html        text not null,
  updated_at  timestamptz not null default now()
);

create table public.exam_papers (
  id    text primary key,                    -- e.g. 23m12
  ord   integer not null,
  data  jsonb not null
);

create table public.exam_questions (
  id    text primary key,                    -- e.g. 23m12-1a
  ord   integer not null,
  free  boolean not null default false,      -- belongs to at least one free lesson
  data  jsonb not null
);

-- row level security on, with no policies: browsers can't read these tables directly
alter table public.site_settings enable row level security;
alter table public.lesson_theory enable row level security;
alter table public.exam_papers enable row level security;
alter table public.exam_questions enable row level security;
revoke all on public.site_settings, public.lesson_theory, public.exam_papers, public.exam_questions from anon, authenticated;

create function public.payments_on() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select payments from site_settings), false)
$$;

-- the same rules as my_access(): staff, a class whose teacher has licences, or a live student subscription
create function public.has_full_access() returns boolean
language sql stable security definer set search_path = public as $$
  select not public.payments_on()
      or exists (select 1 from profiles where id = auth.uid() and role in ('teacher', 'admin'))
      or exists (select 1 from class_members m join classes k on k.id = m.class_id
                  where m.student_id = auth.uid() and public._licence_total(k.teacher_id) > 0)
      or exists (select 1 from subscriptions
                  where user_id = auth.uid() and plan = 'student' and public._sub_live(status))
$$;

-- everything the site needs to run, for this person. "have" is the version the browser already
-- holds; when it still matches, only the small header comes back and the browser uses its copy.
create function public.course_content(have text default null) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  ok boolean := public.has_full_access();
  pay boolean := public.payments_on();
  ver text := md5((select content_version from site_settings) || ':' || ok::text);
begin
  if have = ver then
    return jsonb_build_object('payments', pay, 'full', ok, 'ver', ver, 'same', true);
  end if;
  return jsonb_build_object(
    'payments', pay, 'full', ok, 'ver', ver,
    'theory', coalesce((select jsonb_object_agg(id, html) from lesson_theory where free or ok), '{}'::jsonb),
    'locked', (select count(*) from lesson_theory where not (free or ok)),
    'exams', coalesce((select jsonb_agg(data order by ord) from exam_papers), '[]'::jsonb),
    'q', coalesce((select jsonb_agg(data order by ord) from exam_questions where free or ok), '[]'::jsonb));
end $$;

revoke execute on function public.payments_on(), public.has_full_access(), public.course_content(text) from public;
grant execute on function public.course_content(text) to anon, authenticated;
grant execute on function public.has_full_access() to authenticated;
