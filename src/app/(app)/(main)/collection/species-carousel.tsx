"use client";

import { useEffect, useRef, useState } from "react";
import { SpeciesCard } from "./species-card";
import type { SpeciesKey } from "@/lib/species";

export function SpeciesCarousel({
  speciesKeys,
  ownedSpecies,
  level,
}: {
  speciesKeys: readonly SpeciesKey[];
  ownedSpecies?: SpeciesKey;
  level: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateActive = () => {
      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      Array.from(container.children).forEach((child, i) => {
        const el = child as HTMLElement;
        const cardCenter = el.offsetLeft + el.offsetWidth / 2;
        const distance = Math.abs(cardCenter - containerCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      setActiveIndex(closestIndex);
    };

    updateActive();
    container.addEventListener("scroll", updateActive, { passive: true });
    return () => container.removeEventListener("scroll", updateActive);
  }, []);

  const scrollToIndex = (i: number) => {
    const container = containerRef.current;
    const card = container?.children[i] as HTMLElement | undefined;
    if (!container || !card) return;
    container.scrollTo({
      left: card.offsetLeft - (container.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {speciesKeys.map((key) => (
          <SpeciesCard
            key={key}
            speciesKey={key}
            owned={key === ownedSpecies}
            level={level}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        {speciesKeys.map((key, i) => (
          <button
            key={key}
            type="button"
            aria-label={`${i + 1}번째 카드로 이동`}
            aria-current={i === activeIndex}
            onClick={() => scrollToIndex(i)}
            className={`rounded-full transition-all ${
              i === activeIndex ? "size-2.5 bg-[#7f5b3b]" : "size-2 bg-[#d4c9bf]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
