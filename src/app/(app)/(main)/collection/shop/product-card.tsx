import Image from "next/image";
import { SPECIES_DEFS, SPECIES_NAMES } from "@/lib/species";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const speciesName = SPECIES_NAMES[product.species];
  const speciesDef = SPECIES_DEFS[product.species];
  const bannerColor = speciesDef?.bannerColor ?? "#e8ddc8";
  const badgeIcon = speciesDef?.cardImage ?? speciesDef?.image;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square overflow-hidden rounded-[15px]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div
            className="flex size-full items-center justify-center text-4xl"
            style={{ backgroundColor: bannerColor }}
          >
            🌿
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-korean truncate text-sm font-medium text-[#262321]">
          {product.title}
        </p>
        <p className="font-korean text-xl font-bold">
          <span className="text-[#ff386e]">{product.discountPct}%</span>{" "}
          <span className="text-[#262321]">
            {product.price.toLocaleString()}원
          </span>
        </p>
        <div className="flex h-[27px] w-fit items-center gap-1 rounded-full bg-white px-[9px] py-1">
          {badgeIcon ? (
            <Image
              src={badgeIcon}
              alt=""
              width={16}
              height={20}
              unoptimized
              className="h-[19px] w-auto object-contain"
            />
          ) : (
            <span className="text-sm leading-none">🌿</span>
          )}
          <span className="font-korean text-sm font-semibold whitespace-nowrap text-[#736559]">
            {speciesName} X{product.requiredCount}
          </span>
        </div>
      </div>
    </div>
  );
}
