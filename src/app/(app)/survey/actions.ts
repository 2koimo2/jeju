"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { computePersona, surveyAnswersSchema } from "@/lib/persona";
import { PERSONA_SPECIES } from "@/lib/species";

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
    ageRange: formData.get("ageRange"),
    environmentalConcern: formData.get("environmentalConcern"),
    occupation: formData.get("occupation"),
    transportMode: formData.get("transportMode"),
    deliveryFrequency: formData.get("deliveryFrequency"),
    consumptionTendency: formData.get("consumptionTendency"),
    disposableItemFrequency: formData.get("disposableItemFrequency"),
    energyUsage: formData.get("energyUsage"),
    recyclingFrequency: formData.get("recyclingFrequency"),
    interestArea: formData.get("interestArea"),
  });

  if (!parsed.success) {
    return { error: "모든 항목에 답해주세요." };
  }

  const answers = parsed.data;
  const { ecoActionScore, footprintScore, personaKey } =
    computePersona(answers);

  const answerColumns = {
    age_range: answers.ageRange,
    environmental_concern: answers.environmentalConcern,
    occupation: answers.occupation,
    transport_mode: answers.transportMode,
    delivery_frequency: answers.deliveryFrequency,
    consumption_tendency: answers.consumptionTendency,
    disposable_item_frequency: answers.disposableItemFrequency,
    energy_usage: answers.energyUsage,
    recycling_frequency: answers.recyclingFrequency,
    interest_area: answers.interestArea,
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

  // Privileged write: a user's own session must never set its own starter species
  // directly (see utils/supabase/admin.ts), and this is a one-time "first gift" —
  // ignoreDuplicates so retaking the survey later never reassigns an already-growing
  // character's species.
  const admin = createAdminClient();
  const { error: grantError } = await admin.from("seaweed_characters").upsert(
    { user_id: user.id, species: PERSONA_SPECIES[personaKey] },
    { onConflict: "user_id", ignoreDuplicates: true },
  );
  if (grantError) return { error: grantError.message };

  redirect("/survey/result");
}
