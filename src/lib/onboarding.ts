import { redirect } from "next/navigation";
import type { createClient } from "@/utils/supabase/server";
import type { PersonaKey, SurveyAnswers } from "@/lib/persona";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type ProfileRow = {
  full_name: string;
  gender: "male" | "female" | "unspecified";
  sea_name: string | null;
};

/**
 * Redirects to whichever onboarding step is still incomplete (profile, then sea
 * name), otherwise returns the completed profile row. Call at the top of any page
 * that comes after onboarding in the flow.
 */
export async function requireProfile(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<ProfileRow & { sea_name: string }> {
  const { data } = await supabase
    .from("profiles")
    .select("full_name, gender, sea_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) redirect("/onboarding/profile");
  if (!data.sea_name) redirect("/onboarding/nickname");

  return data as ProfileRow & { sea_name: string };
}

export type PersonaRow = {
  persona_key: PersonaKey;
  eco_action_score: number;
  footprint_score: number;
  occupation: SurveyAnswers["occupation"];
  has_car: SurveyAnswers["hasCar"];
};

/** Cascades through requireProfile, then also requires a completed survey/persona. */
export async function requirePersona(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<PersonaRow> {
  await requireProfile(supabase, userId);

  const { data } = await supabase
    .from("user_personas")
    .select(
      "persona_key, eco_action_score, footprint_score, occupation, has_car",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) redirect("/survey");

  return data as PersonaRow;
}
