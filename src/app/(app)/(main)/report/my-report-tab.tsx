import Link from "next/link";
import { kstDateKey } from "@/lib/time";
import type { MissionRow } from "../missions/types";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#00b4ba" />
      <path
        d="M8 12.5l2.5 2.5 5.5-6"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 shrink-0" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="#c4bcae"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLink({
  href,
  direction,
}: {
  href: string;
  direction: "left" | "right";
}) {
  return (
    <Link
      href={href}
      aria-label={direction === "left" ? "이전" : "다음"}
      className="flex size-6 items-center justify-center"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
        <path
          d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="#736559"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function shiftMonth(month: string, delta: number): string {
  const [year, m] = month.split("-").map(Number);
  const total = year * 12 + (m - 1) + delta;
  const newYear = Math.floor(total / 12);
  const newMonth = (total % 12) + 1;
  return `${newYear}-${String(newMonth).padStart(2, "0")}`;
}

function MonthlyGraph({
  month,
  dailyCounts,
}: {
  month: string;
  dailyCounts: number[];
}) {
  const width = 320;
  const height = 140;
  const max = Math.max(...dailyCounts, 1);
  const xOf = (i: number) =>
    dailyCounts.length <= 1
      ? width / 2
      : (i / (dailyCounts.length - 1)) * width;
  const yOf = (v: number) => height - (v / max) * height;
  const path = dailyCounts
    .map((v, i) => `${i === 0 ? "M" : "L"} ${xOf(i)} ${yOf(v)}`)
    .join(" ");
  const lastIdx = dailyCounts.length - 1;

  const [year, m] = month.split("-").map(Number);
  const first = `${year}.${String(m).padStart(2, "0")}.01`;
  const last = `${year}.${String(m).padStart(2, "0")}.${String(
    daysInMonth(year, m),
  ).padStart(2, "0")}`;

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        role="img"
        aria-label="월별 미션 완료 추이"
      >
        <path
          d={path}
          fill="none"
          stroke="#00b4ba"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {lastIdx >= 0 && (
          <circle
            cx={xOf(lastIdx)}
            cy={yOf(dailyCounts[lastIdx])}
            r={5}
            fill="#00b4ba"
            stroke="#ffffff"
            strokeWidth={2}
          />
        )}
      </svg>
      <div className="font-korean mt-1 flex justify-between text-[11px] text-[#b9b09f]">
        <span>{first}</span>
        <span>{last}</span>
      </div>
    </div>
  );
}

const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
const HEATMAP_LEVELS = ["#eee7db", "#bfe8e2", "#7dd3c8", "#3bb8a8", "#0a8f80"];

function levelForCount(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

function YearHalfGrid({
  year,
  startMonth,
  monthLabels,
  countByDate,
}: {
  year: number;
  startMonth: number; // 1-indexed, first month of this half
  monthLabels: string[];
  countByDate: Map<string, number>;
}) {
  const blockStart = new Date(Date.UTC(year, startMonth - 1, 1));
  const blockEnd = new Date(Date.UTC(year, startMonth - 1 + 6, 1));
  const startWeekday = (blockStart.getUTCDay() + 6) % 7; // 0=Mon..6=Sun

  const days: { date: Date; week: number; weekday: number }[] = [];
  const cursor = new Date(blockStart);
  let i = 0;
  while (cursor < blockEnd) {
    const weekday = (cursor.getUTCDay() + 6) % 7;
    const week = Math.floor((i + startWeekday) / 7);
    days.push({ date: new Date(cursor), week, weekday });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    i += 1;
  }
  const weekCount = days[days.length - 1].week + 1;

  const monthColumnStarts = monthLabels.map((_, idx) => {
    const firstOfMonth = new Date(Date.UTC(year, startMonth - 1 + idx, 1));
    const offset = Math.round(
      (firstOfMonth.getTime() - blockStart.getTime()) / 86400000,
    );
    return Math.floor((offset + startWeekday) / 7);
  });

  return (
    <div>
      <div
        className="font-korean grid text-[10px] text-[#b9b09f]"
        style={{
          gridTemplateColumns: `16px repeat(${weekCount}, 1fr)`,
        }}
      >
        <span />
        {monthLabels.map((label, idx) => (
          <span
            key={label}
            style={{
              gridColumnStart: monthColumnStarts[idx] + 2,
            }}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="mt-1 flex gap-1">
        <div className="font-korean flex flex-col justify-between text-[9px] text-[#b9b09f]">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className="h-[9px] leading-[9px]">
              {label}
            </span>
          ))}
        </div>
        <div
          className="grid flex-1 gap-[3px]"
          style={{
            gridTemplateColumns: `repeat(${weekCount}, 1fr)`,
            gridTemplateRows: "repeat(7, 9px)",
            gridAutoFlow: "column",
          }}
        >
          {days.map(({ date, week, weekday }) => {
            const key = kstDateKey(date);
            const count = countByDate.get(key) ?? 0;
            return (
              <div
                key={key}
                title={`${key}: ${count}개`}
                className="rounded-[2px]"
                style={{
                  gridColumn: week + 1,
                  gridRow: weekday + 1,
                  backgroundColor: HEATMAP_LEVELS[levelForCount(count)],
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function YearHeatmap({
  year,
  countByDate,
}: {
  year: number;
  countByDate: Map<string, number>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="font-korean flex items-center gap-1 text-[11px] text-[#b9b09f]">
        <span>Less</span>
        {HEATMAP_LEVELS.map((color) => (
          <span
            key={color}
            className="size-2 rounded-[2px]"
            style={{ backgroundColor: color }}
          />
        ))}
        <span>More</span>
      </div>
      <YearHalfGrid
        year={year}
        startMonth={1}
        monthLabels={["1월", "2월", "3월", "4월", "5월", "6월"]}
        countByDate={countByDate}
      />
      <YearHalfGrid
        year={year}
        startMonth={7}
        monthLabels={["7월", "8월", "9월", "10월", "11월", "12월"]}
        countByDate={countByDate}
      />
    </div>
  );
}

export function MyReportTab({
  todaysMissions,
  month,
  year,
  monthLedgerDates,
  yearLedgerDates,
}: {
  todaysMissions: MissionRow[];
  month: string;
  year: number;
  monthLedgerDates: string[];
  yearLedgerDates: string[];
}) {
  const [monthYear, monthNum] = month.split("-").map(Number);
  const totalDays = daysInMonth(monthYear, monthNum);
  const dailyCounts = Array.from({ length: totalDays }, () => 0);
  for (const iso of monthLedgerDates) {
    const day = Number(kstDateKey(new Date(iso)).slice(8, 10));
    if (day >= 1 && day <= totalDays) dailyCounts[day - 1] += 1;
  }
  const totalThisMonth = dailyCounts.reduce((a, b) => a + b, 0);
  const avgPerDay = totalThisMonth / totalDays;

  const countByDate = new Map<string, number>();
  for (const iso of yearLedgerDates) {
    const key = kstDateKey(new Date(iso));
    countByDate.set(key, (countByDate.get(key) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-8">
      <section className="rounded-2xl bg-white p-4">
        <p className="font-korean text-base font-bold text-[#5b3717]">
          오늘의 미션 정보
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {todaysMissions.length === 0 ? (
            <p className="font-korean text-sm text-[#978f88]">
              오늘 진행 중인 미션이 없어요.
            </p>
          ) : (
            todaysMissions.map((mission) => (
              <Link
                key={mission.id}
                href={`/missions/${mission.id}`}
                className="flex items-center gap-2 rounded-xl bg-[#f4f1eb] px-3 py-3"
              >
                <CheckIcon />
                <span className="font-korean flex-1 text-sm font-semibold text-[#262321]">
                  {mission.title}
                </span>
                <ArrowIcon />
              </Link>
            ))
          )}
        </div>
        <div className="mt-2 flex justify-end">
          <Link
            href="/missions"
            className="font-korean text-sm text-[#978f88]"
          >
            더 보기 &gt;
          </Link>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="font-korean text-base font-bold text-[#5b3717]">
            월별 미션 정보
          </p>
          <div className="flex items-center gap-2">
            <ChevronLink
              href={`?tab=my&month=${shiftMonth(month, -1)}&year=${year}`}
              direction="left"
            />
            <span className="font-korean w-6 text-center text-sm font-semibold text-[#262321]">
              {monthNum}
            </span>
            <ChevronLink
              href={`?tab=my&month=${shiftMonth(month, 1)}&year=${year}`}
              direction="right"
            />
          </div>
        </div>
        <p className="font-korean mt-2 text-xs text-[#776b63]">
          지금까지, 하루 평균 미션량은 {avgPerDay.toFixed(1)}개에요.
        </p>
        <div className="mt-3">
          <MonthlyGraph month={month} dailyCounts={dailyCounts} />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="font-korean text-base font-bold text-[#5b3717]">
            연도별 미션 정보
          </p>
          <div className="flex items-center gap-2">
            <ChevronLink
              href={`?tab=my&month=${month}&year=${year - 1}`}
              direction="left"
            />
            <span className="font-korean text-sm font-semibold text-[#262321]">
              {year}
            </span>
            <ChevronLink
              href={`?tab=my&month=${month}&year=${year + 1}`}
              direction="right"
            />
          </div>
        </div>
        <div className="mt-3">
          <YearHeatmap year={year} countByDate={countByDate} />
        </div>
      </section>
    </div>
  );
}
