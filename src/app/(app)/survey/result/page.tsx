import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requirePersona } from "@/lib/onboarding";
import { SPECIES_DEFS, type SpeciesKey } from "@/lib/species";
import { SurveyResultContent } from "./result-content";

export default async function SurveyResultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requirePersona(supabase, user.id);

  const { data: character } = await supabase
    .from("seaweed_characters")
    .select("species")
    .eq("user_id", user.id)
    .maybeSingle();

  const species = character?.species as SpeciesKey | undefined;
  const speciesDef = species ? SPECIES_DEFS[species] : undefined;
  if (!speciesDef) redirect("/survey");

  return <SurveyResultContent speciesDef={speciesDef} />;
}
