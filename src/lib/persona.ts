import { z } from "zod";

export const surveyAnswersSchema = z.object({
  ageRange: z.enum([
    "teens_or_under",
    "twenties",
    "thirties",
    "forties",
    "fifties_plus",
  ]),
  environmentalConcern: z.enum([
    "very_high",
    "high_but_hard",
    "sometimes",
    "low",
    "unsure",
  ]),
  occupation: z.enum(["student", "office", "homemaker", "self_employed", "other"]),
  transportMode: z.enum([
    "walk",
    "bike",
    "public_transit",
    "car",
    "motorcycle",
  ]),
  deliveryFrequency: z.enum([
    "rarely",
    "weekly_1_2",
    "weekly_3_4",
    "weekly_5_plus",
  ]),
  consumptionTendency: z.enum([
    "minimal",
    "planned",
    "discount_driven",
    "impulsive",
  ]),
  disposableItemFrequency: z.enum([
    "rarely",
    "sometimes",
    "often",
    "always",
  ]),
  energyUsage: z.enum(["low", "medium", "high", "unsure"]),
  recyclingFrequency: z.enum(["always", "usually", "sometimes", "rarely"]),
  interestArea: z.enum([
    "ocean_trash",
    "sea_forest",
    "marine_life",
    "carbon",
  ]),
});

export type SurveyAnswers = z.infer<typeof surveyAnswersSchema>;

export const PERSONA_KEYS = [
  "green_master",
  "eco_striver",
  "quiet_minimalist",
  "habit_builder",
] as const;

export type PersonaKey = (typeof PERSONA_KEYS)[number];

export const PERSONA_DEFS: Record<
  PersonaKey,
  { label: string; description: string }
> = {
  green_master: {
    label: "그린 마스터",
    description:
      "환경 인식이 높고 소비/에너지 발자국도 작아 이미 친환경 습관이 자리 잡힌 편. 더 도전적이고 심화된 미션이 적합.",
  },
  eco_striver: {
    label: "노력형",
    description:
      "환경에 대한 관심은 높지만 배달·소비·에너지 사용에서 발자국이 큰 편. 관심을 실제 행동으로 옮기는 구체적 미션이 적합.",
  },
  quiet_minimalist: {
    label: "조용한 미니멀리스트",
    description:
      "환경 인식 자체는 낮지만 소비/에너지 발자국도 작은 편. 이미 하고 있는 행동을 '친환경'으로 인식시켜주는 가벼운 미션이 적합.",
  },
  habit_builder: {
    label: "시작이 필요해형",
    description:
      "환경 인식이 낮고 소비/에너지 발자국도 큰 편. 부담 없이 시작할 수 있는 쉬운 미션으로 습관을 만드는 것이 우선.",
  },
};

const CONCERN_SCORE: Record<SurveyAnswers["environmentalConcern"], number> = {
  very_high: 100,
  high_but_hard: 66,
  sometimes: 33,
  low: 0,
  unsure: 50,
};

const SORTING_SCORE: Record<SurveyAnswers["recyclingFrequency"], number> = {
  always: 100,
  usually: 66,
  sometimes: 33,
  rarely: 0,
};

const ECO_DISPOSABLE_SCORE: Record<
  SurveyAnswers["disposableItemFrequency"],
  number
> = {
  rarely: 100,
  sometimes: 66,
  often: 33,
  always: 0,
};

const DELIVERY_SCORE: Record<SurveyAnswers["deliveryFrequency"], number> = {
  rarely: 0,
  weekly_1_2: 33,
  weekly_3_4: 66,
  weekly_5_plus: 100,
};

const ENERGY_SCORE: Record<SurveyAnswers["energyUsage"], number> = {
  low: 0,
  medium: 50,
  high: 100,
  unsure: 50,
};

const CONSUMPTION_SCORE: Record<
  SurveyAnswers["consumptionTendency"],
  number
> = {
  minimal: 0,
  planned: 33,
  discount_driven: 66,
  impulsive: 100,
};

const mean = (values: number[]) =>
  values.reduce((sum, v) => sum + v, 0) / values.length;

export type PersonaResult = {
  ecoActionScore: number;
  footprintScore: number;
  personaKey: PersonaKey;
};

/**
 * Pure, deterministic rule-based persona mapping. ageRange/occupation/transportMode/
 * interestArea are intentionally excluded from scoring — they're used as mission-context
 * (feasibility, tone, preferred activity type) at generation time instead (see
 * buildFeasibilityNotes in lib/ai/missions.ts).
 */
export function computePersona(answers: SurveyAnswers): PersonaResult {
  const ecoActionScore = Math.round(
    mean([
      CONCERN_SCORE[answers.environmentalConcern],
      SORTING_SCORE[answers.recyclingFrequency],
      ECO_DISPOSABLE_SCORE[answers.disposableItemFrequency],
    ]),
  );

  const footprintScore = Math.round(
    mean([
      DELIVERY_SCORE[answers.deliveryFrequency],
      ENERGY_SCORE[answers.energyUsage],
      CONSUMPTION_SCORE[answers.consumptionTendency],
    ]),
  );

  const highEcoAction = ecoActionScore >= 50;
  const highFootprint = footprintScore >= 50;

  let personaKey: PersonaKey;
  if (highEcoAction && !highFootprint) personaKey = "green_master";
  else if (highEcoAction && highFootprint) personaKey = "eco_striver";
  else if (!highEcoAction && !highFootprint) personaKey = "quiet_minimalist";
  else personaKey = "habit_builder";

  return { ecoActionScore, footprintScore, personaKey };
}
