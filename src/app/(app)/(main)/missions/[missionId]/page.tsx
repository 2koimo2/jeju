import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requirePersona } from "@/lib/onboarding";
import { MISSION_TEMP_DROP_C } from "@/lib/seaweed-growth";
import { ProofForm } from "./proof-form";
import type { MissionProofRow, MissionRow } from "../types";

// Keyed on all three historical difficulty values (not just the current
// Difficulty type) so old 'medium' missions still display a label.
const DIFFICULTY_LABEL: Record<"easy" | "medium" | "hard", string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

const DIFFICULTY_PILL_STYLE: Record<
  "easy" | "medium" | "hard",
  { bg: string; text: string }
> = {
  easy: { bg: "#d3ffff", text: "#027776" },
  medium: { bg: "#ffdee2", text: "#e03360" },
  hard: { bg: "#ffdee2", text: "#e03360" },
};

function dropC(difficulty: MissionRow["difficulty"]): number | null {
  return difficulty === "easy" || difficulty === "hard"
    ? MISSION_TEMP_DROP_C[difficulty]
    : null;
}

const VERDICT_LABEL: Record<MissionProofRow["verdict"], string> = {
  pending: "확인 중이에요",
  passed: "통과했어요",
  failed: "실패했어요",
  needs_review: "검토 중이에요",
};

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ missionId: string }>;
}) {
  const { missionId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requirePersona(supabase, user.id);

  const { data: mission } = await supabase
    .from("missions")
    .select("*")
    .eq("id", missionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!mission) notFound();
  const typedMission = mission as MissionRow;

  const { data: proofs } = await supabase
    .from("mission_proofs")
    .select("*")
    .eq("mission_id", missionId)
    .order("submitted_at", { ascending: false })
    .limit(1);

  const latestProof = (proofs?.[0] ?? null) as MissionProofRow | null;

  const canSubmit =
    typedMission.status !== "completed" &&
    new Date(typedMission.expires_at) > new Date() &&
    (!latestProof || latestProof.verdict === "failed");

  const pill = DIFFICULTY_PILL_STYLE[typedMission.difficulty];
  const drop = dropC(typedMission.difficulty);

  return (
    <div className="font-korean flex min-h-full flex-col gap-6 bg-[#f7eedd] px-4 py-6">
      <div className="flex flex-col gap-[14px]">
        <span
          className="inline-flex w-fit items-center justify-center rounded-[555px] px-[10px] py-[4px] text-xs font-medium"
          style={{ backgroundColor: pill.bg, color: pill.text }}
        >
          {DIFFICULTY_LABEL[typedMission.difficulty]}
          {drop !== null ? ` | -${drop}°C` : ""}
        </span>

        <div className="flex flex-col gap-[6px] text-black">
          <h1 className="text-[22px] font-bold">{typedMission.title}</h1>
          <p className="text-[15px] leading-[22px] text-[#4d433b]">
            {typedMission.description}
          </p>
        </div>
      </div>

      {latestProof && (
        <div className="rounded-[15px] bg-white px-4 py-3">
          <p className="text-sm font-bold text-black">
            {VERDICT_LABEL[latestProof.verdict]}
          </p>
          {latestProof.reasoning && (
            <p className="mt-1 text-xs text-[#978f88]">
              {latestProof.reasoning}
            </p>
          )}
        </div>
      )}

      {canSubmit && <ProofForm missionId={missionId} />}
    </div>
  );
}
