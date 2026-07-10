import Image from "next/image";
import { ExpansionTrendChart } from "@/components/charts";
import { SpeciesRatioDonut } from "./species-ratio-donut";
import { SPECIES_RATIO_ORDER } from "@/lib/species-ratio";

type SurveyRow = {
  location: string;
  survey_date: string;
  total_seaweed_pct: number;
};
type SpeciesRatioRow = { species: string; pct: number };

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

function WeeklyStatusCard({
  points,
}: {
  points: { date: string; pct: number }[];
}) {
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

export function JejuReportTab({
  surveys,
  speciesRatio,
}: {
  surveys: SurveyRow[];
  speciesRatio: SpeciesRatioRow[];
}) {
  // Whole-sea headline: average across every surveyed location per date,
  // not any single site — this intentionally drops the old "서귀포 조성지"
  // framing so the number reads as the whole sea forest's status.
  const byDate = new Map<string, number[]>();
  for (const row of surveys) {
    const list = byDate.get(row.survey_date) ?? [];
    list.push(row.total_seaweed_pct);
    byDate.set(row.survey_date, list);
  }
  const weeklyPoints = Array.from(byDate.entries())
    .map(([date, pcts]) => ({
      date,
      pct: pcts.reduce((a, b) => a + b, 0) / pcts.length,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const latestDate = weeklyPoints[weeklyPoints.length - 1]?.date;

  const byLocation = new Map<string, { date: string; pct: number }[]>();
  for (const row of surveys) {
    const list = byLocation.get(row.location) ?? [];
    list.push({ date: row.survey_date, pct: row.total_seaweed_pct });
    byLocation.set(row.location, list);
  }
  const trendSeries = Array.from(byLocation.entries()).map(
    ([location, points]) => ({ location, points }),
  );

  const ratioMap = new Map(speciesRatio.map((r) => [r.species, r.pct]));
  const donutData = SPECIES_RATIO_ORDER.map((key) => ({
    key,
    pct: ratioMap.get(key) ?? 0,
  }));

  return (
    <div className="flex flex-col gap-4 px-4 pb-8">
      <section className="rounded-2xl bg-white p-4">
        {weeklyPoints.length > 0 ? (
          <WeeklyStatusCard points={weeklyPoints} />
        ) : (
          <p className="font-korean text-sm text-[#978f88]">
            아직 적재된 조사 데이터가 없어요.
          </p>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="font-korean text-base font-bold text-[#5b3717]">
            종류별 비율
          </p>
          {latestDate && (
            <p className="font-korean text-xs text-[#b9b09f]">
              {latestDate}
            </p>
          )}
        </div>
        <div className="mt-3">
          <SpeciesRatioDonut data={donutData} />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4">
        <p className="font-korean text-base font-bold text-[#5b3717]">
          바다 숲 확장 정도 추이
        </p>
        {trendSeries.length > 0 ? (
          <div className="mt-3">
            <ExpansionTrendChart series={trendSeries} />
          </div>
        ) : (
          <p className="font-korean mt-3 text-sm text-[#978f88]">
            아직 적재된 조사 데이터가 없어요.
          </p>
        )}
      </section>
    </div>
  );
}
