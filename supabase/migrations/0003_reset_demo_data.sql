-- ============================================================
-- Demo ma'lumotlarni tozalash (reset)
-- Bu skript students, groups va call_results jadvallaridagi
-- BARCHA yozuvlarni o'chiradi. Kurslar (courses) va admin hisobingiz
-- (Supabase Authentication) tegilmaydi.
--
-- DIQQAT: Bu qaytarib bo'lmaydigan amal. Agar demo bilan birga
-- o'zingiz qo'lda qo'shgan haqiqiy o'quvchi/guruh bo'lsa, ular ham
-- o'chadi.
-- ============================================================

truncate table call_results, students, groups restart identity cascade;
