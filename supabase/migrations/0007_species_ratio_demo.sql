-- Species composition for the "종류별 비율" report donut. Kept separate from
-- seaweed_surveys so this demo/approximate breakdown never gets pulled into
-- the real weekly-aggregate or expansion-trend queries.
--
-- 감태/모자반 map directly to the hyperspectral pipeline's 감태류/모자반류
-- categories. 미역/파래 are approximate (나래미역류 is a subspecies of 미역;
-- 갈파래류 is the same family as 파래 but a different species). 우뭇가사리
-- has no matching category anywhere in the AI Hub classification taxonomy,
-- so its value is a dummy placeholder. 톳 is excluded entirely — it has no
-- classification support at all.
create table if not exists species_ratio_demo (
  id bigint generated always as identity primary key,
  species text not null check (species in ('umutgasari','gamtae','parae','miyeok','mojaban')),
  pct numeric not null check (pct >= 0 and pct <= 100),
  source text not null check (source in ('hyperspectral','hyperspectral_approx','dummy')),
  updated_at timestamptz not null default now()
);

alter table species_ratio_demo enable row level security;

drop policy if exists "public can read species_ratio_demo" on species_ratio_demo;
create policy "public can read species_ratio_demo" on species_ratio_demo
  for select to anon, authenticated using (true);

insert into species_ratio_demo (species, pct, source) values
  ('gamtae', 44, 'hyperspectral'),
  ('mojaban', 37, 'hyperspectral'),
  ('miyeok', 8, 'hyperspectral_approx'),
  ('parae', 7, 'hyperspectral_approx'),
  ('umutgasari', 4, 'dummy');
