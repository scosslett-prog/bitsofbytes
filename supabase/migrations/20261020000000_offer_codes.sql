-- Offer codes: free licences for teachers.
-- The admin makes a code (e.g. a code for the teachers at one school). A teacher types it into their
-- Licences panel and gets that many licences, added as an ordinary licence grant. Each teacher can use
-- a code once; a code can have a limit on how many teachers use it, and a last day it works.

create table public.offer_codes (
  code        text primary key check (code ~ '^[A-Z0-9-]{4,32}$'),
  licences    integer not null check (licences between 1 and 10000),
  max_uses    integer check (max_uses is null or max_uses > 0),
  uses        integer not null default 0,
  expires     date,
  note        text not null default '',
  active      boolean not null default true,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);

create table public.offer_redemptions (
  code        text not null references public.offer_codes (code) on delete cascade,
  teacher_id  uuid not null references public.profiles (id) on delete cascade,
  licences    integer not null,
  created_at  timestamptz not null default now(),
  primary key (code, teacher_id)
);
create index offer_redemptions_teacher_idx on public.offer_redemptions (teacher_id);

alter table public.offer_codes enable row level security;
alter table public.offer_redemptions enable row level security;
-- only the admin can see or change codes; teachers never read the table, so codes can't be listed
create policy offer_codes_admin on public.offer_codes for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy offer_redemptions_select on public.offer_redemptions for select to authenticated
  using (teacher_id = auth.uid() or public.is_admin());

-- recent attempts, to slow down anyone guessing codes
create table public.offer_attempts (
  user_id uuid not null references public.profiles (id) on delete cascade,
  at      timestamptz not null default now()
);
create index offer_attempts_user_idx on public.offer_attempts (user_id, at);
alter table public.offer_attempts enable row level security;

-- A teacher redeems a code. Returns {"licences": n}, or {"error": "..."} so that failed tries are still
-- recorded (an exception would roll the record back) and guessing can be slowed down.
create function public.redeem_offer_code(c text) returns jsonb
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
  insert into licence_grants (teacher_id, quantity, note, created_by)
  values (auth.uid(), k.licences, 'Offer code ' || clean, null);
  return jsonb_build_object('licences', k.licences);
end $$;

revoke execute on function public.redeem_offer_code(text) from public, anon;
grant execute on function public.redeem_offer_code(text) to authenticated;
