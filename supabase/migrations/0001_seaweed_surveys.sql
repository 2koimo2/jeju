create table if not exists seaweed_surveys (
  id bigint generated always as identity primary key,
  location text not null,
  survey_date date not null,
  class_gbn text,
  coverage_by_category jsonb not null,
  total_seaweed_pct numeric not null,
  source_file text,
  created_at timestamptz not null default now()
);

alter table seaweed_surveys enable row level security;

drop policy if exists "public can read seaweed_surveys" on seaweed_surveys;
create policy "public can read seaweed_surveys" on seaweed_surveys
  for select to anon using (true);
