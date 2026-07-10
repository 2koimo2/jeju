import { SPECIES_DEFS, SPECIES_KEYS, type SpeciesKey } from "@/lib/species";
import { SurveyResultContent } from "../(app)/survey/result/result-content";

export default async function DebugSurveyResultPreview({
  searchParams,
}: {
  searchParams: Promise<{ species?: string }>;
}) {
  const { species } = await searchParams;
  const key = (species ?? "umutgasari") as SpeciesKey;
  const speciesDef = SPECIES_DEFS[key];

  if (!speciesDef) {
    return (
      <div className="p-6 text-sm text-neutral-600">
        <p>지원하는 species: {SPECIES_KEYS.join(", ")}</p>
        <p>예: ?species=mojaban</p>
      </div>
    );
  }

  return <SurveyResultContent speciesDef={speciesDef} />;
}
