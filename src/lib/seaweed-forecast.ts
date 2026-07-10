export type ForecastPoint = { date: string; pct: number };

export type NextMonthForecast = {
  currentPct: number;
  projectedPct: number;
  deltaPct: number;
  weeklyRatePct: number;
};

const FORECAST_HORIZON_DAYS = 30;
/** Survey history can span years with big gaps (this dataset mixes 2023 one-off
 * marine surveys with a recent weekly cadence); fitting the trend line to
 * everything lets stale, irregular old samples dominate the slope. Restrict to
 * a recent window so the projection reflects the current growth phase. */
const RECENT_WINDOW_DAYS = 90;

/**
 * Least-squares trend line over the most recent coverage readings,
 * extrapolated FORECAST_HORIZON_DAYS past the latest sample. There's no
 * forecasting service behind this — it's a simple linear fit, good enough for a
 * directional "다음 달 예상" headline rather than a scientific projection.
 */
export function projectNextMonth(
  points: ForecastPoint[],
): NextMonthForecast | null {
  if (points.length < 2) return null;

  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const latestMs = new Date(sorted[sorted.length - 1].date).getTime();
  const recent = sorted.filter(
    (p) =>
      (latestMs - new Date(p.date).getTime()) / 86_400_000 <=
      RECENT_WINDOW_DAYS,
  );
  if (recent.length < 2) return null;

  const firstMs = new Date(recent[0].date).getTime();
  const xs = recent.map(
    (p) => (new Date(p.date).getTime() - firstMs) / 86_400_000,
  );
  const ys = recent.map((p) => p.pct);
  const n = xs.length;

  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((sum, x, i) => sum + x * ys[i], 0);
  const sumXX = xs.reduce((sum, x) => sum + x * x, 0);
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return null;

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  const currentPct = ys[ys.length - 1];
  const targetX = xs[xs.length - 1] + FORECAST_HORIZON_DAYS;
  const projectedPct = Math.min(100, Math.max(0, intercept + slope * targetX));

  return {
    currentPct,
    projectedPct,
    deltaPct: projectedPct - currentPct,
    weeklyRatePct: slope * 7,
  };
}
