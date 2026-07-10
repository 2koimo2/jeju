import { SPECIES_NAMES, type SpeciesKey } from "./species";
import { lv4IconSrc } from "./collection-cards";

export const SPECIES_RATIO_ORDER = [
  "gamtae",
  "mojaban",
  "miyeok",
  "parae",
  "umutgasari",
] as const satisfies readonly SpeciesKey[];

export type SpeciesRatioKey = (typeof SPECIES_RATIO_ORDER)[number];

export type SpeciesRatioDef = {
  name: string;
  color: string;
  characterImage: string;
};

const SPECIES_RATIO_COLOR: Record<SpeciesRatioKey, string> = {
  gamtae: "#c9a227",
  mojaban: "#3f7d4a",
  miyeok: "#2f9e5c",
  parae: "#6fcf5f",
  umutgasari: "#f28cb0",
};

/** Reuses each species' Lv.4 ("2단계") growth-stage art from 도감 so the report
 * donut shows the same character art as the rest of the app instead of an
 * unrelated placeholder image. */
export const SPECIES_RATIO_DEFS: Record<SpeciesRatioKey, SpeciesRatioDef> =
  Object.fromEntries(
    SPECIES_RATIO_ORDER.map((key) => [
      key,
      {
        name: SPECIES_NAMES[key],
        color: SPECIES_RATIO_COLOR[key],
        characterImage: lv4IconSrc(key),
      },
    ]),
  ) as Record<SpeciesRatioKey, SpeciesRatioDef>;
