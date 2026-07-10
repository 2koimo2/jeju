export type Difficulty = "easy" | "hard";

/**
 * Must stay within the `points_within_difficulty_band` check constraint in
 * supabase/migrations/0002_grow_a_seaweed.sql. That constraint still also
 * allows the retired 'medium' band so old rows remain valid — new missions
 * are just never generated with it anymore.
 */
export const DIFFICULTY_BANDS: Record<
  Difficulty,
  { points: [number, number]; co2SavedG: [number, number] }
> = {
  easy: { points: [10, 30], co2SavedG: [100, 800] },
  hard: { points: [70, 150], co2SavedG: [2500, 8000] },
};

const clamp = (value: number, [min, max]: [number, number]) =>
  Math.round(Math.min(Math.max(value, min), max));

/**
 * The AI suggests points/CO2 values when it generates a mission, but they're never
 * trusted directly — always passed through this clamp before being written to the DB.
 */
export function clampToDifficultyBand(
  difficulty: Difficulty,
  suggestedPoints: number,
  suggestedCo2SavedG: number,
): { points: number; co2SavedG: number } {
  const band = DIFFICULTY_BANDS[difficulty];
  return {
    points: clamp(suggestedPoints, band.points),
    co2SavedG: clamp(suggestedCo2SavedG, band.co2SavedG),
  };
}
