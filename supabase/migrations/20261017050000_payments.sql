-- Bits of Bytes: payments with Stripe
-- Teachers buy class licences as a yearly subscription (quantity = number of licences);
-- students studying on their own subscribe monthly or yearly.
-- Rows here are written only by the stripe-webhook edge function (service role), never by the
-- browser, so nobody can give themselves a subscription.

create table public.billing_customers (
  user_id             uuid primary key references public.profiles (id) on delete cascade,
  stripe_customer_id  text not null unique,
  created_at          timestamptz not null default now()
);

create table public.subscriptions (
  id                    text primary key,                 -- Stripe subscription id
  user_id               uuid not null references public.profiles (id) on delete cascade,
  plan                  text not null check (plan in ('licences', 'student')),
  status                text not null,                    -- Stripe status: active, trialing, past_due, canceled, ...
  quantity              integer not null default 1,
  price_id              text,
  interval              text,                             -- month or year
  current_period_end    timestamptz,
  cancel_at_period_end  boolean not null default false,
  updated_at            timestamptz not null default now()
);
create index subscriptions_user_idx on public.subscriptions (user_id);

alter table public.billing_customers enable row level security;
alter table public.subscriptions enable row level security;
create policy customers_select on public.billing_customers for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());
create policy subscriptions_select on public.subscriptions for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());

-- a subscription counts while Stripe still considers it live (past_due gives a few days' grace)
create function public._sub_live(status text) returns boolean language sql immutable set search_path = public as $$
  select status in ('active', 'trialing', 'past_due')
$$;

-- licences a teacher has: given by an admin (invoices, approved requests) plus paid subscriptions
create function public._licence_total(t uuid) returns integer
language sql stable security definer set search_path = public as $$
  select coalesce((select sum(quantity)::int from licence_grants where teacher_id = t), 0)
       + coalesce((select sum(quantity)::int from subscriptions where user_id = t and plan = 'licences' and public._sub_live(status)), 0)
$$;

create or replace function public.licence_counts(t uuid default auth.uid())
returns table (total integer, used integer)
language plpgsql stable security definer set search_path = public as $$
begin
  if t <> auth.uid() and not public.is_admin() then raise exception 'not allowed'; end if;
  return query select
    public._licence_total(t),
    coalesce((select count(*)::int from class_members m join classes k on k.id = m.class_id where k.teacher_id = t), 0);
end $$;

create or replace function public._join(c uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare t uuid; tot int; usd int; me uuid := auth.uid();
begin
  if me is null then raise exception 'Sign in first.'; end if;
  if (select role from profiles where id = me) <> 'student' then raise exception 'Only student accounts can join a class.'; end if;
  select teacher_id into t from classes where id = c and not archived;
  if t is null then raise exception 'No class has that code. Check it with your teacher.'; end if;
  if exists (select 1 from class_members where class_id = c and student_id = me) then return c; end if;
  perform pg_advisory_xact_lock(hashtext(t::text));
  tot := public._licence_total(t);
  select count(*) into usd from class_members m join classes k on k.id = m.class_id where k.teacher_id = t;
  if usd >= tot then raise exception 'Your teacher has no free licences left. Ask them to get more, then try again.'; end if;
  delete from class_members where student_id = me;
  insert into class_members (class_id, student_id) values (c, me);
  delete from class_invites where class_id = c and email = public.my_email();
  return c;
end $$;

-- what the signed-in person can use: staff (teachers, admins), a licensed class, or their own subscription
create function public.my_access() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'staff', exists (select 1 from profiles where id = auth.uid() and role in ('teacher', 'admin')),
    'class', exists (select 1 from class_members m join classes k on k.id = m.class_id
                     where m.student_id = auth.uid() and public._licence_total(k.teacher_id) > 0),
    'sub', (select to_jsonb(s) from (
              select id, status, interval, current_period_end, cancel_at_period_end from subscriptions
               where user_id = auth.uid() and plan = 'student' and public._sub_live(status)
               order by current_period_end desc nulls last limit 1) s))
$$;

revoke execute on function public._licence_total(uuid), public._sub_live(text), public.my_access() from public, anon;
revoke execute on function public._licence_total(uuid), public._sub_live(text) from authenticated;
grant execute on function public.my_access() to authenticated;
-- _join is still only reachable through join_class / accept_invite
revoke execute on function public._join(uuid) from public, anon, authenticated;
