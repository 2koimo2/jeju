-- Rework the persona survey: adds age_range and interest_area, replaces the
-- has_car question with a richer transport_mode question, expands
-- environmental_concern/delivery_frequency/consumption_tendency/energy_usage to
-- the new answer sets used by the redesigned survey form. Existing answers are
-- remapped to the closest new value rather than discarded; age_range and
-- interest_area have no historical equivalent so they're added as nullable
-- (the app always writes them together going forward, but old rows are left as-is
-- until the user retakes the survey).

-- ============ user_personas ============

alter table user_personas drop constraint if exists user_personas_occupation_check;
update user_personas set occupation = 'office' where occupation = 'field';
alter table user_personas add constraint user_personas_occupation_check
  check (occupation in ('student','office','homemaker','self_employed','other'));

alter table user_personas drop constraint if exists user_personas_has_car_check;
alter table user_personas rename column has_car to transport_mode;
update user_personas set transport_mode = case transport_mode
  when 'none' then 'public_transit'
  when 'occasional' then 'car'
  when 'daily' then 'car'
  else transport_mode
end;
alter table user_personas add constraint user_personas_transport_mode_check
  check (transport_mode in ('walk','bike','public_transit','car','motorcycle'));

alter table user_personas drop constraint if exists user_personas_environmental_concern_check;
alter table user_personas alter column environmental_concern type text using (
  case environmental_concern
    when 1 then 'low'
    when 2 then 'low'
    when 3 then 'sometimes'
    when 4 then 'high_but_hard'
    when 5 then 'very_high'
  end
);
alter table user_personas add constraint user_personas_environmental_concern_check
  check (environmental_concern in ('very_high','high_but_hard','sometimes','low','unsure'));

alter table user_personas drop constraint if exists user_personas_delivery_frequency_check;
update user_personas set delivery_frequency = case delivery_frequency
  when 'monthly' then 'weekly_1_2'
  when 'weekly' then 'weekly_3_4'
  when 'frequent' then 'weekly_5_plus'
  else delivery_frequency
end;
alter table user_personas add constraint user_personas_delivery_frequency_check
  check (delivery_frequency in ('rarely','weekly_1_2','weekly_3_4','weekly_5_plus'));

alter table user_personas drop constraint if exists user_personas_consumption_tendency_check;
update user_personas set consumption_tendency = case consumption_tendency
  when 'practical' then 'planned'
  when 'trendy' then 'discount_driven'
  else consumption_tendency
end;
alter table user_personas add constraint user_personas_consumption_tendency_check
  check (consumption_tendency in ('minimal','planned','discount_driven','impulsive'));

alter table user_personas drop constraint if exists user_personas_energy_usage_check;
alter table user_personas add constraint user_personas_energy_usage_check
  check (energy_usage in ('low','medium','high','unsure'));

alter table user_personas add column if not exists age_range text
  check (age_range in ('teens_or_under','twenties','thirties','forties','fifties_plus'));
alter table user_personas add column if not exists interest_area text
  check (interest_area in ('ocean_trash','sea_forest','marine_life','carbon'));

-- ============ survey_responses ============

alter table survey_responses drop constraint if exists survey_responses_occupation_check;
update survey_responses set occupation = 'office' where occupation = 'field';
alter table survey_responses add constraint survey_responses_occupation_check
  check (occupation in ('student','office','homemaker','self_employed','other'));

alter table survey_responses drop constraint if exists survey_responses_has_car_check;
alter table survey_responses rename column has_car to transport_mode;
update survey_responses set transport_mode = case transport_mode
  when 'none' then 'public_transit'
  when 'occasional' then 'car'
  when 'daily' then 'car'
  else transport_mode
end;
alter table survey_responses add constraint survey_responses_transport_mode_check
  check (transport_mode in ('walk','bike','public_transit','car','motorcycle'));

alter table survey_responses drop constraint if exists survey_responses_environmental_concern_check;
alter table survey_responses alter column environmental_concern type text using (
  case environmental_concern
    when 1 then 'low'
    when 2 then 'low'
    when 3 then 'sometimes'
    when 4 then 'high_but_hard'
    when 5 then 'very_high'
  end
);
alter table survey_responses add constraint survey_responses_environmental_concern_check
  check (environmental_concern in ('very_high','high_but_hard','sometimes','low','unsure'));

alter table survey_responses drop constraint if exists survey_responses_delivery_frequency_check;
update survey_responses set delivery_frequency = case delivery_frequency
  when 'monthly' then 'weekly_1_2'
  when 'weekly' then 'weekly_3_4'
  when 'frequent' then 'weekly_5_plus'
  else delivery_frequency
end;
alter table survey_responses add constraint survey_responses_delivery_frequency_check
  check (delivery_frequency in ('rarely','weekly_1_2','weekly_3_4','weekly_5_plus'));

alter table survey_responses drop constraint if exists survey_responses_consumption_tendency_check;
update survey_responses set consumption_tendency = case consumption_tendency
  when 'practical' then 'planned'
  when 'trendy' then 'discount_driven'
  else consumption_tendency
end;
alter table survey_responses add constraint survey_responses_consumption_tendency_check
  check (consumption_tendency in ('minimal','planned','discount_driven','impulsive'));

alter table survey_responses drop constraint if exists survey_responses_energy_usage_check;
alter table survey_responses add constraint survey_responses_energy_usage_check
  check (energy_usage in ('low','medium','high','unsure'));

alter table survey_responses add column if not exists age_range text
  check (age_range in ('teens_or_under','twenties','thirties','forties','fifties_plus'));
alter table survey_responses add column if not exists interest_area text
  check (interest_area in ('ocean_trash','sea_forest','marine_life','carbon'));
