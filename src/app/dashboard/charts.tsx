const CATEGORICAL = [
  { name: "series-1", light: "#2a78d6", dark: "#3987e5" }, // blue
  { name: "series-2", light: "#1baf7a", dark: "#199e70" }, // aqua
  { name: "series-3", light: "#eda100", dark: "#c98500" }, // yellow
];

export function WeeklyComparisonTile({
  location,
  points,
}: {
  location: string;
  points: { date: string; pct: number }[];
}) {
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const current = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;
  const delta = previous ? current.pct - previous.pct : null;
  const isUp = (delta ?? 0) >= 0;

  const sparkW = 120;
  const sparkH = 32;
  const max = Math.max(...sorted.map((p) => p.pct), 1);
  const min = Math.min(...sorted.map((p) => p.pct), 0);
  const range = max - min || 1;
  const xOf = (i: number) =>
    sorted.length <= 1 ? sparkW / 2 : (i / (sorted.length - 1)) * sparkW;
  const yOf = (pct: number) => sparkH - ((pct - min) / range) * sparkH;
  const path = sorted
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(i)} ${yOf(p.pct)}`)
    .join(" ");

  return (
    <div className="viz-root viz-stat-tile">
      <div className="viz-stat-label">이번 주 바다숲 조성 현황 · {location}</div>
      <div className="viz-stat-row">
        <div>
          <div className="viz-stat-value">{current.pct.toFixed(1)}%</div>
          {delta !== null && (
            <div className={`viz-stat-delta ${isUp ? "up" : "down"}`}>
              {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
              {delta.toFixed(1)}%p 지난 주 대비
            </div>
          )}
        </div>
        <svg
          width={sparkW}
          height={sparkH}
          viewBox={`0 0 ${sparkW} ${sparkH}`}
          role="img"
          aria-label="최근 추세"
        >
          <path
            d={path}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx={xOf(sorted.length - 1)}
            cy={yOf(current.pct)}
            r={4}
            fill="var(--series-1)"
            stroke="var(--surface-1)"
            strokeWidth={2}
          />
        </svg>
      </div>
      <div className="viz-stat-caption">
        {previous?.date ?? "-"} → {current.date}
      </div>
      <ChartStyle />
    </div>
  );
}

export function SpeciesRatioChart({
  data,
}: {
  data: { name: string; pct: number }[];
}) {
  const sorted = [...data].sort((a, b) => b.pct - a.pct);
  const max = Math.max(...sorted.map((d) => d.pct), 1);
  const barHeight = 22;
  const gap = 10;
  const labelWidth = 92;
  const chartWidth = 320;
  const height = sorted.length * (barHeight + gap);

  return (
    <div className="viz-root">
      <svg
        viewBox={`0 0 ${labelWidth + chartWidth + 48} ${height}`}
        width="100%"
        role="img"
        aria-label="해조류 종류별 비율"
      >
        {sorted.map((d, i) => {
          const y = i * (barHeight + gap);
          const w = (d.pct / max) * chartWidth;
          return (
            <g key={d.name}>
              <title>{`${d.name}: ${d.pct.toFixed(2)}%`}</title>
              <text
                x={labelWidth - 8}
                y={y + barHeight / 2}
                textAnchor="end"
                dominantBaseline="middle"
                className="viz-label"
              >
                {d.name}
              </text>
              <rect
                x={labelWidth}
                y={y}
                width={chartWidth}
                height={barHeight}
                className="viz-track"
                rx={4}
              />
              <rect
                x={labelWidth}
                y={y}
                width={Math.max(w, 2)}
                height={barHeight}
                rx={4}
                className="viz-bar"
              />
              <text
                x={labelWidth + Math.max(w, 2) + 6}
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="viz-value"
              >
                {d.pct.toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>
      <ChartStyle />
    </div>
  );
}

export function ExpansionTrendChart({
  series,
}: {
  series: { location: string; points: { date: string; pct: number }[] }[];
}) {
  const width = 560;
  const height = 220;
  const padding = { top: 12, right: 16, bottom: 28, left: 36 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const allDates = Array.from(
    new Set(series.flatMap((s) => s.points.map((p) => p.date))),
  ).sort();
  const maxPct = Math.max(
    100,
    ...series.flatMap((s) => s.points.map((p) => p.pct)),
  );

  const xOf = (date: string) => {
    const idx = allDates.indexOf(date);
    return allDates.length <= 1
      ? padding.left + plotW / 2
      : padding.left + (idx / (allDates.length - 1)) * plotW;
  };
  const yOf = (pct: number) => padding.top + plotH - (pct / maxPct) * plotH;

  return (
    <div className="viz-root">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        role="img"
        aria-label="해조류 확장 정도 추이"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padding.top + plotH * (1 - t);
          return (
            <line
              key={t}
              x1={padding.left}
              x2={width - padding.right}
              y1={y}
              y2={y}
              className="viz-grid"
            />
          );
        })}
        {allDates.map((d) => (
          <text
            key={d}
            x={xOf(d)}
            y={height - 8}
            textAnchor="middle"
            className="viz-axis"
          >
            {d.slice(5)}
          </text>
        ))}
        {series.map((s, si) => {
          const color = CATEGORICAL[si % CATEGORICAL.length];
          const points = [...s.points].sort((a, b) =>
            a.date.localeCompare(b.date),
          );
          const path = points
            .map(
              (p, i) =>
                `${i === 0 ? "M" : "L"} ${xOf(p.date)} ${yOf(p.pct)}`,
            )
            .join(" ");
          return (
            <g key={s.location}>
              <path
                d={path}
                fill="none"
                stroke={`var(--${color.name})`}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p) => (
                <circle
                  key={p.date}
                  cx={xOf(p.date)}
                  cy={yOf(p.pct)}
                  r={4}
                  fill={`var(--${color.name})`}
                  stroke="var(--surface-1)"
                  strokeWidth={2}
                >
                  <title>{`${s.location} · ${p.date}: ${p.pct.toFixed(2)}%`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
      <div className="viz-legend">
        {series.map((s, si) => {
          const color = CATEGORICAL[si % CATEGORICAL.length];
          return (
            <span key={s.location} className="viz-legend-item">
              <span
                className="viz-legend-swatch"
                style={{ background: `var(--${color.name})` }}
              />
              지점 {s.location}
            </span>
          );
        })}
      </div>
      <ChartStyle />
    </div>
  );
}

function ChartStyle() {
  return (
    <style>{`
      .viz-root {
        --surface-1: #fcfcfb;
        --text-primary: #0b0b0b;
        --text-secondary: #52514e;
        --muted: #898781;
        --gridline: #e1e0d9;
        --series-1: #2a78d6;
        --series-2: #1baf7a;
        --series-3: #eda100;
        --bar-track: #e1e0d9;
        --status-good: #0ca30c;
        --status-critical: #d03b3b;
      }
      @media (prefers-color-scheme: dark) {
        .viz-root {
          --surface-1: #1a1a19;
          --text-primary: #ffffff;
          --text-secondary: #c3c2b7;
          --muted: #898781;
          --gridline: #2c2c2a;
          --series-1: #3987e5;
          --series-2: #199e70;
          --series-3: #c98500;
          --bar-track: #2c2c2a;
          --status-good: #0ca30c;
          --status-critical: #e66767;
        }
      }
      .viz-stat-tile {
        padding: 16px; border-radius: 12px;
        border: 1px solid var(--gridline); background: var(--surface-1);
      }
      .viz-stat-label { font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; }
      .viz-stat-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
      .viz-stat-value { font-size: 32px; font-weight: 600; color: var(--text-primary); line-height: 1; }
      .viz-stat-delta { margin-top: 6px; font-size: 13px; font-weight: 500; }
      .viz-stat-delta.up { color: var(--status-good); }
      .viz-stat-delta.down { color: var(--status-critical); }
      .viz-stat-caption { margin-top: 8px; font-size: 11px; color: var(--muted); }
      .viz-label { fill: var(--text-secondary); font-size: 11px; }
      .viz-value { fill: var(--text-secondary); font-size: 11px; }
      .viz-axis { fill: var(--muted); font-size: 10px; }
      .viz-grid { stroke: var(--gridline); stroke-width: 1; }
      .viz-track { fill: var(--bar-track); }
      .viz-bar { fill: var(--series-1); }
      .viz-legend { display: flex; gap: 12px; margin-top: 8px; flex-wrap: wrap; }
      .viz-legend-item {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 12px; color: var(--text-secondary);
      }
      .viz-legend-swatch {
        width: 10px; height: 10px; border-radius: 2px; display: inline-block;
      }
    `}</style>
  );
}
