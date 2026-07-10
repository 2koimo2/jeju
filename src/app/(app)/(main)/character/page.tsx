import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requireProfile, requirePersona } from "@/lib/onboarding";
import { simulateGrowth } from "@/lib/seaweed-growth";
import type { SpeciesKey } from "@/lib/species";
import { HomeContent } from "./home-content";

type CharacterRow = {
  species: SpeciesKey | null;
  temperature_c: number;
  temp_updated_at: string;
  level_progress: number;
};

export default async function CharacterPage({
  searchParams,
}: {
  searchParams: Promise<{ missions?: string }>;
}) {
  const { missions } = await searchParams;
  const openMissions = missions === "open";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await requireProfile(supabase, user.id);
  await requirePersona(supabase, user.id);

  const { data: character } = await supabase
    .from("seaweed_characters")
    .select("species, temperature_c, temp_updated_at, level_progress")
    .eq("user_id", user.id)
    .maybeSingle<CharacterRow>();

  const typedCharacter = character ?? {
    species: "umutgasari" as SpeciesKey,
    temperature_c: 40,
    temp_updated_at: new Date().toISOString(),
    level_progress: 0,
  };

  const snapshot = simulateGrowth({
    temperatureC: typedCharacter.temperature_c,
    tempUpdatedAt: new Date(typedCharacter.temp_updated_at),
    levelProgress: typedCharacter.level_progress,
  });

  return (
    <HomeContent
      seaName={profile.sea_name}
      species={typedCharacter.species ?? "umutgasari"}
      level={snapshot.level}
      stageIndex={snapshot.stageIndex}
      temperatureC={snapshot.temperatureC}
      openMissions={openMissions}
    />
  );
}
