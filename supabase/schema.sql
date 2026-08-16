-- =============================================================
-- THE FACE — Supabase schema
-- Run this once in Supabase Dashboard > SQL Editor > New query
-- =============================================================

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name_hy       text not null,
  name_ru       text,
  name_en       text,
  description_hy text,
  description_ru text,
  description_en text,
  category      text not null default 'table'
                check (category in ('table','sculpture','accessory','lighting')),
  material      text,
  dimensions    text,
  weight_kg     numeric,
  price         numeric,
  currency      text default 'AMD',
  status        text not null default 'available'
                check (status in ('available','made_to_order','sold')),
  images        text[] not null default '{}',
  is_featured   boolean not null default false,
  is_published  boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists products_published_idx on public.products (is_published, sort_order desc, created_at desc);
create index if not exists products_category_idx  on public.products (category);

-- ---------- INQUIRIES ----------
create table if not exists public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  type          text not null default 'product'
                check (type in ('product','custom','contact')),
  name          text not null,
  contact       text not null,
  message       text,
  product_id    uuid references public.products(id) on delete set null,
  product_title text,
  locale        text,
  custom_stone  text,
  custom_size   text,
  custom_finish text,
  custom_budget text,
  status        text not null default 'new'
                check (status in ('new','in_progress','done')),
  created_at    timestamptz not null default now()
);

create index if not exists inquiries_created_idx on public.inquiries (created_at desc);

-- ---------- ROW LEVEL SECURITY ----------
alter table public.products  enable row level security;
alter table public.inquiries enable row level security;

drop policy if exists "public reads published products" on public.products;
create policy "public reads published products"
  on public.products for select
  to anon, authenticated
  using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "authenticated manages products" on public.products;
create policy "authenticated manages products"
  on public.products for all
  to authenticated
  using (true) with check (true);

drop policy if exists "anyone can send an inquiry" on public.inquiries;
create policy "anyone can send an inquiry"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

drop policy if exists "authenticated reads inquiries" on public.inquiries;
create policy "authenticated reads inquiries"
  on public.inquiries for select
  to authenticated
  using (true);

drop policy if exists "authenticated updates inquiries" on public.inquiries;
create policy "authenticated updates inquiries"
  on public.inquiries for update
  to authenticated
  using (true) with check (true);

drop policy if exists "authenticated deletes inquiries" on public.inquiries;
create policy "authenticated deletes inquiries"
  on public.inquiries for delete
  to authenticated
  using (true);

-- ---------- STORAGE BUCKET FOR IMAGES ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public reads product images" on storage.objects;
create policy "public reads product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "authenticated uploads product images" on storage.objects;
create policy "authenticated uploads product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "authenticated updates product images" on storage.objects;
create policy "authenticated updates product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "authenticated deletes product images" on storage.objects;
create policy "authenticated deletes product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
