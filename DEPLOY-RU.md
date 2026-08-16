# THE FACE — выкладка на домен theface.am

Всё, что нужно скопировать, собрано здесь. Порядок: GitHub → Vercel → домен.

---

## 1. Код на GitHub

Проект уже готов к отправке (git-репозиторий создан, первый коммит сделан).

1. Зайдите на https://github.com/new → имя `theface` → **Private** → **Create repository**.
2. GitHub покажет строчки для существующего проекта. Выполните в папке
   `C:\Users\Armen\Desktop\theface1\theface`:

```bash
git remote add origin https://github.com/ВАШ_ЛОГИН/theface.git
git branch -M main
git push -u origin main
```

Файл `.env.local` с ключами в репозиторий **не уходит** — он в `.gitignore`.

---

## 2. Vercel

1. https://vercel.com → **Continue with GitHub** → **Add New → Project** → выберите `theface`.
2. Framework Next.js определится сам, ничего менять не нужно.
3. Раскройте **Environment Variables** и добавьте семь строк:

```
NEXT_PUBLIC_SUPABASE_URL       = https://gxivazhqijykurkytqzl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY  = sb_publishable_YNdzw-Ot9oUfIimQpP_0Kw_jjRQ7B5Y
NEXT_PUBLIC_SITE_URL           = https://theface.am
NEXT_PUBLIC_PHONE              = +374 XX XXX XXX
NEXT_PUBLIC_WHATSAPP           = 374XXXXXXXX
NEXT_PUBLIC_EMAIL              = hello@theface.am
NEXT_PUBLIC_INSTAGRAM          = https://www.instagram.com/the.face_official
```

Телефон и WhatsApp подставьте настоящие: WhatsApp — только цифры с кодом страны,
без плюса и пробелов.

4. **Deploy**. Через пару минут сайт откроется по адресу вида `theface.vercel.app`.

---

## 3. Домен

1. Купите `theface.am` — **abcdomain.am** или **internet.am**.
2. В Vercel: **Settings → Domains → Add** → `theface.am`.
3. Vercel покажет DNS-записи. Обычно:
   - `A` для `@` → `76.76.21.21`
   - `CNAME` для `www` → `cname.vercel-dns.com`
   Точные значения берите из экрана Vercel, а не отсюда.
4. Пропишите их в панели регистратора. Обновление занимает от 15 минут до суток.
5. Когда домен заработает, вернитесь в Supabase →
   **Authentication → URL Configuration** → **Site URL** поставьте `https://theface.am`.

---

## 4. После запуска

- Админка живёт по адресу `https://theface.am/admin`.
- Новые товары добавляются только через админку — код трогать не нужно.
- Заявки с сайта падают в `/admin/inquiries`.
- Чтобы поменять тексты страниц, правьте `src/i18n/ru.ts`, `hy.ts`, `en.ts`,
  затем `git push` — Vercel пересоберёт сайт сам.

---

## 5. Что стоит сделать в первую неделю

- Заменить телефон-заглушку на настоящий (переменные в Vercel).
- Загрузить в админку фото остальных работ из Instagram.
- Добавить `theface.am` в шапку профиля Instagram.
- Проверить сайт с телефона: главная, каталог, отправка заявки.
