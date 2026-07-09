-- full_name and gender are now collected in separate onboarding steps
-- (name screen, then gender screen), so a profile row can briefly exist
-- with full_name set and gender still unset.

alter table profiles alter column gender drop not null;

alter table profiles drop constraint if exists profiles_gender_check;
alter table profiles add constraint profiles_gender_check
  check (gender is null or gender in ('male', 'female', 'unspecified'));
