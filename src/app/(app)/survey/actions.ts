"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { computePersona, surveyAnswersSchema } from "@/lib/persona";

export type SurveyActionState = { error: string | null };

export async function submitSurvey(
  _prevState: SurveyActionState,
  formData: FormData,
): Promise<SurveyActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = surveyAnswersSchema.safeParse({
    environmentalConcern: formData.get("environmentalConcern"),
    deliveryFrequency: formData.get("deliveryFrequency"),
    occupation: formData.get("occupation"),
    hasCar: formData.get("hasCar"),
    consumptionTendency: formData.get("consumptionTendency"),
    disposableItemFrequency: formData.get("disposableItemFrequency"),
    energyUsage: formData.get("energyUsage"),
    recyclingFrequency: formData.get("recyclingFrequency"),
  });

  if (!parsed.success) {
    return { error: "모든 항목에 답해주세요." };
  }

  const answers = parsed.data;
  const { ecoActionScore, footprintScore, personaKey } =
    computePersona(answers);

  const answerColumns = {
    environmental_concern: answers.environmentalConcern,
    delivery_frequency: answers.deliveryFrequency,
    occupation: answers.occupation,
    has_car: answers.hasCar,
    consumption_tendency: answers.consumptionTendency,
    disposable_item_frequency: answers.disposableItemFrequency,
    energy_usage: answers.energyUsage,
    recycling_frequency: answers.recyclingFrequency,
    eco_action_score: ecoActionScore,
    footprint_score: footprintScore,
    persona_key: personaKey,
  };

  const { error: historyError } = await supabase
    .from("survey_responses")
    .insert({ user_id: user.id, ...answerColumns });
  if (historyError) return { error: historyError.message };

  const { error: upsertError } = await supabase.from("user_personas").upsert(
    {
      user_id: user.id,
      ...answerColumns,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (upsertError) return { error: upsertError.message };

  redirect("/missions");
}
