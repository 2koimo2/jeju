-- seaweed_surveys and species_ratio_demo were only granted select to the
-- anon role, so authenticated app users (the normal case) couldn't read
-- either table and the 제주 리포트 tab always looked empty. Grant both
-- roles instead.
drop policy if exists "public can read seaweed_surveys" on seaweed_surveys;
create policy "public can read seaweed_surveys" on seaweed_surveys
  for select to anon, authenticated using (true);

drop policy if exists "public can read species_ratio_demo" on species_ratio_demo;
create policy "public can read species_ratio_demo" on species_ratio_demo
  for select to anon, authenticated using (true);
