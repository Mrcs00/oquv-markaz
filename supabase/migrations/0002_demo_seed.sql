-- ============================================================
-- Demo ma'lumotlar (ixtiyoriy). UI'ni sinash uchun.
-- Ishlatmoqchi bo'lmasangiz bu faylni supabase/migrations papkasidan
-- o'chirib tashlang yoki push qilmang.
-- ============================================================

do $$
declare
  v_korean uuid;
  v_english uuid;
  v_math uuid;
  g_beginner01 uuid;
  g_elementary01 uuid;
  g_preint01 uuid;
  g_english_beg uuid;
  g_math_full uuid;
begin
  select id into v_korean from courses where name = 'Koreys tili';
  select id into v_english from courses where name = 'Ingliz tili';
  select id into v_math from courses where name = 'Matematika';

  -- ---------- GURUHLAR ----------
  insert into groups (name, course_id, min_level, max_level, teacher_name, schedule_days, schedule_time, max_students)
  values ('Korean Beginner 01', v_korean, 0, 0, 'Muhammad Aliyev', '{Du,Chor,Jum}', '18:00', 12)
  returning id into g_beginner01;

  insert into groups (name, course_id, min_level, max_level, teacher_name, schedule_days, schedule_time, max_students)
  values ('Korean Elementary 01', v_korean, 1, 2, 'Dilnoza Karimova', '{Se,Pay,Shan}', '17:00', 12)
  returning id into g_elementary01;

  insert into groups (name, course_id, min_level, max_level, teacher_name, schedule_days, schedule_time, max_students)
  values ('Korean Pre-Intermediate 01', v_korean, 2, 3, 'Dilnoza Karimova', '{Du,Chor,Jum}', '19:00', 12)
  returning id into g_preint01;

  insert into groups (name, course_id, min_level, max_level, teacher_name, schedule_days, schedule_time, max_students)
  values ('English Beginner 01', v_english, 0, 0, 'Shahzod Rustamov', '{Se,Pay}', '16:00', 10)
  returning id into g_english_beg;

  insert into groups (name, course_id, min_level, max_level, teacher_name, schedule_days, schedule_time, max_students)
  values ('Matematika 5-sinf', v_math, 0, 1, 'Nodira Yusupova', '{Du,Se,Chor,Pay,Jum}', '15:00', 10)
  returning id into g_math_full;

  -- ---------- O'QUVCHILAR: mavjud guruhlarga biriktirilganlar ----------
  insert into students (full_name, phone, course_id, level, group_id, status) values
    ('Sardor Aliyev',    '+998901112233', v_korean, 0, g_beginner01, 'faol'),
    ('Kamola Yusupova',  '+998901112234', v_korean, 0, g_beginner01, 'faol'),
    ('Jasur Toshmatov',  '+998901112235', v_korean, 0, g_beginner01, 'faol'),
    ('Nilufar Xolova',   '+998901112236', v_korean, 0, g_beginner01, 'faol'),
    ('Bekzod Nazarov',   '+998901112237', v_korean, 0, g_beginner01, 'faol'),
    ('Madina Ergasheva', '+998901112238', v_korean, 0, g_beginner01, 'faol'),
    ('Otabek Qodirov',   '+998901112239', v_korean, 0, g_beginner01, 'faol'),
    ('Zarina Nabieva',   '+998901112240', v_korean, 0, g_beginner01, 'faol'),

    ('Diyor Xasanov',    '+998901112241', v_korean, 1, g_elementary01, 'faol'),
    ('Malika Sobirova',  '+998901112242', v_korean, 1, g_elementary01, 'faol'),
    ('Farrux Umarov',    '+998901112243', v_korean, 2, g_elementary01, 'faol'),
    ('Gulnoza Rashidova','+998901112244', v_korean, 2, g_elementary01, 'faol'),
    ('Aziz Mamatov',     '+998901112245', v_korean, 2, g_elementary01, 'faol'),
    ('Sabina Yoqubova',  '+998901112246', v_korean, 1, g_elementary01, 'faol'),
    ('Ulug''bek Saidov', '+998901112247', v_korean, 2, g_elementary01, 'faol'),
    ('Kamron Fayzullayev','+998901112248', v_korean, 2, g_elementary01, 'faol'),
    ('Xurshida Rahimova','+998901112249', v_korean, 1, g_elementary01, 'faol'),

    ('Shoxrux Berdiyev', '+998901112250', v_korean, 3, g_preint01, 'faol'),
    ('Feruza Egamova',   '+998901112251', v_korean, 2, g_preint01, 'faol'),
    ('Anvar Xudoyberdiyev','+998901112252', v_korean, 3, g_preint01, 'faol'),
    ('Sevinch Tojiboyeva','+998901112253', v_korean, 2, g_preint01, 'faol'),
    ('Elyor G''ofurov',  '+998901112254', v_korean, 3, g_preint01, 'faol'),
    ('Zilola Mirzayeva', '+998901112255', v_korean, 2, g_preint01, 'faol'),

    ('Rustam Boltayev',  '+998901112256', v_math, 0, g_math_full, 'faol'),
    ('Shahnoza Qurbonova','+998901112257', v_math, 1, g_math_full, 'faol'),
    ('Javlon Ismoilov',  '+998901112258', v_math, 0, g_math_full, 'faol'),
    ('Nargiza Sattorova','+998901112259', v_math, 1, g_math_full, 'faol'),
    ('Sanjar Ahmedov',   '+998901112260', v_math, 0, g_math_full, 'faol'),
    ('Ozoda Jalilova',   '+998901112261', v_math, 1, g_math_full, 'faol'),
    ('Bahodir Nurmatov', '+998901112262', v_math, 0, g_math_full, 'faol'),
    ('Zebiniso Qosimova','+998901112263', v_math, 1, g_math_full, 'faol'),
    ('Doniyor Xolmatov', '+998901112264', v_math, 0, g_math_full, 'faol'),
    ('Mohira Egamberdiyeva','+998901112265', v_math, 1, g_math_full, 'faol');

  -- ---------- YANGI O'QUVCHILAR: 0-dan, guruh yig'ilmoqda (10/10 — tayyor) ----------
  insert into students (full_name, phone, course_id, level, status) values
    ('Muhammad Ali',     '+998901000001', v_korean, 0, 'kutmoqda'),
    ('Vali Valiyev',     '+998901000002', v_korean, 0, 'kutmoqda'),
    ('Dilshod Rahmonov', '+998901000003', v_korean, 0, 'kutmoqda'),
    ('Nodira Saidova',   '+998901000004', v_korean, 0, 'kutmoqda'),
    ('Aziza Tursunova',  '+998901000005', v_korean, 0, 'kutmoqda'),
    ('Sherzod Qodirov',  '+998901000006', v_korean, 0, 'kutmoqda'),
    ('Yulduz Ne''matova','+998901000007', v_korean, 0, 'kutmoqda'),
    ('Bobur Islomov',    '+998901000008', v_korean, 0, 'kutmoqda'),
    ('Mavluda G''aniyeva','+998901000009', v_korean, 0, 'kutmoqda'),
    ('Sirojiddin Bekov', '+998901000010', v_korean, 0, 'kutmoqda');

  -- ---------- YANGI O'QUVCHILAR: 0-dan, guruh hali to'liq yig'ilmagan (7/10) ----------
  insert into students (full_name, phone, course_id, level, status) values
    ('Kamila Nosirova',  '+998901000011', v_english, 0, 'kutmoqda'),
    ('Temur G''ulomov',  '+998901000012', v_english, 0, 'kutmoqda'),
    ('Iroda Xamidova',   '+998901000013', v_english, 0, 'kutmoqda'),
    ('Jahongir Safarov',  '+998901000014', v_english, 0, 'kutmoqda'),
    ('Robiya Mirzaeva',  '+998901000015', v_english, 0, 'kutmoqda'),
    ('Asadbek Yoldashev','+998901000016', v_english, 0, 'kutmoqda'),
    ('Munisa Davlatova', '+998901000017', v_english, 0, 'kutmoqda');

  -- ---------- BILIMI BOR O'QUVCHILAR: mos guruh kutmoqda ----------
  insert into students (full_name, phone, course_id, level, status) values
    ('Islombek Turg''unov', '+998901000018', v_korean, 2, 'guruh_kutmoqda'),
    ('Sabina Ochilova',     '+998901000019', v_korean, 3, 'guruh_kutmoqda'),
    ('Davron Yusupov',      '+998901000020', v_korean, 1, 'guruh_kutmoqda');
end $$;
