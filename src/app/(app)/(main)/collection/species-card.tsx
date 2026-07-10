import Image from "next/image";
import Link from "next/link";
import { SPECIES_DEFS, SPECIES_NAMES, type SpeciesKey } from "@/lib/species";
import { COLLECTION_STAGE_LEVELS } from "@/lib/character";

export function SpeciesCard({
  speciesKey,
  owned,
  level,
}: {
  speciesKey: SpeciesKey;
  owned: boolean;
  level: number;
}) {
  const def = SPECIES_DEFS[speciesKey];
  const name = SPECIES_NAMES[speciesKey];
  const description =
    def?.description ?? "아직 도감 정보가 준비되지 않았어요. 곧 만나볼 수 있어요!";
  const heroImage = def?.image;
  const stageImage = def?.cardImage ?? def?.image;

  return (
    <div
      id={`card-${speciesKey}`}
      className="w-[82%] shrink-0 snap-center px-1"
    >
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="font-korean inline-block rounded-full bg-[#f0ead9] px-3 py-1 text-xs font-bold text-[#644c0f]">
              X{owned ? 1 : 0}
            </span>
            <h2 className="font-jeju mt-2 text-3xl text-[#262321]">{name}</h2>
          </div>
          <div className="relative size-20 shrink-0">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={name}
                fill
                unoptimized
                className="object-contain"
              />
            ) : (
              <div className="flex size-full items-center justify-center rounded-full bg-[#f0ead9] text-3xl">
                🌱
              </div>
            )}
          </div>
        </div>

        <p className="font-korean mt-4 text-sm leading-relaxed text-[#4d433b]">
          {description}
        </p>

        <div className="mt-5 flex items-center justify-between">
          {COLLECTION_STAGE_LEVELS.map((tierLevel, i) => {
            const unlocked = owned && level >= tierLevel;
            return (
              <div key={tierLevel} className="flex items-center">
                {i > 0 && <span className="mx-1 text-[#d4c9bf]">›</span>}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`relative size-9 ${unlocked ? "" : "opacity-40 grayscale"}`}
                  >
                    {stageImage ? (
                      <Image
                        src={stageImage}
                        alt=""
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center rounded-full bg-[#f0ead9]">
                        🌿
                      </div>
                    )}
                  </div>
                  <span className="font-korean text-[10px] font-medium text-[#978f88]">
                    Lv.{tierLevel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href={`/collection/shop?species=${speciesKey}`}
          className="font-korean mt-5 block text-center text-sm font-medium text-[#644c0f] underline underline-offset-2"
        >
          {name} 상품 보러가기 &gt;&gt;
        </Link>
      </div>
    </div>
  );
}
