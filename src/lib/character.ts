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
