/* QURAL-SAIMAN — схема Supabase (Postgres).
   Запуск: Supabase Dashboard → SQL Editor → New query → вставить целиком → Run.
   Мультиязычность заложена: поля *_kz заполняются позже, фронт падает на RU при пустом значении. */

create extension if not exists "uuid-ossp";

/* ---------- Справочники ---------- */

create table families (
  id          text primary key,              -- 'concrete', 'cut', 'finish', 'power', 'site'
  name        text not null,
  name_kz     text,
  sort        int  not null default 0
);

create table categories (
  id          text primary key,              -- 'gen-petrol', 'towers', ...
  family_id   text not null references families(id) on delete restrict,
  name        text not null,
  name_kz     text,
  short       text not null,                 -- короткое имя для чипов и табов
  short_kz    text,
  icon        text not null,                 -- имя иконки lucide
  sort        int  not null default 0,
  created_at  timestamptz not null default now()
);

/* ---------- Инструменты ---------- */

create type power_type as enum ('Ручной','Электрический','Бензиновый','Дизельный','Пневматический');

create table tools (
  id            uuid primary key default uuid_generate_v4(),
  slug          text not null unique,        -- 'alteco-apg-9800-te' — используется в URL /product/[slug]
  category_id   text not null references categories(id) on delete restrict,
  name          text not null,
  name_kz       text,
  spec          text,                        -- краткое описание в карточке
  spec_kz       text,
  brand         text,
  power         power_type,
  price         int not null,                -- ₸ за сутки
  deposit       int,                         -- залог, ₸
  price_note    text,                        -- 'от 2 600 (1,2 м) до 5 000 (6,0 м)'
  price_note_kz text,
  discount_rule text default 'standard',     -- 'standard' | 'none' | json со своей сеткой
  photo_path    text,                        -- путь в Supabase Storage, бакет 'tools'
  badge         text,                        -- 'Новинка', 'Хит' и т.п.
  is_top        boolean not null default false,   -- блок «Часто берут»
  is_published  boolean not null default true,
  sort          int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

/* Наличия на складе в базе НЕТ: остатки ведутся в 1С и на сайт не выводятся.
   Сайт работает как меню — клиент смотрит позиции и цены, заявка уходит в WhatsApp. */

create index tools_category_idx on tools(category_id);
create index tools_published_idx on tools(is_published) where is_published;
create index tools_search_idx on tools using gin (to_tsvector('russian', name || ' ' || coalesce(brand,'') || ' ' || coalesce(spec,'')));

/* ---------- Генераторы ДГУ (отдельный раздел, своя логика) ---------- */

create table generators (
  id            uuid primary key default uuid_generate_v4(),
  slug          text not null unique,
  name          text not null,
  name_kz       text,
  kw            numeric(6,1) not null,       -- мощность, кВт — основной фильтр раздела
  spec          text,
  spec_kz       text,
  brand         text,
  price         int,                         -- null = «по запросу»
  price_note    text,
  photo_path    text,
  is_published  boolean not null default true,
  sort          int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index generators_kw_idx on generators(kw);

/* ---------- Скидки за длительную аренду ---------- */

create table discount_tiers (
  id        serial primary key,
  min_days  int not null,                    -- 7, 30
  percent   int not null,                    -- 10, 20
  label     text not null,
  label_kz  text
);

insert into discount_tiers (min_days, percent, label) values
  (7,  10, 'От 7 дней — 10%'),
  (30, 20, 'От 30 дней — 20%');

/* ---------- updated_at ---------- */

create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end $$ language plpgsql;

create trigger tools_touch      before update on tools      for each row execute function touch_updated_at();
create trigger generators_touch before update on generators for each row execute function touch_updated_at();

/* ---------- RLS: читают все, пишет только владелец ----------
   Один администратор (владелец). Его uid берём из auth.users после первого входа
   и прописываем в таблицу admins. */

create table admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email   text not null
);

alter table families       enable row level security;
alter table categories     enable row level security;
alter table tools          enable row level security;
alter table generators     enable row level security;
alter table discount_tiers enable row level security;

create policy "public read families"   on families       for select using (true);
create policy "public read categories" on categories     for select using (true);
create policy "public read tools"      on tools          for select using (is_published);
create policy "public read generators" on generators     for select using (is_published);
create policy "public read discounts"  on discount_tiers for select using (true);

create policy "admin all families"   on families       for all using (exists (select 1 from admins a where a.user_id = auth.uid()));
create policy "admin all categories" on categories     for all using (exists (select 1 from admins a where a.user_id = auth.uid()));
create policy "admin all tools"      on tools          for all using (exists (select 1 from admins a where a.user_id = auth.uid()));
create policy "admin all generators" on generators     for all using (exists (select 1 from admins a where a.user_id = auth.uid()));
create policy "admin all discounts"  on discount_tiers for all using (exists (select 1 from admins a where a.user_id = auth.uid()));

/* ---------- Storage ----------
   Создать бакет 'tools' (public read). Политика записи — только admins.
   Пути: tools/<slug>.png, generators/<slug>.png */
