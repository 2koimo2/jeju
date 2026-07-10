import { describe, expect, it } from "vitest";
import { computePersona, type SurveyAnswers } from "./persona";

const base: SurveyAnswers = {
  ageRange: "thirties",
  environmentalConcern: "sometimes",
  occupation: "office",
  transportMode: "public_transit",
  deliveryFrequency: "weekly_1_2",
  consumptionTendency: "planned",
  disposableItemFrequency: "sometimes",
  energyUsage: "medium",
  recyclingFrequency: "usually",
  interestArea: "carbon",
};

describe("computePersona", () => {
  it("maps high eco-action + low footprint to green_master", () => {
    const result = computePersona({
      ...base,
      environmentalConcern: "very_high",
      recyclingFrequency: "always",
      disposableItemFrequency: "rarely",
      deliveryFrequency: "rarely",
      energyUsage: "low",
      consumptionTendency: "minimal",
    });
    expect(result.ecoActionScore).toBe(100);
    expect(result.footprintScore).toBe(0);
    expect(result.personaKey).toBe("green_master");
  });

  it("maps high eco-action + high footprint to eco_striver", () => {
    const result = computePersona({
      ...base,
      environmentalConcern: "very_high",
      recyclingFrequency: "always",
      disposableItemFrequency: "rarely",
      deliveryFrequency: "weekly_5_plus",
      energyUsage: "high",
      consumptionTendency: "impulsive",
    });
    expect(result.ecoActionScore).toBe(100);
    expect(result.footprintScore).toBe(100);
    expect(result.personaKey).toBe("eco_striver");
  });

  it("maps low eco-action + low footprint to quiet_minimalist", () => {
    const result = computePersona({
      ...base,
      environmentalConcern: "low",
      recyclingFrequency: "rarely",
      disposableItemFrequency: "always",
      deliveryFrequency: "rarely",
      energyUsage: "low",
      consumptionTendency: "minimal",
    });
    expect(result.ecoActionScore).toBe(0);
    expect(result.footprintScore).toBe(0);
    expect(result.personaKey).toBe("quiet_minimalist");
  });

  it("maps low eco-action + high footprint to habit_builder", () => {
    const result = computePersona({
      ...base,
      environmentalConcern: "low",
      recyclingFrequency: "rarely",
      disposableItemFrequency: "always",
      deliveryFrequency: "weekly_5_plus",
      energyUsage: "high",
      consumptionTendency: "impulsive",
    });
    expect(result.ecoActionScore).toBe(0);
    expect(result.footprintScore).toBe(100);
    expect(result.personaKey).toBe("habit_builder");
  });

  it("treats a tie at the score=50 boundary as 'high' on both axes", () => {
    const result = computePersona({
      ...base,
      environmentalConcern: "unsure",
      recyclingFrequency: "always",
      disposableItemFrequency: "always",
      deliveryFrequency: "rarely",
      energyUsage: "medium",
      consumptionTendency: "impulsive",
    });
    expect(result.ecoActionScore).toBe(50);
    expect(result.footprintScore).toBe(50);
    expect(result.personaKey).toBe("eco_striver");
  });

  it("scores 'unsure' concern/energy answers as a neutral 50, distinct from the low end", () => {
    const result = computePersona({
      ...base,
      environmentalConcern: "unsure",
      recyclingFrequency: "rarely",
      disposableItemFrequency: "always",
      deliveryFrequency: "rarely",
      energyUsage: "unsure",
      consumptionTendency: "minimal",
    });
    // concern(50) + sorting(0) + disposable(0) = mean 17; energy(50) folds into footprint too.
    expect(result.ecoActionScore).toBeGreaterThan(0);
    expect(result.footprintScore).toBeGreaterThan(0);
  });
});
