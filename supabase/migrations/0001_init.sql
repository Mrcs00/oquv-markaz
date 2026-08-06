-- ============================================================
-- O'quv Markaz — boshlang'ich migratsiya
-- Yangi, alohida Supabase project uchun. Boshqa loyihalarga bog'liq emas.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. COURSES (kurslar)
-- ------------------------------------------------------------
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. GROUPS (guruhlar)
-- min_level / max_level — guruh qabul qila oladigan daraja oralig'i.
-- Masalan Beginner guruh: min_level=0, max_level=0.
-- Elementary guruh: min_level=1, max_level=2.
-- ------------------------------------------------------------
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  course_id uuid not null references courses(id) on delete restrict,
  min_level smallint not null check (min_level between 0 and 6),
  max_level smallint not null check (max_level between 0 and 6),
  teacher_name text not null default '',
  schedule_days text[] not null default '{}',
  schedule_time text not null default '',
  max_students smallint not null default 12 check (max_students > 0),
  status text not null default 'faol' check (status in ('faol', 'yopiq')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_level_range check (max_level >= min_level)
);

-- ------------------------------------------------------------
-- 3. STUDENTS (o'quvchilar)
-- status: 'kutmoqda'      -> 0 dan boshlovchi, guruh yig'ilmoqda
--         'guruh_kutmoqda'-> bilimi bor, mos guruh tanlanishi kutilmoqda
--         'faol'          -> guruhga biriktirilgan
-- level: 0 = "0 dan", 1..6 = "1-daraja".."6-daraja"
-- ------------------------------------------------------------
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  course_id uuid not null references courses(id) on delete restrict,
  level smallint not null check (level between 0 and 6),
  group_id uuid references groups(id) on delete set null,
  status text not null default 'kutmoqda' check (status in ('kutmoqda', 'guruh_kutmoqda', 'faol')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_students_course_level on students (course_id, level) where deleted_at is null;
create index if not exists idx_students_group on students (group_id) where deleted_at is null;
create index if not exists idx_students_status on students (status) where deleted_at is null;

-- ------------------------------------------------------------
-- 4. CALL_RESULTS (telefon qo'ng'iroq natijalari)
-- Har bir o'quvchi uchun bitta "joriy" natija (1:1). Tarix kerak bo'lmagani
-- uchun (spetsifikatsiyaga ko'ra ortiqcha murakkablik kerak emas) student_id
-- UNIQUE qilib qo'yildi — yangi qo'ng'iroq eskisini yangilaydi.
-- ------------------------------------------------------------
create table if not exists call_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references students(id) on delete cascade,
  result text not null check (result in ('coming', 'no_answer', 'not_coming', 'call_later')),
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- updated_at trigger helper
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_groups_updated_at on groups;
create trigger trg_groups_updated_at before update on groups
  for each row execute function set_updated_at();

drop trigger if exists trg_students_updated_at on students;
create trigger trg_students_updated_at before update on students
  for each row execute function set_updated_at();

drop trigger if exists trg_call_results_updated_at on call_results;
create trigger trg_call_results_updated_at before update on call_results
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY — faqat authenticated admin o'qiy/yoza oladi
-- ------------------------------------------------------------
alter table courses enable row level security;
alter table groups enable row level security;
alter table students enable row level security;
alter table call_results enable row level security;

create policy "authenticated_full_access_courses" on courses
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated_full_access_groups" on groups
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated_full_access_students" on students
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated_full_access_call_results" on call_results
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- SEED: boshlang'ich kurslar
-- ------------------------------------------------------------
insert into courses (name) values
  ('Koreys tili'),
  ('Ingliz tili'),
  ('Matematika')
on conflict (name) do nothing;
