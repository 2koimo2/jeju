import { SPECIES_NAMES, type SpeciesKey } from "./species";

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

const SPECIES_RATIO_STYLE: Record<
  SpeciesRatioKey,
  Pick<SpeciesRatioDef, "color" | "characterImage">
> = {
  gamtae: {
    color: "#c9a227",
    characterImage: "/onboarding/gender/man-neutral.png",
  },
  mojaban: {
    color: "#3f7d4a",
    characterImage: "/loading/green.png",
  },
  miyeok: {
    color: "#2f9e5c",
    characterImage: "/loading/green.png",
  },
  parae: {
    color: "#6fcf5f",
    characterImage: "/login/sea-moss-rock-character.png",
  },
  umutgasari: {
    color: "#f28cb0",
    characterImage: "/login/agar-character.png",
  },
};

export const SPECIES_RATIO_DEFS: Record<SpeciesRatioKey, SpeciesRatioDef> =
  Object.fromEntries(
    SPECIES_RATIO_ORDER.map((key) => [
      key,
      { name: SPECIES_NAMES[key], ...SPECIES_RATIO_STYLE[key] },
    ]),
  ) as Record<SpeciesRatioKey, SpeciesRatioDef>;
