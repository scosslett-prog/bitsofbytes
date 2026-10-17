-- Bits of Bytes: sign in with Google
-- 1. Google sends the person's name as full_name or name; use either for the profile.
-- 2. Someone who chooses "Teacher" and then signs up with Google arrives as a student (Google
--    can't carry our sign-up form). claim_teacher() lets a brand-new account become a teacher,
--    exactly as if they had ticked Teacher on the email sign-up form.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare r text := coalesce(new.raw_user_meta_data ->> 'role', 'student');
begin
  if r not in ('student', 'teacher') then r := 'student'; end if;
  insert into public.profiles (id, email, full_name, role, school)
  values (new.id, lower(new.email),
          left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''), 100),
          r,
          left(coalesce(new.raw_user_meta_data ->> 'school', ''), 120));
  return new;
end $$;

create or replace function public.protect_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- direct SQL (dashboard / service role) has no signed-in user and may change anything;
  -- claim_teacher() sets bob.allow_role for its own update only
  if auth.uid() is not null
     and coalesce(current_setting('bob.allow_role', true), '') <> 'on'
     and not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
    new.role := old.role;
    new.email := old.email;
  end if;
  new.updated_at := now();
  return new;
end $$;

create function public.claim_teacher() returns boolean
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  perform set_config('bob.allow_role', 'on', true);
  update profiles set role = 'teacher'
   where id = auth.uid() and role = 'student' and created_at > now() - interval '30 minutes'
     and not exists (select 1 from class_members where student_id = auth.uid());
  get diagnostics n = row_count;
  perform set_config('bob.allow_role', '', true);
  return n > 0;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.protect_profile() from public, anon, authenticated;
revoke execute on function public.claim_teacher() from public, anon;
grant execute on function public.claim_teacher() to authenticated;
