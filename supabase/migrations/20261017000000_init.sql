-- Bits of Bytes: initial schema
-- Accounts (profiles), schools' classes and licences, student progress, assignments.
-- Every table has row level security. Anything that must check more than one table
-- (joining a class, counting licences) goes through a security definer function.

-- ---------------------------------------------------------------- profiles
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text check (email = lower(email)),
  full_name   text not null default '',
  role        text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  school      text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.profiles is 'One row per account. role decides what the account can do; admin is only ever set by hand.';

-- create the profile when someone signs up; role comes from sign-up metadata but can never be admin
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare r text := coalesce(new.raw_user_meta_data ->> 'role', 'student');
begin
  if r not in ('student', 'teacher') then r := 'student'; end if;
  insert into public.profiles (id, email, full_name, role, school)
  values (new.id, lower(new.email),
          left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 100),
          r,
          left(coalesce(new.raw_user_meta_data ->> 'school', ''), 120));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- keep the email in step with auth, and stop people changing their own role or email
create function public.protect_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- direct SQL (dashboard / service role) has no signed-in user and may change anything
  if auth.uid() is not null and not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
    new.role := old.role;
    new.email := old.email;
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger protect_profile before update on public.profiles
  for each row execute function public.protect_profile();

-- ---------------------------------------------------------------- classes
create function public.gen_join_code() returns text
language plpgsql volatile security definer set search_path = public as $$
declare
  alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';   -- no 0/O or 1/I/L
  c text;
begin
  loop
    c := '';
    for i in 1..6 loop
      c := c || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.classes where join_code = c);
  end loop;
  return c;
end $$;

create table public.classes (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references public.profiles (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 80),
  join_code   text not null unique,
  archived    boolean not null default false,
  created_at  timestamptz not null default now()
);
create index classes_teacher_idx on public.classes (teacher_id);
alter table public.classes alter column join_code set default public.gen_join_code();

-- a student belongs to at most one class at a time
create table public.class_members (
  class_id    uuid not null references public.classes (id) on delete cascade,
  student_id  uuid not null references public.profiles (id) on delete cascade,
  joined_at   timestamptz not null default now(),
  primary key (class_id, student_id),
  unique (student_id)
);

create table public.class_invites (
  id          uuid primary key default gen_random_uuid(),
  class_id    uuid not null references public.classes (id) on delete cascade,
  email       text not null check (email = lower(email)),
  invited_at  timestamptz not null default now(),
  unique (class_id, email)
);
create index class_invites_email_idx on public.class_invites (email);

-- ---------------------------------------------------------------- licences
-- grants are added by an admin (later, by the payment webhook); requests come from teachers
create table public.licence_grants (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references public.profiles (id) on delete cascade,
  quantity    integer not null check (quantity > 0),
  note        text not null default '',
  created_by  uuid references public.profiles (id),
  created_at  timestamptz not null default now()
);
create index licence_grants_teacher_idx on public.licence_grants (teacher_id);

create table public.licence_requests (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references public.profiles (id) on delete cascade,
  quantity    integer not null check (quantity between 1 and 1000),
  message     text not null default '',
  status      text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  created_at  timestamptz not null default now(),
  decided_at  timestamptz,
  decided_by  uuid references public.profiles (id)
);

-- ---------------------------------------------------------------- progress
-- one row per item: kind is the area (lessons = quick checks, scores = vocabulary tests,
-- acts = activities, ex = exam questions) and key is the lesson / activity / question id
create table public.user_progress (
  user_id     uuid not null references public.profiles (id) on delete cascade,
  kind        text not null check (kind in ('lessons', 'scores', 'acts', 'ex')),
  key         text not null check (char_length(key) <= 80),
  data        jsonb not null,
  updated_at  timestamptz not null default now(),
  primary key (user_id, kind, key)
);

-- everything else a student keeps (flash cards, confidence ratings, settings) as one document
create table public.user_state (
  user_id     uuid primary key references public.profiles (id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------- assignments
create table public.assignments (
  id            uuid primary key default gen_random_uuid(),
  class_id      uuid not null references public.classes (id) on delete cascade,
  teacher_id    uuid not null references public.profiles (id) on delete cascade,
  kind          text not null check (kind in ('lessons', 'exam')),
  title         text not null check (char_length(title) between 1 and 120),
  note          text not null default '' check (char_length(note) <= 500),
  due_date      date not null,
  mode          text check (mode in ('all', 'qc')),
  lesson_ids    text[] not null default '{}',
  question_ids  text[] not null default '{}',
  spec          jsonb,
  created_at    timestamptz not null default now(),
  check ((kind = 'lessons' and cardinality(lesson_ids) > 0) or (kind = 'exam' and cardinality(question_ids) > 0))
);
create index assignments_class_idx on public.assignments (class_id);

create table public.assignment_submissions (
  assignment_id  uuid not null references public.assignments (id) on delete cascade,
  student_id     uuid not null references public.profiles (id) on delete cascade,
  answers        jsonb not null default '{}'::jsonb,
  done           boolean not null default false,
  submitted_at   timestamptz,
  updated_at     timestamptz not null default now(),
  primary key (assignment_id, student_id)
);

-- a teacher's own marks on exam assignments; the student's answers are never changed
create table public.teacher_marks (
  assignment_id  uuid not null references public.assignments (id) on delete cascade,
  student_id     uuid not null references public.profiles (id) on delete cascade,
  question_id    text not null,
  mark           integer not null check (mark >= 0),
  updated_at     timestamptz not null default now(),
  primary key (assignment_id, student_id, question_id)
);

create table public.assignment_seen (
  assignment_id  uuid not null references public.assignments (id) on delete cascade,
  student_id     uuid not null references public.profiles (id) on delete cascade,
  seen_at        timestamptz not null default now(),
  primary key (assignment_id, student_id)
);

-- ---------------------------------------------------------------- helper functions
-- security definer so policies can use them without recursing into each other's RLS
create function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin')
$$;
create function public.is_teacher() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('teacher', 'admin'))
$$;
create function public.teaches_class(c uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from classes where id = c and teacher_id = auth.uid())
$$;
create function public.teaches_student(s uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from class_members m join classes k on k.id = m.class_id
                 where m.student_id = s and k.teacher_id = auth.uid())
$$;
create function public.teaches_assignment(a uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from assignments x join classes k on k.id = x.class_id
                 where x.id = a and k.teacher_id = auth.uid())
$$;
create function public.my_class_id() returns uuid
language sql stable security definer set search_path = public as $$
  select class_id from class_members where student_id = auth.uid()
$$;
create function public.my_teacher_id() returns uuid
language sql stable security definer set search_path = public as $$
  select k.teacher_id from class_members m join classes k on k.id = m.class_id where m.student_id = auth.uid()
$$;
create function public.my_email() returns text
language sql stable security definer set search_path = public as $$
  select email from profiles where id = auth.uid()
$$;
create function public.invited_to(c uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from class_invites where class_id = c and email = public.my_email())
$$;
create function public.assignment_in_my_class(a uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from assignments where id = a and class_id = public.my_class_id())
$$;

-- licences bought and in use for a teacher (callers can only ask about themselves unless admin)
create function public.licence_counts(t uuid default auth.uid())
returns table (total integer, used integer)
language plpgsql stable security definer set search_path = public as $$
begin
  if t <> auth.uid() and not public.is_admin() then raise exception 'not allowed'; end if;
  return query select
    coalesce((select sum(quantity)::int from licence_grants where teacher_id = t), 0),
    coalesce((select count(*)::int from class_members m join classes k on k.id = m.class_id where k.teacher_id = t), 0);
end $$;

-- the shared part of joining: lock the teacher's licences, check one is free, move the student
create function public._join(c uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare t uuid; tot int; usd int; me uuid := auth.uid();
begin
  if me is null then raise exception 'Sign in first.'; end if;
  if (select role from profiles where id = me) <> 'student' then raise exception 'Only student accounts can join a class.'; end if;
  select teacher_id into t from classes where id = c and not archived;
  if t is null then raise exception 'No class has that code. Check it with your teacher.'; end if;
  if exists (select 1 from class_members where class_id = c and student_id = me) then return c; end if;
  perform pg_advisory_xact_lock(hashtext(t::text));
  select coalesce(sum(quantity), 0) into tot from licence_grants where teacher_id = t;
  select count(*) into usd from class_members m join classes k on k.id = m.class_id where k.teacher_id = t;
  if usd >= tot then raise exception 'Your teacher has no free licences left. Ask them to get more, then try again.'; end if;
  delete from class_members where student_id = me;
  insert into class_members (class_id, student_id) values (c, me);
  delete from class_invites where class_id = c and email = public.my_email();
  return c;
end $$;

create function public.join_class(code text) returns uuid
language plpgsql security definer set search_path = public as $$
declare c uuid;
begin
  select id into c from classes where join_code = upper(regexp_replace(code, '[^A-Za-z0-9]', '', 'g')) and not archived;
  if c is null then raise exception 'No class has that code. Check it with your teacher.'; end if;
  return public._join(c);
end $$;

create function public.accept_invite(c uuid) returns uuid
language plpgsql security definer set search_path = public as $$
begin
  if not public.invited_to(c) then raise exception 'That invitation is no longer available.'; end if;
  return public._join(c);
end $$;

create function public.new_join_code(c uuid) returns text
language plpgsql security definer set search_path = public as $$
declare code text;
begin
  if not public.teaches_class(c) then raise exception 'not allowed'; end if;
  code := public.gen_join_code();
  update classes set join_code = code where id = c;
  return code;
end $$;

create function public.decide_licence_request(r uuid, approve boolean) returns void
language plpgsql security definer set search_path = public as $$
declare q record;
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  select * into q from licence_requests where id = r and status = 'pending' for update;
  if q is null then raise exception 'That request has already been dealt with.'; end if;
  update licence_requests set status = case when approve then 'approved' else 'declined' end,
         decided_at = now(), decided_by = auth.uid() where id = r;
  if approve then
    insert into licence_grants (teacher_id, quantity, note, created_by)
    values (q.teacher_id, q.quantity, 'Approved request', auth.uid());
  end if;
end $$;

-- ---------------------------------------------------------------- row level security
alter table public.profiles               enable row level security;
alter table public.classes                enable row level security;
alter table public.class_members          enable row level security;
alter table public.class_invites          enable row level security;
alter table public.licence_grants         enable row level security;
alter table public.licence_requests       enable row level security;
alter table public.user_progress          enable row level security;
alter table public.user_state             enable row level security;
alter table public.assignments            enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.teacher_marks          enable row level security;
alter table public.assignment_seen        enable row level security;

-- profiles: yourself, your students, your teacher, or everyone if admin
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin() or public.teaches_student(id) or id = public.my_teacher_id()
         or id in (select k.teacher_id from classes k where public.invited_to(k.id)));
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

-- classes
create policy classes_select on public.classes for select to authenticated
  using (teacher_id = auth.uid() or id = public.my_class_id() or public.invited_to(id) or public.is_admin());
create policy classes_insert on public.classes for insert to authenticated
  with check (teacher_id = auth.uid() and public.is_teacher());
create policy classes_update on public.classes for update to authenticated
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());
create policy classes_delete on public.classes for delete to authenticated
  using (teacher_id = auth.uid());

-- members: joining only happens through join_class / accept_invite
create policy members_select on public.class_members for select to authenticated
  using (student_id = auth.uid() or public.teaches_class(class_id) or public.is_admin());
create policy members_delete on public.class_members for delete to authenticated
  using (public.teaches_class(class_id) or student_id = auth.uid());

-- invites
create policy invites_select on public.class_invites for select to authenticated
  using (public.teaches_class(class_id) or email = public.my_email());
create policy invites_insert on public.class_invites for insert to authenticated
  with check (public.teaches_class(class_id));
create policy invites_delete on public.class_invites for delete to authenticated
  using (public.teaches_class(class_id) or email = public.my_email());

-- licences
create policy grants_select on public.licence_grants for select to authenticated
  using (teacher_id = auth.uid() or public.is_admin());
create policy grants_insert on public.licence_grants for insert to authenticated
  with check (public.is_admin());
create policy requests_select on public.licence_requests for select to authenticated
  using (teacher_id = auth.uid() or public.is_admin());
create policy requests_insert on public.licence_requests for insert to authenticated
  with check (teacher_id = auth.uid() and public.is_teacher() and status = 'pending');

-- progress: your own, and teachers can read their students'
create policy progress_select on public.user_progress for select to authenticated
  using (user_id = auth.uid() or public.teaches_student(user_id));
create policy progress_insert on public.user_progress for insert to authenticated
  with check (user_id = auth.uid());
create policy progress_update on public.user_progress for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy progress_delete on public.user_progress for delete to authenticated
  using (user_id = auth.uid());
create policy state_all on public.user_state for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- assignments
create policy assignments_select on public.assignments for select to authenticated
  using (public.teaches_class(class_id) or class_id = public.my_class_id());
create policy assignments_insert on public.assignments for insert to authenticated
  with check (teacher_id = auth.uid() and public.teaches_class(class_id));
create policy assignments_update on public.assignments for update to authenticated
  using (public.teaches_class(class_id)) with check (teacher_id = auth.uid() and public.teaches_class(class_id));
create policy assignments_delete on public.assignments for delete to authenticated
  using (public.teaches_class(class_id));

-- submissions: students write their own until handed in; teachers read their class's
create policy subs_select on public.assignment_submissions for select to authenticated
  using (student_id = auth.uid() or public.teaches_assignment(assignment_id));
create policy subs_insert on public.assignment_submissions for insert to authenticated
  with check (student_id = auth.uid() and public.assignment_in_my_class(assignment_id));
create policy subs_update on public.assignment_submissions for update to authenticated
  using (student_id = auth.uid() and not done)
  with check (student_id = auth.uid() and public.assignment_in_my_class(assignment_id));

-- teacher marks
create policy marks_select on public.teacher_marks for select to authenticated
  using (student_id = auth.uid() or public.teaches_assignment(assignment_id));
create policy marks_write on public.teacher_marks for all to authenticated
  using (public.teaches_assignment(assignment_id))
  with check (public.teaches_assignment(assignment_id) and public.teaches_student(student_id));

-- seen
create policy seen_all on public.assignment_seen for all to authenticated
  using (student_id = auth.uid()) with check (student_id = auth.uid());

-- ---------------------------------------------------------------- function permissions
revoke execute on all functions in schema public from public, anon;
grant execute on function
  public.is_admin(), public.is_teacher(), public.teaches_class(uuid), public.teaches_student(uuid),
  public.teaches_assignment(uuid), public.my_class_id(), public.my_teacher_id(), public.my_email(),
  public.invited_to(uuid), public.assignment_in_my_class(uuid), public.licence_counts(uuid),
  public.join_class(text), public.accept_invite(uuid), public.new_join_code(uuid),
  public.decide_licence_request(uuid, boolean), public.gen_join_code()
  to authenticated;
-- the join helper is only called from join_class / accept_invite
revoke execute on function public._join(uuid) from authenticated;
