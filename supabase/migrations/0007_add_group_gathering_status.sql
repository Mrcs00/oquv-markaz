-- ------------------------------------------------------------
-- 7. GURUH YIG'ILISH BOSQICHI (yigilmoqda)
-- Endi yangi guruh ochilganda u darhol "faol" bo'lmaydi — avval
-- "yigilmoqda" holatida turadi (bosh sahifada progress-bar bilan
-- ko'rinadi), o'quvchilar soni max_students'ga yetganda avtomatik
-- "faol"ga o'tadi, yoki administrator uni qo'lda ochishi mumkin.
-- ------------------------------------------------------------

alter table groups drop constraint if exists groups_status_check;

alter table groups
  add constraint groups_status_check check (status in ('yigilmoqda', 'faol', 'yopiq'));

alter table groups
  alter column status set default 'yigilmoqda';

-- Eslatma: mavjud guruhlar ('faol' yoki 'yopiq') o'zgarishsiz qoladi —
-- faqat BUNDAN KEYIN yaratiladigan guruhlar "yigilmoqda"dan boshlanadi.
