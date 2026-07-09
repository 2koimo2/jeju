import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requirePersona } from "@/lib/onboarding";
import { ProofForm } from "./proof-form";
import type { MissionProofRow, MissionRow } from "../types";

const DIFFICULTY_LABEL: Record<MissionRow["difficulty"], string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

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

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div>
        <p className="text-xs text-neutral-400">
          {DIFFICULTY_LABEL[typedMission.difficulty]} ·{" "}
          {typedMission.points}P · CO2 {typedMission.co2_saved_g}g
        </p>
        <h1 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          {typedMission.title}
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          {typedMission.description}
        </p>
      </div>

      {latestProof && (
        <div className="rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800">
          <p className="font-medium text-neutral-700 dark:text-neutral-300">
            {VERDICT_LABEL[latestProof.verdict]}
          </p>
          {latestProof.reasoning && (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {latestProof.reasoning}
            </p>
          )}
        </div>
      )}

      {canSubmit && <ProofForm missionId={missionId} />}
    </div>
  );
}
