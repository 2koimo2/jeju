import { describe, expect, it } from "vitest";
import { DIFFICULTY_BANDS, clampToDifficultyBand } from "./scoring";

describe("clampToDifficultyBand", () => {
  it("passes values through unchanged when already inside the band", () => {
    expect(clampToDifficultyBand("hard", 100, 3000)).toEqual({
      points: 100,
      co2SavedG: 3000,
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
    const result = clampToDifficultyBand("easy", 15.7, 300.2);
    expect(Number.isInteger(result.points)).toBe(true);
    expect(Number.isInteger(result.co2SavedG)).toBe(true);
  });
});
