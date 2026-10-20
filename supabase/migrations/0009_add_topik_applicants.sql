-- ------------------------------------------------------------
-- 9. TOPIK ARIZACHILARI (topik_applicants)
-- Imtihonga kirgan o'quvchilarning raqami, ismi, familiyasi va
-- tug'ilgan yili — natijalarni tekshirganda tez topish uchun.
-- Boshqa jadvallarga bog'liq emas.
--   exam_round — imtihon raundi (masalan 108)
--   level      — 1 = TOPIK I, 2 = TOPIK II
-- ------------------------------------------------------------

create table if not exists topik_applicants (
  id uuid primary key default gen_random_uuid(),
  exam_round smallint not null check (exam_round > 0),
  level smallint not null check (level in (1, 2)),
  exam_number text not null,
  first_name text not null,
  last_name text not null,
  birth_year smallint check (birth_year between 1900 and 2100),
  result text not null default 'kutilmoqda' check (result in ('kutilmoqda', 'otdi', 'otmadi')),
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint topik_applicants_unique_exam unique (exam_round, level, exam_number)
);

create index if not exists idx_topik_round_level on topik_applicants (exam_round desc, level);
create index if not exists idx_topik_exam_number on topik_applicants (exam_number);

drop trigger if exists trg_topik_applicants_updated_at on topik_applicants;
create trigger trg_topik_applicants_updated_at before update on topik_applicants
  for each row execute function set_updated_at();

alter table topik_applicants enable row level security;

create policy "authenticated_full_access_topik_applicants" on topik_applicants
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
