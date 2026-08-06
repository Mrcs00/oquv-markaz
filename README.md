# O'quv Markaz — O'quvchilarni ro'yxatga olish va guruhlashtirish tizimi

Next.js 14 (App Router) + Supabase (Auth + Postgres) + Tailwind CSS asosida qurilgan.

Asosiy jarayon: **yangi o'quvchi → 0-dan guruh yig'ish → 10 taga yetganda telefon qilish →
natijalarni belgilash → keladigan o'quvchilar bilan guruh ochish → bilimi bor o'quvchini
mos guruhga qo'shish.**

---

## 1. Talablar

* Node.js 18+
* Bepul [Supabase](https://supabase.com) akkaunti
* Bepul [Vercel](https://vercel.com) akkaunti (deploy uchun)

---

## 2. Yangi Supabase loyihasi yaratish

1. https://supabase.com/dashboard → **New project**.
2. Bu loyiha uchun **alohida yangi project** yarating — eski loyihalaringizga
   ulamang.
3. Project yaratilgach, chap menyudan **SQL Editor** ga o'ting.
4. `supabase/migrations/0001_init.sql` faylining butun mazmunini SQL Editor'ga
   nusxalab, **Run** tugmasini bosing. Bu barcha jadvallarni, RLS
   policy'larni va boshlang'ich kurslarni (Koreys tili, Ingliz tili,
   Matematika) yaratadi.
5. *(Ixtiyoriy, faqat demo ko'rish uchun)* `supabase/migrations/0002_demo_seed.sql`
   faylini ham xuddi shunday ishga tushiring — bu 15-20 ta demo o'quvchi va
   5 ta demo guruh qo'shadi, jumladan bitta 10/10 "guruh ochishga tayyor"
   holatdagi pool.

### Administrator hisobini yaratish

1. Supabase dashboard → **Authentication → Users → Add user**.
2. Email va parol kiriting (masalan, `admin@markaz.uz`).
3. **Auto Confirm User** belgisini yoqing (email tasdiqlashsiz kirish uchun).

Tizimga faqat shu tarzda qo'shilgan foydalanuvchilar kira oladi — ro'yxatdan
o'tish sahifasi qasddan yo'q, chunki bu administrator uchun yopiq tizim.

---

## 3. Loyihani lokal ishga tushirish

```bash
npm install
cp .env.local.example .env.local
```

`.env.local` faylini oching va Supabase → **Settings → API** bo'limidagi
qiymatlarni qo'ying:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Keyin:

```bash
npm run dev
```

http://localhost:3000 ni oching — avtomatik `/login` sahifasiga
yo'naltirasiz. Yuqorida yaratgan admin email/parol bilan kiring.

---

## 4. Vercel'ga deploy qilish

1. Loyihani GitHub'ga push qiling.
2. https://vercel.com/new → repository'ni tanlang → **Import**.
3. **Environment Variables** bo'limiga quyidagilarni qo'shing (Production va
   Preview uchun):
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy** tugmasini bosing.

Deploy tugagach, GitHub'ga har push qilganingizda Vercel avtomatik qayta
deploy qiladi (GitHub → Vercel → Supabase workflow).

---

## 5. Loyiha tuzilishi

```
app/
  login/                     - Kirish sahifasi (Supabase Auth)
  (dashboard)/                - Auth talab qilinadigan barcha sahifalar
    page.tsx                  - Bosh sahifa / dashboard
    students/                 - O'quvchilar ro'yxati, profil, yangi qo'shish
    groups/                   - Guruhlar ro'yxati, guruh sahifasi, yangi guruh
    call/[courseId]/          - Telefon qilish jarayoni
    call/[courseId]/open/     - Telefon natijalaridan keyin guruh ochish
    deleted/                  - O'chirilgan o'quvchilar (soft delete)
    settings/                 - Admin ma'lumotlari, chiqish
components/                   - Qayta ishlatiluvchi UI komponentlar
lib/
  actions.ts                  - Barcha server action (CRUD mutatsiyalar)
  data.ts                     - Server komponentlar uchun so'rovlar
  types.ts                    - TypeScript turlar
  constants.ts                - Daraja/status/qo'ng'iroq natijasi lug'atlari
  supabase/                   - Supabase client (browser/server/middleware)
supabase/migrations/          - SQL sxema va demo ma'lumotlar
middleware.ts                 - Auth himoyasi (login qilmagan foydalanuvchini
                                 /login'ga yo'naltiradi)
```

---

## 6. Biznes-logika qisqacha

* **Daraja = "0 dan"** bo'lgan o'quvchi avtomatik ravishda kursi bo'yicha
  "pool"ga tushadi (`students.group_id is null and level = 0`).
* Pool **10 taga** yetganda dashboard'da "Guruh ochishga tayyor" ko'rinadi
  (`lib/data.ts` → `getPools()`). Guruh **avtomatik ochilmaydi**.
* Administrator "Telefon qilish" sahifasida har bir o'quvchiga natija
  belgilaydi (`call_results` jadvali, 1 o'quvchi = 1 joriy natija).
* "Kelaman" deganlar sonidan kelib chiqib, administrator **o'zi** "Guruhni
  ochish" tugmasini bosadi — bu yangi `groups` yozuvi yaratadi va faqat
  "Kelaman" deganlarni shu guruhga biriktiradi. Qolganlar (ko'tarmadi /
  kelmayman / keyinroq) guruhga **avtomatik o'tmaydi** va yangi o'quvchilar
  ro'yxatida qoladi.
* **Bilimi bor** (daraja ≠ 0) o'quvchiga tizim `min_level <= daraja <=
  max_level` shartiga mos, joyi bor faol guruhlarni ko'rsatadi
  (`getMatchingGroups`). Administrator mos guruhni tanlab qo'shadi.
* O'quvchini o'chirish — **soft delete** (`deleted_at`), "O'chirilganlar"
  bo'limida tiklash yoki butunlay o'chirish mumkin.
* Guruhdan chiqarilgan o'quvchining `group_id` shunchaki `null` qilinadi —
  ma'lumotlari saqlanadi, u yana yangi o'quvchi sifatida ko'rinadi.

---

## 7. Keyingi qadamlar (agar kerak bo'lsa)

Bu versiya ataylab sodda qilib qurilgan (CRM, to'lov, davomat, SMS va h.k.
qo'shilmagan — talabga ko'ra). Kelajakda kerak bo'lsa, quyidagilarni alohida
so'rov sifatida qo'shish mumkin: davomat jadvali, to'lov moduli, SMS/Telegram
xabarnomalari, kurslarni Sozlamalar sahifasidan boshqarish.
