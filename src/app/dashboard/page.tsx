import { createClient } from "@/utils/supabase/server";
import {
  ExpansionTrendChart,
  SpeciesRatioChart,
  WeeklyComparisonTile,
} from "./charts";

const SEAWEED_SPECIES = [
  "갈파래류",
  "청각류",
  "대마디말류",
  "그물바탕말류",
  "모자반류",
  "나래미역류",
  "감태류",
];

type SurveyRow = {
  id: number;
  location: string;
  survey_date: string;
  class_gbn: string | null;
  coverage_by_category: Record<string, number>;
  total_seaweed_pct: number;
  source_file: string | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("seaweed_surveys")
    .select("*")
    .order("survey_date", { ascending: true });

  const rows = (data ?? []) as SurveyRow[];

  const latest = rows.length
    ? rows.reduce((a, b) => (a.survey_date > b.survey_date ? a : b))
    : null;

  const speciesRatioData = latest
    ? SEAWEED_SPECIES.map((name) => ({
        name,
        pct: latest.coverage_by_category[name] ?? 0,
      })).filter((d) => d.pct > 0)
    : [];

  const byLocation = new Map<string, { date: string; pct: number }[]>();
  for (const row of rows) {
    const list = byLocation.get(row.location) ?? [];
    list.push({ date: row.survey_date, pct: row.total_seaweed_pct });
    byLocation.set(row.location, list);
  }
  const trendSeries = Array.from(byLocation.entries()).map(
    ([location, points]) => ({ location, points }),
  );

  // Highlight whichever site has the freshest data (currently the seeded
  // 서귀포 조성지 demo weeks) as the "this week vs last week" headline.
  const weeklyHighlight = [...byLocation.entries()]
    .filter(([, points]) => points.length >= 2)
    .sort((a, b) => {
      const latestOf = (pts: { date: string }[]) =>
        pts.reduce((m, p) => (p.date > m ? p.date : m), "");
      return latestOf(b[1]).localeCompare(latestOf(a[1]));
    })[0];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 font-sans">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
        POC 데이터 — AI Hub 샘플 27장 기반, 통계적 유의성 없음
      </div>

      <h1 className="mb-1 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
        해조류 모니터링 대시보드
      </h1>
      <p className="mb-8 text-sm text-neutral-500 dark:text-neutral-400">
        초분광 영상 분류 결과 기반 확장 정도 및 종류별 비율
      </p>

      {error && (
        <p className="text-sm text-red-600">
          데이터를 불러오지 못했습니다: {error.message}
        </p>
      )}

      {!error && rows.length === 0 && (
        <p className="text-sm text-neutral-500">
          아직 적재된 조사 데이터가 없습니다. ml/train.py → ml/infer.py →
          ml/push_to_supabase.py 를 실행해 채워주세요.
        </p>
      )}

      {rows.length > 0 && (
        <div className="flex flex-col gap-10">
          {weeklyHighlight && (
            <section>
              <WeeklyComparisonTile
                location={weeklyHighlight[0]}
                points={weeklyHighlight[1]}
              />
            </section>
          )}

          <section>
            <h2 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              종류별 비율 (최신 조사 · {latest?.survey_date} · 지점{" "}
              {latest?.location})
            </h2>
            {speciesRatioData.length > 0 ? (
              <SpeciesRatioChart data={speciesRatioData} />
            ) : (
              <p className="text-sm text-neutral-500">
                최신 조사에서 검출된 해조류 종이 없습니다.
              </p>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              확장 정도 추이 (지점별 해조류 비율 합)
            </h2>
            <ExpansionTrendChart series={trendSeries} />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              전체 조사 목록
            </h2>
            <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                  <tr>
                    <th className="px-3 py-2">지점</th>
                    <th className="px-3 py-2">조사일</th>
                    <th className="px-3 py-2">구분</th>
                    <th className="px-3 py-2">해조류 비율</th>
                    <th className="px-3 py-2">원본 파일</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-neutral-100 dark:border-neutral-800"
                    >
                      <td className="px-3 py-2">{row.location}</td>
                      <td className="px-3 py-2 tabular-nums">
                        {row.survey_date}
                      </td>
                      <td className="px-3 py-2">{row.class_gbn}</td>
                      <td className="px-3 py-2 tabular-nums">
                        {row.total_seaweed_pct.toFixed(2)}%
                      </td>
                      <td className="px-3 py-2 text-neutral-400">
                        {row.source_file}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
