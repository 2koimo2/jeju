import { describe, expect, it } from "vitest";
import { DIFFICULTY_BANDS, clampToDifficultyBand } from "./scoring";

describe("clampToDifficultyBand", () => {
  it("passes values through unchanged when already inside the band", () => {
    expect(clampToDifficultyBand("medium", 50, 1500)).toEqual({
      points: 50,
      co2SavedG: 1500,
    });
  });

  it("clamps values below the band up to the minimum", () => {
    expect(clampToDifficultyBand("hard", 1, 1)).toEqual({
      points: DIFFICULTY_BANDS.hard.points[0],
      co2SavedG: DIFFICULTY_BANDS.hard.co2SavedG[0],
    });
  });

  it("clamps values above the band down to the maximum", () => {
    expect(clampToDifficultyBand("easy", 999999, 999999)).toEqual({
      points: DIFFICULTY_BANDS.easy.points[1],
      co2SavedG: DIFFICULTY_BANDS.easy.co2SavedG[1],
    });
  });

  it("always returns integers", () => {
    const result = clampToDifficultyBand("medium", 33.7, 1200.2);
    expect(Number.isInteger(result.points)).toBe(true);
    expect(Number.isInteger(result.co2SavedG)).toBe(true);
  });
});
