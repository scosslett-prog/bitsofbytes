-- The billing function changes the number of licences on a teacher's subscription; it checks the new
-- total still covers the students already in the teacher's classes.
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public._licence_total(uuid) to service_role;
  end if;
end $$;

create or replace function public._licences_used(t uuid) returns integer
language sql stable security definer set search_path = public as $$
  select coalesce((select count(*)::int from class_members m join classes k on k.id = m.class_id where k.teacher_id = t), 0)
$$;
revoke execute on function public._licences_used(uuid) from public, anon, authenticated;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public._licences_used(uuid) to service_role;
  end if;
end $$;
