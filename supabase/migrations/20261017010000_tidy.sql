-- Bits of Bytes: tidy-up after the first advisor run
-- 1. trigger functions should not be callable over the API
-- 2. policies call auth.uid() once per query, not once per row: (select auth.uid())
-- 3. indexes on foreign keys that are used for lookups and cascades
-- 4. teacher_marks: one select policy instead of two overlapping ones

-- 1 ---------------------------------------------------------------
revoke execute on function public.handle_new_user() from authenticated, anon, public;
revoke execute on function public.protect_profile() from authenticated, anon, public;

-- 2 ---------------------------------------------------------------
alter policy profiles_select on public.profiles
  using (id = (select auth.uid()) or public.is_admin() or public.teaches_student(id) or id = public.my_teacher_id()
         or id in (select k.teacher_id from public.classes k where public.invited_to(k.id)));
alter policy profiles_update on public.profiles
  using (id = (select auth.uid()) or public.is_admin()) with check (id = (select auth.uid()) or public.is_admin());

alter policy classes_select on public.classes
  using (teacher_id = (select auth.uid()) or id = public.my_class_id() or public.invited_to(id) or public.is_admin());
alter policy classes_insert on public.classes
  with check (teacher_id = (select auth.uid()) and public.is_teacher());
alter policy classes_update on public.classes
  using (teacher_id = (select auth.uid())) with check (teacher_id = (select auth.uid()));
alter policy classes_delete on public.classes
  using (teacher_id = (select auth.uid()));

alter policy members_select on public.class_members
  using (student_id = (select auth.uid()) or public.teaches_class(class_id) or public.is_admin());
alter policy members_delete on public.class_members
  using (public.teaches_class(class_id) or student_id = (select auth.uid()));

alter policy grants_select on public.licence_grants
  using (teacher_id = (select auth.uid()) or public.is_admin());
alter policy requests_select on public.licence_requests
  using (teacher_id = (select auth.uid()) or public.is_admin());
alter policy requests_insert on public.licence_requests
  with check (teacher_id = (select auth.uid()) and public.is_teacher() and status = 'pending');

alter policy progress_select on public.user_progress
  using (user_id = (select auth.uid()) or public.teaches_student(user_id));
alter policy progress_insert on public.user_progress
  with check (user_id = (select auth.uid()));
alter policy progress_update on public.user_progress
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
alter policy progress_delete on public.user_progress
  using (user_id = (select auth.uid()));
alter policy state_all on public.user_state
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

alter policy assignments_insert on public.assignments
  with check (teacher_id = (select auth.uid()) and public.teaches_class(class_id));
alter policy assignments_update on public.assignments
  using (public.teaches_class(class_id)) with check (teacher_id = (select auth.uid()) and public.teaches_class(class_id));

alter policy subs_select on public.assignment_submissions
  using (student_id = (select auth.uid()) or public.teaches_assignment(assignment_id));
alter policy subs_insert on public.assignment_submissions
  with check (student_id = (select auth.uid()) and public.assignment_in_my_class(assignment_id));
alter policy subs_update on public.assignment_submissions
  using (student_id = (select auth.uid()) and not done)
  with check (student_id = (select auth.uid()) and public.assignment_in_my_class(assignment_id));

alter policy seen_all on public.assignment_seen
  using (student_id = (select auth.uid())) with check (student_id = (select auth.uid()));

-- 4 ---------------------------------------------------------------
drop policy marks_select on public.teacher_marks;
drop policy marks_write on public.teacher_marks;
create policy marks_select on public.teacher_marks for select to authenticated
  using (student_id = (select auth.uid()) or public.teaches_assignment(assignment_id));
create policy marks_insert on public.teacher_marks for insert to authenticated
  with check (public.teaches_assignment(assignment_id) and public.teaches_student(student_id));
create policy marks_update on public.teacher_marks for update to authenticated
  using (public.teaches_assignment(assignment_id))
  with check (public.teaches_assignment(assignment_id) and public.teaches_student(student_id));
create policy marks_delete on public.teacher_marks for delete to authenticated
  using (public.teaches_assignment(assignment_id));

-- 3 ---------------------------------------------------------------
create index if not exists assignment_seen_student_idx        on public.assignment_seen (student_id);
create index if not exists assignment_submissions_student_idx on public.assignment_submissions (student_id);
create index if not exists assignments_teacher_idx            on public.assignments (teacher_id);
create index if not exists licence_grants_created_by_idx      on public.licence_grants (created_by);
create index if not exists licence_requests_teacher_idx       on public.licence_requests (teacher_id);
create index if not exists licence_requests_decided_by_idx    on public.licence_requests (decided_by);
create index if not exists teacher_marks_student_idx          on public.teacher_marks (student_id);
