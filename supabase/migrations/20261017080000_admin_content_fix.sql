-- Supabase refuses an UPDATE without a WHERE clause, even inside a function: name the settings row.
create or replace function public.admin_set_payments(on_ boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Only admins can do that.'; end if;
  update site_settings set payments = on_, updated_at = now() where id;
end $$;

create or replace function public.admin_finish_content(theory_ids text[], paper_ids text[], question_ids text[]) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Only admins can do that.'; end if;
  delete from lesson_theory where not (id = any (theory_ids));
  delete from exam_papers where not (id = any (paper_ids));
  delete from exam_questions where not (id = any (question_ids));
  update site_settings set content_version = to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), updated_at = now() where id;
end $$;
