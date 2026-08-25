-- ============================================================
-- O'quvchi qanday qo'shilgani: "individual" yoki "group" (Gruppa
-- tabidan "0 dan" orqali kelgan, guruh yig'ish havzasi uchun).
-- Faqat "group" turi bosh sahifadagi "Guruhlarni yig'ish" havzasida
-- ko'rinadi; "individual" (Yangi o'quvchi -> Individul) ko'rinmaydi.
-- ============================================================

alter table students
  add column if not exists enrollment_type text not null default 'group'
  check (enrollment_type in ('individual', 'group'));
