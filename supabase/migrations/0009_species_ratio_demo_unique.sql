-- Prevent the fix-policy SQL (or a future re-run of 0007) from silently
-- duplicating rows: re-running the earlier migration's insert 3x left 15
-- rows instead of 5, since there was no uniqueness guard.
alter table species_ratio_demo
  add constraint species_ratio_demo_species_key unique (species);
