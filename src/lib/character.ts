const BASE_POINTS_PER_LEVEL = 30;
const LEVEL_CURVE_EXPONENT = 1.6;

/** Cumulative points required to reach `level`. Superlinear so leveling slows down. */
export function thresholdForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(
    BASE_POINTS_PER_LEVEL * Math.pow(level - 1, LEVEL_CURVE_EXPONENT),
  );
}

export type SeaweedStage = "sprout" | "juvenile" | "mature" | "forest";

export function stageForLevel(level: number): SeaweedStage {
  if (level <= 2) return "sprout";
  if (level <= 5) return "juvenile";
  if (level <= 9) return "mature";
  return "forest";
}

export type CharacterProgress = {
  level: number;
  stage: SeaweedStage;
  pointsIntoLevel: number;
  pointsForNextLevel: number;
};

/** Pure derivation of level/stage from a lifetime points total — never stored directly. */
export function levelForPoints(totalPoints: number): CharacterProgress {
  let level = 1;
  while (thresholdForLevel(level + 1) <= totalPoints) {
    level += 1;
  }
  const currentThreshold = thresholdForLevel(level);
  const nextThreshold = thresholdForLevel(level + 1);
  return {
    level,
    stage: stageForLevel(level),
    pointsIntoLevel: totalPoints - currentThreshold,
    pointsForNextLevel: nextThreshold - currentThreshold,
  };
}

/**
 * Static display tiers for the 도감 Lv.1/4/12/20 stage row. There's no real
 * per-species leveling yet (each user owns exactly one species instance), so this is
 * purely a UI ladder compared against levelForPoints(totalPoints).level for the
 * user's owned species — not tied to thresholdForLevel's growth curve.
 */
export const COLLECTION_STAGE_LEVELS = [1, 4, 12, 20] as const;
