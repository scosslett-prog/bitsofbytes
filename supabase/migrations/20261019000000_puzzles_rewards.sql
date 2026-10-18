-- Tarsia puzzle results and points.
--   user_progress kind 'tz'  : a lesson's puzzle result, key "<lesson id>-e" (Easy) or "<lesson id>-c" (Challenge)
--   user_progress kind 'pts' : key 'total', the student's points and rank, worked out by the site from their progress
-- Lesson assignments that include the puzzles say so in assignments.spec ({"tz": true}); no change needed there.
alter table public.user_progress drop constraint if exists user_progress_kind_check;
alter table public.user_progress add constraint user_progress_kind_check
  check (kind in ('lessons', 'scores', 'acts', 'ex', 'tz', 'pts'));

-- teachers can turn the class leaderboard off
alter table public.classes add column if not exists leaderboard boolean not null default true;

-- A class's points table.
-- Teachers see every student in their class. Students in the class see the top 10 and their own row,
-- and only while the teacher has the leaderboard switched on.
create or replace function public.class_leaderboard(c uuid)
returns table (student_id uuid, name text, points integer, rank_name text, place integer, me boolean)
language plpgsql stable security definer set search_path = public as $$
declare teach boolean := public.teaches_class(c);
begin
  if not teach and not exists (
    select 1 from class_members m join classes k on k.id = m.class_id
    where m.class_id = c and m.student_id = auth.uid() and k.leaderboard and not k.archived
  ) then
    return;
  end if;
  return query
  with t as (
    select m.student_id,
           coalesce(nullif(p.full_name, ''), 'Student')::text as name,
           coalesce((u.data->>'points')::integer, 0) as points,
           coalesce(u.data->>'rank', 'Bit')::text as rank_name
    from class_members m
    join profiles p on p.id = m.student_id
    left join user_progress u on u.user_id = m.student_id and u.kind = 'pts' and u.key = 'total'
    where m.class_id = c
  ), r as (
    select t.*, (rank() over (order by t.points desc))::integer as place from t
  )
  select r.student_id, r.name, r.points, r.rank_name, r.place, r.student_id = auth.uid()
  from r
  where teach or r.place <= 10 or r.student_id = auth.uid()
  order by r.place, r.name;
end $$;
revoke all on function public.class_leaderboard(uuid) from public, anon;
grant execute on function public.class_leaderboard(uuid) to authenticated;
