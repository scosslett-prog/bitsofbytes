-- Bits of Bytes: admins manage the course content and the paywall from the Admin page,
-- so no secret keys or SQL are needed for either.

-- what the Admin page shows about the site
create function public.admin_site() returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Only admins can do that.'; end if;
  return jsonb_build_object(
    'payments', (select payments from site_settings),
    'updated', (select nullif(content_version, '') from site_settings),
    'lessons', (select count(*) from lesson_theory),
    'free_lessons', (select count(*) from lesson_theory where free),
    'questions', (select count(*) from exam_questions),
    'free_questions', (select count(*) from exam_questions where free));
end $$;

create function public.admin_set_payments(on_ boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Only admins can do that.'; end if;
  update site_settings set payments = on_, updated_at = now();
end $$;

-- add or replace a batch of content rows. kind: theory | papers | questions
create function public.admin_put_content(kind text, rows jsonb) returns integer
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  if not public.is_admin() then raise exception 'Only admins can do that.'; end if;
  if kind = 'theory' then
    insert into lesson_theory (id, ord, free, html, updated_at)
      select r.id, r.ord, r.free, r.html, now() from jsonb_to_recordset(rows) as r(id text, ord int, free boolean, html text)
      on conflict (id) do update set ord = excluded.ord, free = excluded.free, html = excluded.html, updated_at = now();
  elsif kind = 'papers' then
    insert into exam_papers (id, ord, data)
      select r.id, r.ord, r.data from jsonb_to_recordset(rows) as r(id text, ord int, data jsonb)
      on conflict (id) do update set ord = excluded.ord, data = excluded.data;
  elsif kind = 'questions' then
    insert into exam_questions (id, ord, free, data)
      select r.id, r.ord, r.free, r.data from jsonb_to_recordset(rows) as r(id text, ord int, free boolean, data jsonb)
      on conflict (id) do update set ord = excluded.ord, free = excluded.free, data = excluded.data;
  else
    raise exception 'Unknown content type.';
  end if;
  get diagnostics n = row_count;
  return n;
end $$;

-- after an upload: remove anything no longer in the files, and tell browsers to fetch the new content
create function public.admin_finish_content(theory_ids text[], paper_ids text[], question_ids text[]) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Only admins can do that.'; end if;
  delete from lesson_theory where not (id = any (theory_ids));
  delete from exam_papers where not (id = any (paper_ids));
  delete from exam_questions where not (id = any (question_ids));
  update site_settings set content_version = to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), updated_at = now();
end $$;

revoke execute on function public.admin_site(), public.admin_set_payments(boolean), public.admin_put_content(text, jsonb),
  public.admin_finish_content(text[], text[], text[]) from public, anon;
grant execute on function public.admin_site(), public.admin_set_payments(boolean), public.admin_put_content(text, jsonb),
  public.admin_finish_content(text[], text[], text[]) to authenticated;
