-- Bits of Bytes: teachers choose which lessons their class can open
-- restrict_lessons = false: every lesson is open (the default, as before)
-- restrict_lessons = true:  students in the class can only open the lessons in released_lessons,
--                           plus any lesson in an assignment set for the class
-- Teachers already update their own classes (classes_update); students already read their class.
alter table public.classes
  add column if not exists restrict_lessons boolean not null default false,
  add column if not exists released_lessons text[] not null default '{}';
