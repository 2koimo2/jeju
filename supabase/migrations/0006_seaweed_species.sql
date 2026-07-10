-- Adds a species column to seaweed_characters so a user's starter seaweed (gifted
-- right after finishing the persona survey) has a fixed identity distinct from the
-- generic points/level progression. No insert policy is added for `authenticated` —
-- like growth crediting, the starter grant is a privileged write performed by the
-- server via the service-role client (see submitSurvey in src/app/(app)/survey/actions.ts),
-- not something a user's own session should be able to set directly.

alter table seaweed_characters add column if not exists species text
  check (species in ('miyeok','tot','parae','umutgasari','gamtae','mojaban'));
