-- 해초키우기: persona survey, AI-generated carbon-reduction missions,
-- photo proof + CV verification, and seaweed character growth.
-- Additive to 0001_seaweed_surveys.sql (unrelated marine survey data; not touched).

-- ============ survey / persona ============

create table if not exists survey_responses (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  environmental_concern smallint not null check (environmental_concern between 1 and 5),
  delivery_frequency text not null check (delivery_frequency in ('rarely','monthly','weekly','frequent')),
  occupation text not null check (occupation in ('student','office','field','self_employed','homemaker','other')),
  has_car text not null check (has_car in ('none','occasional','daily')),
  consumption_tendency text not null check (consumption_tendency in ('minimal','practical','trendy','impulsive')),
  disposable_item_frequency text not null check (disposable_item_frequency in ('rarely','sometimes','often','always')),
  energy_usage text not null check (energy_usage in ('low','medium','high')),
  recycling_frequency text not null check (recycling_frequency in ('always','usually','sometimes','rarely')),
  eco_action_score numeric(5,1) not null,
  footprint_score numeric(5,1) not null,
  persona_key text not null check (persona_key in ('green_master','eco_striver','quiet_minimalist','habit_builder')),
  submitted_at timestamptz not null default now()
);

alter table survey_responses enable row level security;

drop policy if exists "users can read own survey_responses" on survey_responses;
create policy "users can read own survey_responses" on survey_responses
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "users can insert own survey_responses" on survey_responses;
create policy "users can insert own survey_responses" on survey_responses
  for insert to authenticated with check (user_id = auth.uid());


create table if not exists user_personas (
  user_id uuid primary key references auth.users(id) on delete cascade,
  environmental_concern smallint not null check (environmental_concern between 1 and 5),
  delivery_frequency text not null check (delivery_frequency in ('rarely','monthly','weekly','frequent')),
  occupation text not null check (occupation in ('student','office','field','self_employed','homemaker','other')),
  has_car text not null check (has_car in ('none','occasional','daily')),
  consumption_tendency text not null check (consumption_tendency in ('minimal','practical','trendy','impulsive')),
  disposable_item_frequency text not null check (disposable_item_frequency in ('rarely','sometimes','often','always')),
  energy_usage text not null check (energy_usage in ('low','medium','high')),
  recycling_frequency text not null check (recycling_frequency in ('always','usually','sometimes','rarely')),
  eco_action_score numeric(5,1) not null,
  footprint_score numeric(5,1) not null,
  persona_key text not null check (persona_key in ('green_master','eco_striver','quiet_minimalist','habit_builder')),
  updated_at timestamptz not null default now()
);

alter table user_personas enable row level security;

drop policy if exists "users can read own user_personas" on user_personas;
create policy "users can read own user_personas" on user_personas
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "users can insert own user_personas" on user_personas;
create policy "users can insert own user_personas" on user_personas
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "users can update own user_personas" on user_personas;
create policy "users can update own user_personas" on user_personas
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());


-- ============ AI-generated missions ============
-- points/co2_saved_g are always server-clamped by difficulty band before insert
-- (src/lib/missions/scoring.ts); the check constraint below is defense-in-depth so the
-- same bounds hold even against a hand-crafted insert.

create table if not exists missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  batch_id uuid not null,
  persona_key text not null check (persona_key in ('green_master','eco_striver','quiet_minimalist','habit_builder')),
  title text not null,
  description text not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  points integer not null check (points > 0),
  co2_saved_g integer not null check (co2_saved_g >= 0),
  verification_instructions text not null,
  status text not null default 'active' check (status in ('active','completed')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint points_within_difficulty_band check (
    (difficulty = 'easy'   and points between 10 and 30  and co2_saved_g between 100  and 800) or
    (difficulty = 'medium' and points between 30 and 70  and co2_saved_g between 800  and 2500) or
    (difficulty = 'hard'   and points between 70 and 150 and co2_saved_g between 2500 and 8000)
  )
);

create index if not exists missions_user_expires_idx on missions (user_id, expires_at desc);

alter table missions enable row level security;

drop policy if exists "users can read own missions" on missions;
create policy "users can read own missions" on missions
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "users can insert own missions" on missions;
create policy "users can insert own missions" on missions
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "users can update own missions" on missions;
create policy "users can update own missions" on missions
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());


-- ============ mission proofs ============
-- Deliberately NO update policy: verdict/confidence/reasoning/verified_at are written
-- only by the service-role client after the AI call (src/utils/supabase/admin.ts).
-- Without this, a user could self-award a 'passed' verdict via a direct REST call to
-- PostgREST, bypassing verification entirely.

create table if not exists mission_proofs (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references missions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  photo_path text not null,
  verdict text not null default 'pending' check (verdict in ('pending','passed','failed','needs_review')),
  confidence numeric(3,2) check (confidence between 0 and 1),
  reasoning text,
  detected_elements jsonb,
  model_id text,
  submitted_at timestamptz not null default now(),
  verified_at timestamptz
);

create index if not exists mission_proofs_user_mission_idx on mission_proofs (user_id, mission_id);

alter table mission_proofs enable row level security;

drop policy if exists "users can read own mission_proofs" on mission_proofs;
create policy "users can read own mission_proofs" on mission_proofs
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "users can insert own pending mission_proofs" on mission_proofs;
create policy "users can insert own pending mission_proofs" on mission_proofs
  for insert to authenticated with check (user_id = auth.uid() and verdict = 'pending');


-- ============ growth ledger + character state ============
-- No insert/update policy on either table for the authenticated role: both are written
-- only by the service-role client via credit_mission_growth() below. This, plus
-- unique(mission_proof_id), makes point awarding impossible to trigger from outside a
-- verified mission proof, and impossible to double-credit even under retries.

create table if not exists growth_ledger (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_proof_id uuid not null unique references mission_proofs(id) on delete cascade,
  points_delta integer not null,
  co2_saved_g_delta integer not null,
  reason text not null default 'mission_verified',
  created_at timestamptz not null default now()
);

alter table growth_ledger enable row level security;

drop policy if exists "users can read own growth_ledger" on growth_ledger;
create policy "users can read own growth_ledger" on growth_ledger
  for select to authenticated using (user_id = auth.uid());


create table if not exists seaweed_characters (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_points integer not null default 0,
  total_co2_saved_g integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table seaweed_characters enable row level security;

drop policy if exists "users can read own seaweed_characters" on seaweed_characters;
create policy "users can read own seaweed_characters" on seaweed_characters
  for select to authenticated using (user_id = auth.uid());


-- ============ growth crediting ============
-- Invoked only from the service-role client, after that same connection has already
-- written a 'passed' verdict onto mission_proofs. security invoker is sufficient (not
-- definer) because the service-role connection already bypasses RLS; this function's
-- job is atomicity/idempotency of the credit, not access control.

create or replace function credit_mission_growth(p_mission_proof_id uuid)
returns void
language plpgsql
security invoker
as $$
declare
  v_user_id uuid;
  v_mission_id uuid;
  v_points integer;
  v_co2 integer;
  v_row_count integer;
begin
  select mp.user_id, mp.mission_id
    into v_user_id, v_mission_id
    from mission_proofs mp
    where mp.id = p_mission_proof_id and mp.verdict = 'passed';

  if v_user_id is null then
    raise exception 'mission_proof % not found or not passed', p_mission_proof_id;
  end if;

  select m.points, m.co2_saved_g into v_points, v_co2
    from missions m where m.id = v_mission_id;

  insert into growth_ledger (user_id, mission_proof_id, points_delta, co2_saved_g_delta)
  values (v_user_id, p_mission_proof_id, v_points, v_co2)
  on conflict (mission_proof_id) do nothing;

  get diagnostics v_row_count = row_count;

  if v_row_count > 0 then
    insert into seaweed_characters (user_id, total_points, total_co2_saved_g)
    values (v_user_id, v_points, v_co2)
    on conflict (user_id) do update
      set total_points = seaweed_characters.total_points + excluded.total_points,
          total_co2_saved_g = seaweed_characters.total_co2_saved_g + excluded.total_co2_saved_g,
          updated_at = now();

    update missions set status = 'completed' where id = v_mission_id;
  end if;
end;
$$;


-- ============ storage: mission proof photos ============
-- Private bucket, folder-per-user (<uid>/<missionId>/<file>). No update/delete policy:
-- submitted proof photos are immutable.

insert into storage.buckets (id, name, public)
values ('mission-proofs', 'mission-proofs', false)
on conflict (id) do nothing;

drop policy if exists "users can upload own mission proofs" on storage.objects;
create policy "users can upload own mission proofs"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'mission-proofs' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "users can read own mission proofs" on storage.objects;
create policy "users can read own mission proofs"
  on storage.objects for select to authenticated
  using (bucket_id = 'mission-proofs' and (storage.foldername(name))[1] = auth.uid()::text);
