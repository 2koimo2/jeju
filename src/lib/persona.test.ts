import { describe, expect, it } from "vitest";
import { computePersona, type SurveyAnswers } from "./persona";

const base: SurveyAnswers = {
  environmentalConcern: 3,
  deliveryFrequency: "monthly",
  occupation: "office",
  hasCar: "none",
  consumptionTendency: "practical",
  disposableItemFrequency: "sometimes",
  energyUsage: "medium",
  recyclingFrequency: "usually",
};

describe("computePersona", () => {
  it("maps high eco-action + low footprint to green_master", () => {
    const result = computePersona({
      ...base,
      environmentalConcern: 5,
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
      environmentalConcern: 5,
      recyclingFrequency: "always",
      disposableItemFrequency: "rarely",
      deliveryFrequency: "frequent",
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
      environmentalConcern: 1,
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
      environmentalConcern: 1,
      recyclingFrequency: "rarely",
      disposableItemFrequency: "always",
      deliveryFrequency: "frequent",
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
      environmentalConcern: 3,
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
});
