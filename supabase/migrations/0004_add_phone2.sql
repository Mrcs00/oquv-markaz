-- ============================================================
-- O'quvchining ikkinchi (qo'shimcha) telefon raqami
-- ============================================================

alter table students
  add column if not exists phone2 text;
