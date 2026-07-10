import Image from "next/image";
import { SPECIES_KEYS, SPECIES_DEFS, type SpeciesKey } from "@/lib/species";

export function SpeciesIconStrip({
  ownedSpecies,
}: {
  ownedSpecies?: SpeciesKey;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 pt-4 pb-1">
      {SPECIES_KEYS.map((key) => {
        const def = SPECIES_DEFS[key];
        const owned = key === ownedSpecies;
        const icon = def?.cardImage ?? def?.image;

        return (
          <a
            key={key}
            href={`#card-${key}`}
            className="flex shrink-0 flex-col items-center gap-1"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
              {icon ? (
                <Image
                  src={icon}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                  className={`h-9 w-auto object-contain ${owned ? "" : "opacity-40 grayscale"}`}
                />
              ) : (
                <span className={`text-2xl ${owned ? "" : "opacity-40 grayscale"}`}>
                  🌿
                </span>
              )}
            </div>
            <span className="font-korean text-xs font-bold text-[#644c0f]">
              X{owned ? 1 : 0}
            </span>
          </a>
        );
      })}
    </div>
  );
}
