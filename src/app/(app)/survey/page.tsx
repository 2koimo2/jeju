import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requireProfile } from "@/lib/onboarding";
import { SurveyForm } from "./survey-form";
import type { SurveyAnswers } from "@/lib/persona";

export default async function SurveyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requireProfile(supabase, user.id);

  const { data: existing } = await supabase
    .from("user_personas")
    .select(
      "age_range, environmental_concern, occupation, transport_mode, delivery_frequency, consumption_tendency, disposable_item_frequency, energy_usage, recycling_frequency, interest_area",
    )
    .eq("user_id", user.id)
    .maybeSingle();

  const defaultAnswers: SurveyAnswers | null =
    existing && existing.age_range && existing.interest_area
      ? {
          ageRange: existing.age_range,
          environmentalConcern: existing.environmental_concern,
          occupation: existing.occupation,
          transportMode: existing.transport_mode,
          deliveryFrequency: existing.delivery_frequency,
          consumptionTendency: existing.consumption_tendency,
          disposableItemFrequency: existing.disposable_item_frequency,
          energyUsage: existing.energy_usage,
          recyclingFrequency: existing.recycling_frequency,
          interestArea: existing.interest_area,
        }
      : null;

  return <SurveyForm defaultAnswers={defaultAnswers} />;
}
