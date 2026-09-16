-- ------------------------------------------------------------
-- 8. O'QUVCHINING XOHLAGAN SMENASI (desired_shift)
-- "0 dan" (guruhsiz, "kutmoqda") o'quvchi qo'shilganda endi mavjud
-- guruh emas, balki xohlagan smenasi so'raladi. Shu orqali bosh
-- sahifadagi "yig'ilish havzalari" endi kurs + smena bo'yicha
-- alohida-alohida ko'rsatiladi.
-- ------------------------------------------------------------

alter table students
  add column desired_shift text check (desired_shift in ('ertalabki', 'kunduzgi'));
