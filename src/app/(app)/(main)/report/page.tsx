import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { requirePersona } from "@/lib/onboarding";
import { kstDateKey, kstMonthRange, kstYearRange } from "@/lib/time";
import { MyReportTab } from "./my-report-tab";
import { JejuReportTab } from "./jeju-report-tab";
import type { MissionRow } from "../missions/types";

type LedgerDateRow = { created_at: string };
type SurveyRow = {
  location: string;
  survey_date: string;
  total_seaweed_pct: number;
};
type SpeciesRatioRow = { species: string; pct: number };

function currentKstMonth(): string {
  const key = kstDateKey(new Date());
  return key.slice(0, 7);
}

function currentKstYear(): number {
  return Number(kstDateKey(new Date()).slice(0, 4));
}

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requirePersona(supabase, user.id);

  const tab = params.tab === "jeju" ? "jeju" : "my";
  const month = params.month ?? currentKstMonth();
  const year = Number(params.year) || currentKstYear();

  let myProps: React.ComponentProps<typeof MyReportTab> | null = null;
  let jejuProps: React.ComponentProps<typeof JejuReportTab> | null = null;

  if (tab === "my") {
    const [monthYear, monthNum] = month.split("-").map(Number);
    const { start: monthStart, end: monthEnd } = kstMonthRange(
      monthYear,
      monthNum,
    );
    const { start: yearStart, end: yearEnd } = kstYearRange(year);

    const [{ data: missions }, { data: monthLedger }, { data: yearLedger }] =
      await Promise.all([
        supabase
          .from("missions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .gt("expires_at", new Date().toISOString())
          .order("created_at", { ascending: true })
          .limit(3),
        supabase
          .from("growth_ledger")
          .select("created_at")
          .eq("user_id", user.id)
          .gte("created_at", monthStart.toISOString())
          .lt("created_at", monthEnd.toISOString()),
        supabase
          .from("growth_ledger")
          .select("created_at")
          .eq("user_id", user.id)
          .gte("created_at", yearStart.toISOString())
          .lt("created_at", yearEnd.toISOString()),
      ]);

    myProps = {
      todaysMissions: (missions ?? []) as MissionRow[],
      month,
      year,
      monthLedgerDates: ((monthLedger ?? []) as LedgerDateRow[]).map(
        (r) => r.created_at,
      ),
      yearLedgerDates: ((yearLedger ?? []) as LedgerDateRow[]).map(
        (r) => r.created_at,
      ),
    };
  } else {
    const [{ data: surveys }, { data: speciesRatio }] = await Promise.all([
      supabase
        .from("seaweed_surveys")
        .select("location, survey_date, total_seaweed_pct")
        .order("survey_date", { ascending: true }),
      supabase.from("species_ratio_demo").select("species, pct"),
    ]);

    jejuProps = {
      surveys: (surveys ?? []) as SurveyRow[],
      speciesRatio: (speciesRatio ?? []) as SpeciesRatioRow[],
    };
  }

  return (
    <div className="flex min-h-full flex-col bg-[#f7eedd]">
      <div className="font-korean flex items-baseline gap-2 px-4 pt-6 pb-6">
        <Link
          href="?tab=my"
          className={`text-[28px] ${
            tab === "my"
              ? "font-bold text-[#262321]"
              : "font-medium text-[#cbc3b8]"
          }`}
        >
          마이
        </Link>
        <Link
          href="?tab=jeju"
          className={`text-[28px] ${
            tab === "jeju"
              ? "font-bold text-[#262321]"
              : "font-medium text-[#cbc3b8]"
          }`}
        >
          제주
        </Link>
      </div>

      {tab === "my" && myProps ? (
        <MyReportTab {...myProps} />
      ) : jejuProps ? (
        <JejuReportTab {...jejuProps} />
      ) : null}
    </div>
  );
}
