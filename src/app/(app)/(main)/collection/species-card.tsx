import Image from "next/image";
import Link from "next/link";
import { SPECIES_NAMES, type SpeciesKey } from "@/lib/species";
import {
  COLLECTION_CARD_DEFS,
  backdropSrc,
  type BackdropEchoLayer,
} from "@/lib/collection-cards";
import { COLLECTION_STAGE_LEVELS } from "@/lib/character";

const CHEVRON_LEFT = [71.75, 147.13, 223.14];
const CHEVRON_TOP = [350.88, 351.21, 350.88];

function BackdropEcho({
  layer,
  src,
}: {
  layer: BackdropEchoLayer;
  src: string;
}) {
  return (
    <div
      className={`absolute flex items-center justify-center ${layer.wrapperClassName}`}
    >
      <div className={`relative flex-none ${layer.innerClassName}`}>
        <div
          className="relative"
          style={{ width: layer.imgWidth, height: layer.imgHeight }}
        >
          <Image
            src={src}
            alt=""
            fill
            unoptimized
            className="object-cover"
            style={{ opacity: layer.opacity ?? 1 }}
          />
        </div>
      </div>
    </div>
  );
}

export function SpeciesCard({
  speciesKey,
  owned,
  level,
}: {
  speciesKey: SpeciesKey;
  owned: boolean;
  level: number;
}) {
  const name = SPECIES_NAMES[speciesKey];
  const card = COLLECTION_CARD_DEFS[speciesKey];
  const echoSrc = backdropSrc(speciesKey);

  return (
    <div
      id={`card-${speciesKey}`}
      className="relative h-[446.27px] w-[329.73px] shrink-0 snap-center snap-always overflow-hidden rounded-[11px] bg-[#f7eedd]"
    >
      {/* Banner: bleeds past the card's own edges, clipped by overflow-hidden above. */}
      <div
        className="absolute top-[-0.47px] left-[-56.85px] h-[163.92px] w-[445.33px] overflow-hidden"
        style={{ backgroundColor: card.bannerColor }}
      >
        <BackdropEcho layer={card.backdrop.faded} src={echoSrc} />
        <BackdropEcho layer={card.backdrop.visible} src={echoSrc} />

        <p className="font-jeju absolute top-[117.63px] left-[74.88px] text-[37.9px] whitespace-nowrap text-[#644c0f]">
          {name}
        </p>

        <div className="absolute top-[12.32px] left-[67.27px] flex h-[28.43px] w-[53.06px] items-center justify-center rounded-full bg-[#f7eedd]">
          <span className="font-korean text-[18.95px] font-black text-[#644c0f]">
            X{owned ? 1 : 0}
          </span>
        </div>
      </div>

      <p className="font-korean absolute top-[177.75px] left-[16px] w-[298.5px] text-[12px] leading-[18.95px] text-black">
        {card.description}
      </p>

      {card.stageIcons.map((icon, i) => {
        const tierLevel = COLLECTION_STAGE_LEVELS[i];
        const unlocked = owned && level >= tierLevel;
        return (
          <div
            key={tierLevel}
            className={`absolute ${unlocked ? "" : "opacity-40 grayscale"} ${
              icon.glow ? "rounded-full shadow-[0_0_20px_10px_rgba(255,255,255,0.5)]" : ""
            }`}
            style={{
              top: icon.top,
              left: icon.left,
              width: icon.width,
              height: icon.height,
            }}
          >
            <Image
              src={icon.src}
              alt=""
              fill
              unoptimized
              className={`object-cover ${icon.glow ? "rounded-full" : ""}`}
            />
          </div>
        );
      })}

      {/* Lv track */}
      <div className="absolute top-[358.06px] left-[12.49px] h-[32.35px] w-[304.75px] rounded-[5px] bg-[#7f5b3b]" />
      {COLLECTION_STAGE_LEVELS.map((tierLevel, i) => (
        <p
          key={tierLevel}
          className="absolute top-[364.42px] text-[13.27px] font-semibold whitespace-nowrap text-white"
          style={{ left: [34.2, 111.16, 187.87, 263.88][i] }}
        >
          Lv.{tierLevel}
        </p>
      ))}
      {CHEVRON_LEFT.map((left, i) => (
        <Image
          key={left}
          src="/collection/species/lv-chevron.svg"
          alt=""
          width={23.02}
          height={46.04}
          className="absolute"
          style={{ top: CHEVRON_TOP[i], left }}
        />
      ))}

      <Link
        href={`/collection/shop?species=${speciesKey}`}
        className="font-korean absolute top-[410.46px] left-1/2 -translate-x-1/2 text-[15.16px] font-semibold whitespace-nowrap text-[#736559]"
      >
        {name} 상품 보러가기 &gt;&gt;
      </Link>
    </div>
  );
}
