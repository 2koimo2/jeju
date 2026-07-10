"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { projectNextMonth, type ForecastPoint } from "@/lib/seaweed-forecast";

// material-symbols:play-arrow-rounded, rotated to point up/down.
function TrendArrowIcon({ up, color }: { up: boolean; color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`size-6 shrink-0 ${up ? "-rotate-90" : "rotate-90"}`}
      aria-hidden="true"
    >
      <path
        d="M8 17.175V6.825C8 6.54167 8.1 6.304 8.3 6.112C8.5 5.92 8.73333 5.82433 9 5.825C9.08333 5.825 9.171 5.83733 9.263 5.862C9.355 5.88667 9.44233 5.92433 9.525 5.975L17.675 11.15C17.825 11.25 17.9377 11.375 18.013 11.525C18.0883 11.675 18.1257 11.8333 18.125 12C18.1243 12.1667 18.087 12.325 18.013 12.475C17.939 12.625 17.8263 12.75 17.675 12.85L9.525 18.025C9.44167 18.075 9.35433 18.1127 9.263 18.138C9.17167 18.1633 9.084 18.1757 9 18.175C8.73333 18.175 8.5 18.079 8.3 17.887C8.1 17.695 8 17.4577 8 17.175Z"
        fill={color}
      />
    </svg>
  );
}

function WeeklyStatusCard({ points }: { points: ForecastPoint[] }) {
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const current = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;
  const delta = previous ? current.pct - previous.pct : null;
  const isUp = (delta ?? 0) >= 0;
  const deltaColor = isUp ? "#ff6579" : "#00b4ba";

  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="font-korean text-base font-bold text-[#5b3717]">
          이번 주 바다숲 조성 현황
        </p>
        <p className="font-korean mt-2 text-[40px] leading-none font-bold text-[#262321]">
          {current.pct.toFixed(1)}%
        </p>
        {delta !== null && (
          <div
            className="font-korean mt-3 flex items-center gap-1 text-[15px] font-bold"
            style={{ color: deltaColor }}
          >
            <TrendArrowIcon up={isUp} color={deltaColor} />
            <span>
              {isUp ? "+" : ""}
              {delta.toFixed(1)}%p 지난주 대비
            </span>
          </div>
        )}
      </div>
      <Image
        src="/report/seaweed-growth.svg"
        alt=""
        aria-hidden="true"
        width={100}
        height={98}
        className="mt-2 w-[100px] shrink-0"
      />
    </div>
  );
}

function NextMonthForecastCard({ points }: { points: ForecastPoint[] }) {
  const forecast = projectNextMonth(points);

  if (!forecast) {
    return (
      <p className="font-korean text-sm text-[#978f88]">
        추이를 예상하려면 조사 데이터가 더 필요해요.
      </p>
    );
  }

  const isUp = forecast.deltaPct >= 0;
  const deltaColor = isUp ? "#ff6579" : "#00b4ba";

  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="font-korean text-base font-bold text-[#5b3717]">
          다음 달 바다숲 예상 추이
        </p>
        <p className="font-korean mt-2 text-[40px] leading-none font-bold text-[#262321]">
          {forecast.projectedPct.toFixed(1)}%
        </p>
        <div
          className="font-korean mt-3 flex items-center gap-1 text-[15px] font-bold"
          style={{ color: deltaColor }}
        >
          <TrendArrowIcon up={isUp} color={deltaColor} />
          <span>
            {isUp ? "+" : ""}
            {forecast.deltaPct.toFixed(1)}%p 한 달 뒤 예상
          </span>
        </div>
        <p className="font-korean mt-1 text-xs text-[#b9b09f]">
          최근 추세 기준 주당 {forecast.weeklyRatePct >= 0 ? "+" : ""}
          {forecast.weeklyRatePct.toFixed(1)}%p
        </p>
      </div>
      <Image
        src="/report/seaweed-growth.svg"
        alt=""
        aria-hidden="true"
        width={100}
        height={98}
        className="mt-2 w-[100px] shrink-0"
      />
    </div>
  );
}

/** Swipes between this week's status and next month's projected trend, sharing
 * one card slot instead of stacking both permanently. */
export function WeeklySeaweedForecast({
  weeklyPoints,
}: {
  weeklyPoints: ForecastPoint[];
}) {
  const [page, setPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="w-full shrink-0 snap-center">
          <WeeklyStatusCard points={weeklyPoints} />
        </div>
        <div className="w-full shrink-0 snap-center">
          <NextMonthForecastCard points={weeklyPoints} />
        </div>
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {[0, 1].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`h-1.5 rounded-full transition-all ${
              page === i ? "w-4 bg-[#7f5b3b]" : "w-1.5 bg-[#e5ded4]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
