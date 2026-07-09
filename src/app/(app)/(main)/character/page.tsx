import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { levelForPoints, type SeaweedStage } from "@/lib/character";
import { requirePersona } from "@/lib/onboarding";
import { SeaweedVisual } from "./seaweed-visual";

type CharacterRow = { total_points: number; total_co2_saved_g: number };
type LedgerRow = {
  id: number;
  points_delta: number;
  co2_saved_g_delta: number;
  reason: string;
  created_at: string;
};

const STAGE_LABEL: Record<SeaweedStage, string> = {
  sprout: "새싹",
  juvenile: "어린 해초",
  mature: "무성한 해초",
  forest: "해초숲",
};

export default async function CharacterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requirePersona(supabase, user.id);

  const { data: character } = await supabase
    .from("seaweed_characters")
    .select("total_points, total_co2_saved_g")
    .eq("user_id", user.id)
    .maybeSingle();

  const typedCharacter = (character ?? {
    total_points: 0,
    total_co2_saved_g: 0,
  }) as CharacterRow;
  const progress = levelForPoints(typedCharacter.total_points);

  const { data: ledger } = await supabase
    .from("growth_ledger")
    .select("id, points_delta, co2_saved_g_delta, reason, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const recentActivity = (ledger ?? []) as LedgerRow[];
  const progressPct = Math.min(
    100,
    (progress.pointsIntoLevel / Math.max(progress.pointsForNextLevel, 1)) *
      100,
  );

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <div className="text-center">
        <p className="text-xs text-neutral-400">
          Lv.{progress.level} · {STAGE_LABEL[progress.stage]}
        </p>
        <SeaweedVisual stage={progress.stage} />
      </div>

      <div>
        <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span>
            {progress.pointsIntoLevel} / {progress.pointsForNextLevel}
          </span>
          <span>다음 레벨까지</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 px-4 py-3 text-center dark:border-neutral-800">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          누적 탄소 절감량
        </p>
        <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          {(typedCharacter.total_co2_saved_g / 1000).toFixed(1)} kg CO₂
        </p>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          최근 활동
        </h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            아직 완료한 미션이 없어요.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {recentActivity.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-neutral-600 dark:text-neutral-400">
                  {new Date(entry.created_at).toLocaleDateString("ko-KR")}
                </span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  +{entry.points_delta}P
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
