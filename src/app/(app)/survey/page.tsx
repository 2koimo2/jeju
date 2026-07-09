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
      "environmental_concern, delivery_frequency, occupation, has_car, consumption_tendency, disposable_item_frequency, energy_usage, recycling_frequency",
    )
    .eq("user_id", user.id)
    .maybeSingle();

  const defaultAnswers: SurveyAnswers | null = existing
    ? {
        environmentalConcern: existing.environmental_concern,
        deliveryFrequency: existing.delivery_frequency,
        occupation: existing.occupation,
        hasCar: existing.has_car,
        consumptionTendency: existing.consumption_tendency,
        disposableItemFrequency: existing.disposable_item_frequency,
        energyUsage: existing.energy_usage,
        recyclingFrequency: existing.recycling_frequency,
      }
    : null;

  return <SurveyForm defaultAnswers={defaultAnswers} />;
}
