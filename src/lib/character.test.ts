import { describe, expect, it } from "vitest";
import { levelForPoints, stageForLevel, thresholdForLevel } from "./character";

describe("thresholdForLevel", () => {
  it("is 0 at level 1 and strictly increasing", () => {
    expect(thresholdForLevel(1)).toBe(0);
    for (let level = 1; level < 20; level++) {
      expect(thresholdForLevel(level + 1)).toBeGreaterThan(
        thresholdForLevel(level),
      );
    }
  });
});

describe("levelForPoints", () => {
  it("starts at level 1 with 0 points", () => {
    const result = levelForPoints(0);
    expect(result.level).toBe(1);
    expect(result.pointsIntoLevel).toBe(0);
    expect(result.pointsForNextLevel).toBe(thresholdForLevel(2));
  });

  it("crosses into the next level exactly at its threshold, not one point before", () => {
    for (const level of [2, 3, 6, 10]) {
      const threshold = thresholdForLevel(level);
      expect(levelForPoints(threshold).level).toBeGreaterThanOrEqual(level);
      expect(levelForPoints(threshold - 1).level).toBeLessThan(level);
    }
  });

  it("reports consistent pointsIntoLevel/pointsForNextLevel", () => {
    const result = levelForPoints(thresholdForLevel(5) + 3);
    expect(result.level).toBe(5);
    expect(result.pointsIntoLevel).toBe(3);
    expect(result.pointsForNextLevel).toBe(
      thresholdForLevel(6) - thresholdForLevel(5),
    );
  });
});

describe("stageForLevel", () => {
  it("buckets levels into the four seaweed stages", () => {
    expect(stageForLevel(1)).toBe("sprout");
    expect(stageForLevel(2)).toBe("sprout");
    expect(stageForLevel(3)).toBe("juvenile");
    expect(stageForLevel(5)).toBe("juvenile");
    expect(stageForLevel(6)).toBe("mature");
    expect(stageForLevel(9)).toBe("mature");
    expect(stageForLevel(10)).toBe("forest");
    expect(stageForLevel(50)).toBe("forest");
  });
});
