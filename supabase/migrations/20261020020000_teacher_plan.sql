-- Teacher subscriptions.
-- A teacher account on its own gets the free tier, like a student (the first lesson of each section).
-- A teacher's first licence purchase (card or invoice) also adds a yearly teacher subscription to the bill
-- (billing function). A teacher has full access while they have a live teacher subscription or any
-- licences (so licences given by the admin or an offer code unlock it too). An offer code can also give a
-- teacher subscription for some months (subscriptions rows with collection = 'offer' that end on
-- current_period_end). Admins always have full access.

alter table public.subscriptions drop constraint if exists subscriptions_plan_check;
alter table public.subscriptions add constraint subscriptions_plan_check check (plan in ('licences', 'student', 'teacher'));

-- does this teacher have full access: a live teacher subscription, or any licences?
create or replace function public._teacher_live(u uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from subscriptions where user_id = u and plan = 'teacher' and public._sub_live(status)
                   and (collection <> 'offer' or current_period_end > now()))
      or public._licence_total(u) > 0
$$;
revoke execute on function public._teacher_live(uuid) from public, anon, authenticated;
-- the billing function asks it whether to add the teacher subscription to a purchase
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public._teacher_live(uuid) to service_role;
  end if;
end $$;

create or replace function public.my_access() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'staff', public.is_admin() or (public.is_teacher() and public._teacher_live(auth.uid())),
    'admin', public.is_admin(),
    'teacher', (select to_jsonb(s) from (
              select id, status, interval, current_period_end, cancel_at_period_end, collection from subscriptions
               where user_id = auth.uid() and plan = 'teacher' and public._sub_live(status)
                 and (collection <> 'offer' or current_period_end > now())
               order by current_period_end desc nulls last limit 1) s),
    'class', exists (select 1 from class_members m join classes k on k.id = m.class_id
                     where m.student_id = auth.uid() and public._licence_total(k.teacher_id) > 0),
    'sub', (select to_jsonb(s) from (
              select id, status, interval, current_period_end, cancel_at_period_end from subscriptions
               where user_id = auth.uid() and plan = 'student' and public._sub_live(status)
               order by current_period_end desc nulls last limit 1) s))
$$;

create or replace function public.has_full_access() returns boolean
language sql stable security definer set search_path = public as $$
  select not public.payments_on()
      or public.is_admin()
      or (public.is_teacher() and public._teacher_live(auth.uid()))
      or exists (select 1 from class_members m join classes k on k.id = m.class_id
                  where m.student_id = auth.uid() and public._licence_total(k.teacher_id) > 0)
      or exists (select 1 from subscriptions
                  where user_id = auth.uid() and plan = 'student' and public._sub_live(status))
$$;

-- offer codes can include a teacher subscription for some months, and needn't include licences
alter table public.offer_codes add column if not exists teacher_months integer not null default 0 check (teacher_months between 0 and 36);
alter table public.offer_codes drop constraint if exists offer_codes_licences_check;
alter table public.offer_codes add constraint offer_codes_licences_check check (licences between 0 and 10000);
alter table public.offer_codes add constraint offer_codes_gives_something check (licences > 0 or teacher_months > 0);

create or replace function public.redeem_offer_code(c text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare k record; clean text := upper(regexp_replace(coalesce(c, ''), '[^A-Za-z0-9-]', '', 'g'));
begin
  if auth.uid() is null or not public.is_teacher() then
    return jsonb_build_object('error', 'Offer codes are for teacher accounts.');
  end if;
  if (select count(*) from offer_attempts where user_id = auth.uid() and at > now() - interval '15 minutes') >= 10 then
    return jsonb_build_object('error', 'Too many tries. Please wait a few minutes and try again.');
  end if;
  insert into offer_attempts (user_id) values (auth.uid());
  select * into k from offer_codes where code = clean for update;
  if not found or not k.active then return jsonb_build_object('error', 'That offer code isn''t valid.'); end if;
  if k.expires is not null and k.expires < current_date then return jsonb_build_object('error', 'That offer code has expired.'); end if;
  if exists (select 1 from offer_redemptions where code = clean and teacher_id = auth.uid()) then
    return jsonb_build_object('error', 'You''ve already used that offer code.');
  end if;
  if k.max_uses is not null and k.uses >= k.max_uses then return jsonb_build_object('error', 'That offer code has been used up.'); end if;
  insert into offer_redemptions (code, teacher_id, licences) values (clean, auth.uid(), k.licences);
  update offer_codes set uses = uses + 1 where code = clean;
  if k.licences > 0 then
    insert into licence_grants (teacher_id, quantity, note, created_by)
    values (auth.uid(), k.licences, 'Offer code ' || clean, null);
  end if;
  if k.teacher_months > 0 then
    insert into subscriptions (id, user_id, plan, status, quantity, interval, current_period_end, collection)
    values ('offer-' || clean || '-' || auth.uid(), auth.uid(), 'teacher', 'active', 1, 'offer',
            greatest(now(), coalesce((select max(current_period_end) from subscriptions
                                       where user_id = auth.uid() and plan = 'teacher' and collection = 'offer'), now()))
              + make_interval(months => k.teacher_months), 'offer');
  end if;
  return jsonb_build_object('licences', k.licences, 'teacher_months', k.teacher_months);
end $$;
revoke execute on function public.redeem_offer_code(text) from public, anon;
grant execute on function public.redeem_offer_code(text) to authenticated;
