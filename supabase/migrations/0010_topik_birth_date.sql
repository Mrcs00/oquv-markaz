-- ------------------------------------------------------------
-- 10. TOPIK: tug'ilgan yil -> to'liq tug'ilgan sana (kun, oy, yil)
-- Eski birth_year ustuni olib tashlanadi (oy va kun noma'lum bo'lgani
-- uchun ko'chirib bo'lmaydi). Jadval hali bo'sh bo'lishi kerak.
-- ------------------------------------------------------------

alter table topik_applicants add column if not exists birth_date date;
alter table topik_applicants drop column if exists birth_year;
