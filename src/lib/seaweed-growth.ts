import { COLLECTION_STAGE_LEVELS } from "@/lib/character";

export const MIN_TEMP_C = 10;
export const MAX_TEMP_C = 40;
export const FAST_BAND_HOURS_PER_LEVEL = 4; // 10-20C
export const SLOW_BAND_HOURS_PER_LEVEL = 8; // 20-30C
export const MAX_LEVEL = 20;
export const MAX_LEVEL_PROGRESS = MAX_LEVEL - 1;

export const MISSION_TEMP_DROP_C: Record<"easy" | "hard", number> = {
  easy: 5,
  hard: 10,
};

export type GrowthState = {
  temperatureC: number;
  tempUpdatedAt: Date;
  levelProgress: number;
};

export type GrowthSnapshot = {
  temperatureC: number;
  level: number;
  levelProgress: number;
  stageIndex: number;
};

/**
 * Temperature rises at a fixed 1C/hour, so "hours spent in a band" between two
 * points in time collapses to a plain min/max over the temperature values
 * themselves — no iteration needed. This mirrors credit_mission_growth's SQL
 * in supabase/migrations/0009_seaweed_temperature_growth.sql exactly; it's
 * used here only to render the *current* state, never to persist it (the DB
 * function is the only writer).
 */
export function simulateGrowth(
  state: GrowthState,
  now: Date = new Date(),
): GrowthSnapshot {
  const dtHours = Math.max(
    0,
    (now.getTime() - state.tempUpdatedAt.getTime()) / 3_600_000,
  );
  const t0 = state.temperatureC;

  const hoursFast = Math.max(0, Math.min(t0 + dtHours, 20) - Math.max(t0, 10));
  const hoursSlow = Math.max(0, Math.min(t0 + dtHours, 30) - Math.max(t0, 20));

  const levelProgress = Math.min(
    MAX_LEVEL_PROGRESS,
    state.levelProgress +
      hoursFast / FAST_BAND_HOURS_PER_LEVEL +
      hoursSlow / SLOW_BAND_HOURS_PER_LEVEL,
  );
  const temperatureC = Math.min(MAX_TEMP_C, t0 + dtHours);
  const level = Math.min(MAX_LEVEL, 1 + Math.floor(levelProgress));

  return { temperatureC, level, levelProgress, stageIndex: stageIndexForLevel(level) };
}

/** Highest COLLECTION_STAGE_LEVELS threshold the level has reached, as an index. */
export function stageIndexForLevel(level: number): number {
  let index = 0;
  for (let i = 0; i < COLLECTION_STAGE_LEVELS.length; i++) {
    if (level >= COLLECTION_STAGE_LEVELS[i]) index = i;
  }
  return index;
}
