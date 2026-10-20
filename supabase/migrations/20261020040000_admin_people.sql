-- The admin's list of everyone who has registered, and how each has access.
create or replace function public.admin_people() returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  return coalesce((select jsonb_agg(row_to_json(x) order by x.created_at desc) from (
    select p.id, p.email, p.full_name as name, p.role, p.school, p.created_at,
      (select max(u.updated_at) from user_progress u where u.user_id = p.id) as last_active,
      -- students: their class, and whether that class's teacher has licences
      (select jsonb_build_object('name', k.name, 'teacher', coalesce(nullif(t.full_name, ''), t.email),
                                 'licensed', public._licence_total(k.teacher_id) > 0)
         from class_members m join classes k on k.id = m.class_id join profiles t on t.id = k.teacher_id
        where m.student_id = p.id limit 1) as class,
      -- a live student subscription
      (select jsonb_build_object('interval', s.interval, 'status', s.status, 'end', s.current_period_end, 'cancel', s.cancel_at_period_end)
         from subscriptions s where s.user_id = p.id and s.plan = 'student' and public._sub_live(s.status)
        order by s.current_period_end desc nulls last limit 1) as sub,
      -- teachers: their teacher subscription, and licences
      (select jsonb_build_object('collection', s.collection, 'status', s.status, 'end', s.current_period_end, 'cancel', s.cancel_at_period_end)
         from subscriptions s where s.user_id = p.id and s.plan = 'teacher' and public._sub_live(s.status)
           and (s.collection <> 'offer' or s.current_period_end > now())
        order by s.current_period_end desc nulls last limit 1) as teacher_sub,
      case when p.role <> 'student' then public._licence_total(p.id) end as licences,
      case when p.role <> 'student' then public._licences_used(p.id) end as used,
      case when p.role <> 'student' then coalesce((select sum(quantity)::int from subscriptions s
         where s.user_id = p.id and s.plan = 'licences' and public._sub_live(s.status)), 0) end as paid_licences,
      case when p.role <> 'student' then exists (select 1 from subscriptions s where s.user_id = p.id and s.plan = 'licences'
         and public._sub_live(s.status) and s.collection = 'send_invoice') end as invoiced
    from profiles p) x), '[]'::jsonb);
end $$;
revoke execute on function public.admin_people() from public, anon;
grant execute on function public.admin_people() to authenticated;
