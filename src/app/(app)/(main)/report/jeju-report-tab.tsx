import { ExpansionTrendChart } from "@/components/charts";
import { SpeciesRatioDonut } from "./species-ratio-donut";
import { WeeklySeaweedForecast } from "./weekly-forecast-swiper";
import { SPECIES_RATIO_ORDER } from "@/lib/species-ratio";

type SurveyRow = {
  location: string;
  survey_date: string;
  total_seaweed_pct: number;
};
type SpeciesRatioRow = { species: string; pct: number };

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

  // Some survey dates have multiple readings per location; average them so
  // each (location, date) contributes exactly one point to the trend line
  // instead of duplicate-keyed, same-x spikes.
  const byLocation = new Map<string, Map<string, number[]>>();
  for (const row of surveys) {
    const byDateForLocation =
      byLocation.get(row.location) ?? new Map<string, number[]>();
    const pcts = byDateForLocation.get(row.survey_date) ?? [];
    pcts.push(row.total_seaweed_pct);
    byDateForLocation.set(row.survey_date, pcts);
    byLocation.set(row.location, byDateForLocation);
  }
  const trendSeries = Array.from(byLocation.entries()).map(
    ([location, byDateForLocation]) => ({
      location,
      points: Array.from(byDateForLocation.entries()).map(([date, pcts]) => ({
        date,
        pct: pcts.reduce((a, b) => a + b, 0) / pcts.length,
      })),
    }),
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
          <WeeklySeaweedForecast weeklyPoints={weeklyPoints} />
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
