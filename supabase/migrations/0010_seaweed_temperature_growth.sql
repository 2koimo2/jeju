-- Ocean-temperature growth system for the home screen character. Temperature
-- rises passively over real time (1C/hour, capped at 40) and only missions
-- cool it back down (easy -5C, hard -10C, floored at 10). The growth rate
-- (how fast level_progress accumulates towards the next level) depends on
-- which band the temperature is currently in:
--   10-20C -> 1 level per 4h, 20-30C -> 1 level per 8h, 30C+ -> no growth.
-- level_progress is capped at 19 so the derived level (1 + floor(progress))
-- never exceeds the level-20 cap. This is a lazy/analytic simulation — we
-- never need a cron job, because degrees and hours are equivalent at a 1C/hr
-- rise rate, so "hours spent in a band" collapses to a plain min/max on the
-- temperature values themselves (see src/lib/seaweed-growth.ts for the same
-- math in TypeScript, used to render the current state without writing).

alter table seaweed_characters
  add column if not exists temperature_c double precision not null default 40,
  add column if not exists temp_updated_at timestamptz not null default now(),
  add column if not exists level_progress double precision not null default 0;

alter table seaweed_characters drop constraint if exists seaweed_characters_temperature_c_check;
alter table seaweed_characters add constraint seaweed_characters_temperature_c_check
  check (temperature_c between 10 and 40);

alter table seaweed_characters drop constraint if exists seaweed_characters_level_progress_check;
alter table seaweed_characters add constraint seaweed_characters_level_progress_check
  check (level_progress between 0 and 19);

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
  v_difficulty text;
  v_row_count integer;
  v_temp double precision;
  v_temp_updated_at timestamptz;
  v_level_progress double precision;
  v_dt_hours double precision;
  v_hours_fast double precision;
  v_hours_slow double precision;
  v_natural_temp double precision;
  v_drop double precision;
begin
  select mp.user_id, mp.mission_id
    into v_user_id, v_mission_id
    from mission_proofs mp
    where mp.id = p_mission_proof_id and mp.verdict = 'passed';

  if v_user_id is null then
    raise exception 'mission_proof % not found or not passed', p_mission_proof_id;
  end if;

  select m.points, m.co2_saved_g, m.difficulty into v_points, v_co2, v_difficulty
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

    select temperature_c, temp_updated_at, level_progress
      into v_temp, v_temp_updated_at, v_level_progress
      from seaweed_characters where user_id = v_user_id;

    v_dt_hours := greatest(0, extract(epoch from (now() - v_temp_updated_at)) / 3600.0);
    v_hours_fast := greatest(0, least(v_temp + v_dt_hours, 20) - greatest(v_temp, 10));
    v_hours_slow := greatest(0, least(v_temp + v_dt_hours, 30) - greatest(v_temp, 20));
    v_natural_temp := least(40, v_temp + v_dt_hours);
    v_drop := case v_difficulty when 'easy' then 5 when 'hard' then 10 else 0 end;

    update seaweed_characters
      set temperature_c = greatest(10, v_natural_temp - v_drop),
          temp_updated_at = now(),
          level_progress = least(19, v_level_progress + v_hours_fast / 4.0 + v_hours_slow / 8.0)
      where user_id = v_user_id;
  end if;
end;
$$;
