import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requirePersona } from "@/lib/onboarding";
import { levelForPoints } from "@/lib/character";
import { SPECIES_KEYS, type SpeciesKey } from "@/lib/species";
import { SpeciesIconStrip } from "./species-icon-strip";
import { SpeciesCarousel } from "./species-carousel";

type CharacterRow = { species: SpeciesKey | null; total_points: number };

export default async function CollectionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requirePersona(supabase, user.id);

  const { data: character } = await supabase
    .from("seaweed_characters")
    .select("species, total_points")
    .eq("user_id", user.id)
    .maybeSingle();

  const typedCharacter = character as CharacterRow | null;
  const ownedSpecies = typedCharacter?.species ?? undefined;
  const level = levelForPoints(typedCharacter?.total_points ?? 0).level;

  return (
    <div className="flex flex-col gap-2 pb-6">
      <SpeciesIconStrip ownedSpecies={ownedSpecies} />
      <SpeciesCarousel
        speciesKeys={SPECIES_KEYS}
        ownedSpecies={ownedSpecies}
        level={level}
      />
    </div>
  );
}
