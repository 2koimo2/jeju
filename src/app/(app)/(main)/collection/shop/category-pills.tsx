import Link from "next/link";
import { SPECIES_KEYS, SPECIES_NAMES, type SpeciesKey } from "@/lib/species";

export function CategoryPills({ active }: { active?: SpeciesKey }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-[20px] pb-3">
      <Link
        href="/collection/shop"
        className={`font-korean shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
          !active ? "bg-[#7f5b3b] text-white" : "bg-white text-[#978f88]"
        }`}
      >
        전체
      </Link>
      {SPECIES_KEYS.map((key) => (
        <Link
          key={key}
          href={`/collection/shop?species=${key}`}
          className={`font-korean shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
            active === key ? "bg-[#7f5b3b] text-white" : "bg-white text-[#978f88]"
          }`}
        >
          {SPECIES_NAMES[key]}
        </Link>
      ))}
    </div>
  );
}
