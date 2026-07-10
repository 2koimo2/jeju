import Image from "next/image";
import { SPECIES_KEYS, speciesLv1Icon, type SpeciesKey } from "@/lib/species";

export function SpeciesIconStrip({
  ownedSpecies,
}: {
  ownedSpecies?: SpeciesKey;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 pt-4 pb-1">
      {SPECIES_KEYS.map((key) => {
        const owned = key === ownedSpecies;

        return (
          <a
            key={key}
            href={`#card-${key}`}
            className="flex shrink-0 flex-col items-center gap-1"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
              <Image
                src={speciesLv1Icon(key)}
                alt=""
                width={40}
                height={40}
                unoptimized
                className={`h-9 w-auto object-contain ${owned ? "" : "opacity-40 grayscale"}`}
              />
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
