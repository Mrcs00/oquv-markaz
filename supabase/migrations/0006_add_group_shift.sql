-- ------------------------------------------------------------
-- 6. GROUP SHIFT (오전 / 오후)
-- Har bir guruh ikki fixed smenadan birida ochiladi:
--   ertalabki (오전) -> 08:00-12:00
--   kunduzgi  (오후) -> 13:00-18:00
-- ------------------------------------------------------------

alter table groups
  add column shift text check (shift in ('ertalabki', 'kunduzgi'));

-- Mavjud guruhlar uchun shift'ni schedule_time'dan avtomatik aniqlaymiz:
-- soat 12dan oldin boshlansa -> ertalabki, aks holda -> kunduzgi.
-- schedule_time bo'sh yoki noto'g'ri formatda bo'lsa -> kunduzgi (default).
update groups
set shift = case
  when schedule_time ~ '^\d{1,2}:\d{2}' and split_part(schedule_time, ':', 1)::int < 12
    then 'ertalabki'
  else 'kunduzgi'
end
where shift is null;

alter table groups
  alter column shift set not null,
  alter column shift set default 'kunduzgi';
