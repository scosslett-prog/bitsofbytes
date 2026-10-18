-- A second course (the Pearson Edexcel IAL / A-Level site), only visible to admins while it's being built.
-- Its content is a handful of files: the course structure script, puzzle pairs, lesson theory and exam questions.
create table if not exists public.course_files (
  course      text not null check (char_length(course) between 1 and 20),
  name        text not null check (char_length(name) between 1 and 80),
  body        text not null,
  updated_at  timestamptz not null default now(),
  primary key (course, name)
);
alter table public.course_files enable row level security;
-- no policies: nobody reads or writes the table directly
revoke all on public.course_files from anon, authenticated;

-- every file of a course, for admins only
create or replace function public.admin_course(c text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Only admins can open this course.'; end if;
  return coalesce((select jsonb_object_agg(name, body) from course_files where course = c), '{}'::jsonb);
end $$;

-- replace one file of a course
create or replace function public.admin_put_course_file(c text, n text, body text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Only admins can do that.'; end if;
  insert into course_files (course, name, body, updated_at) values (c, n, body, now())
  on conflict (course, name) do update set body = excluded.body, updated_at = now();
end $$;

revoke all on function public.admin_course(text) from public, anon;
revoke all on function public.admin_put_course_file(text, text, text) from public, anon;
grant execute on function public.admin_course(text) to authenticated;
grant execute on function public.admin_put_course_file(text, text, text) to authenticated;
