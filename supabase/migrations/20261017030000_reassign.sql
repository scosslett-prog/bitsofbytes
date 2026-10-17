-- Bits of Bytes: teachers can reassign an assignment to one or more students
-- Each reassignment is kept (history), with the new due date, an optional feedback comment and
-- a copy of the student's previous attempt. For exam-question assignments the student's answers
-- and the teacher's marks are cleared so they can answer again; for lesson assignments the
-- student must redo each lesson's tasks after the reassignment.
create table public.assignment_reassigns (
  id             uuid primary key default gen_random_uuid(),
  assignment_id  uuid not null references public.assignments (id) on delete cascade,
  student_id     uuid not null references public.profiles (id) on delete cascade,
  due_date       date not null,
  comment        text not null default '' check (char_length(comment) <= 500),
  prev_score     integer,
  previous       jsonb,
  created_by     uuid references public.profiles (id) on delete set null,
  created_at     timestamptz not null default now()
);
create index assignment_reassigns_asg_idx on public.assignment_reassigns (assignment_id);
create index assignment_reassigns_student_idx on public.assignment_reassigns (student_id);
create index assignment_reassigns_created_by_idx on public.assignment_reassigns (created_by);

alter table public.assignment_reassigns enable row level security;
create policy reassigns_select on public.assignment_reassigns for select to authenticated
  using (student_id = (select auth.uid()) or public.teaches_assignment(assignment_id));
-- rows are only ever written by reassign() below

create function public.reassign(a uuid, students uuid[], due date, note text default '', prev jsonb default '{}'::jsonb)
returns integer language plpgsql security definer set search_path = public as $$
declare s uuid; n integer := 0;
begin
  if not public.teaches_assignment(a) then raise exception 'not allowed'; end if;
  if due < current_date - 1 then raise exception 'The new due date is in the past.'; end if;
  foreach s in array coalesce(students, '{}') loop
    -- only students who are in the assignment's class
    if not exists (select 1 from class_members m join assignments x on x.class_id = m.class_id where x.id = a and m.student_id = s) then continue; end if;
    insert into assignment_reassigns (assignment_id, student_id, due_date, comment, prev_score, previous, created_by)
    values (a, s, due, left(coalesce(note, ''), 500),
      case when coalesce(prev ->> s::text, '') ~ '^\d+$' then (prev ->> s::text)::int end,
      (select jsonb_build_object('answers', sub.answers, 'done', sub.done, 'submitted_at', sub.submitted_at,
                                 'marks', (select jsonb_object_agg(question_id, mark) from teacher_marks t where t.assignment_id = a and t.student_id = s))
         from assignment_submissions sub where sub.assignment_id = a and sub.student_id = s),
      auth.uid());
    delete from assignment_submissions where assignment_id = a and student_id = s;
    delete from teacher_marks where assignment_id = a and student_id = s;
    delete from assignment_seen where assignment_id = a and student_id = s;
    n := n + 1;
  end loop;
  return n;
end $$;
revoke execute on function public.reassign(uuid, uuid[], date, text, jsonb) from public, anon;
grant execute on function public.reassign(uuid, uuid[], date, text, jsonb) to authenticated;
