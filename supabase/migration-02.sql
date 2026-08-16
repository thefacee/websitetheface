-- =============================================================
-- THE FACE — обновление 2: категории и настройки сайта
-- Выполнить один раз: Supabase → SQL Editor → New query → Run.
-- Повторный запуск безопасен.
-- =============================================================

-- ---------- КАТЕГОРИИ ----------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name_ru     text not null,
  name_hy     text,
  name_en     text,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Категория товара перестаёт быть жёстким списком из четырёх значений,
-- иначе новую категорию из админки нельзя было бы сохранить.
alter table public.products drop constraint if exists products_category_check;

insert into public.categories (slug, name_ru, name_hy, name_en, sort_order)
values
  ('table',     'Столы',      'Սեղաններ',   'Tables',      100),
  ('sculpture', 'Скульптуры', 'Քանդակներ',  'Sculptures',   90),
  ('accessory', 'Аксессуары', 'Աքսեսուարներ','Accessories',  80),
  ('lighting',  'Свет',       'Լույս',      'Lighting',     70)
on conflict (slug) do nothing;

-- ---------- НАСТРОЙКИ САЙТА ----------
create table if not exists public.settings (
  key        text primary key,
  value_ru   text,
  value_hy   text,
  value_en   text,
  updated_at timestamptz not null default now()
);

-- Контакты хранятся одной строкой в value_ru, тексты — на трёх языках.
insert into public.settings (key, value_ru, value_hy, value_en) values
  ('contact_phone',     '', null, null),
  ('contact_whatsapp',  '', null, null),
  ('contact_email',     'hello@theface.am', null, null),
  ('contact_instagram', 'https://www.instagram.com/the.face_official', null, null),
  ('contact_address',   '', '', ''),
  ('hero_kicker',       '', '', ''),
  ('hero_title',        '', '', ''),
  ('hero_title_accent', '', '', ''),
  ('hero_subtitle',     '', '', ''),
  ('marquee',           '', '', ''),
  ('footer_tagline',    '', '', '')
on conflict (key) do nothing;

-- ---------- ПРАВА ДОСТУПА ----------
alter table public.categories enable row level security;
alter table public.settings   enable row level security;

drop policy if exists "public reads categories" on public.categories;
create policy "public reads categories"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "authenticated manages categories" on public.categories;
create policy "authenticated manages categories"
  on public.categories for all
  to authenticated
  using (true) with check (true);

drop policy if exists "public reads settings" on public.settings;
create policy "public reads settings"
  on public.settings for select
  to anon, authenticated
  using (true);

drop policy if exists "authenticated manages settings" on public.settings;
create policy "authenticated manages settings"
  on public.settings for all
  to authenticated
  using (true) with check (true);
