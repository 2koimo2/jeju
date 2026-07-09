"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { requirePersona } from "@/lib/onboarding";
import { generateMissionBatch } from "@/lib/ai/missions";
import { verifyMissionProof } from "@/lib/ai/verify";
import { VISION_MODEL } from "@/lib/ai/model";
import { clampToDifficultyBand } from "@/lib/missions/scoring";
import { resolveVerdictStatus } from "@/lib/missions/verification";
import { endOfKstDay } from "@/lib/time";
import type { VerificationVerdict } from "@/lib/ai/schemas";
import type { MissionRow } from "./types";

/**
 * Lazy mission generation: called with force=false on mount when the missions page has
 * no active batch for today, and with force=true from the "새 미션 받기" button. The
 * check-then-insert here has a small, tolerable race window (a rare double-click could
 * produce two same-day batches) — unlike growth crediting, this isn't hard-guarded at
 * the DB level because the worst case is just a few extra missions, not double points.
 */
export async function generateTodayMissions(formData: FormData) {
  const force = formData.get("force") === "true";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const persona = await requirePersona(supabase, user.id);

  const nowIso = new Date().toISOString();

  const { data: active } = await supabase
    .from("missions")
    .select("id, title")
    .eq("user_id", user.id)
    .gt("expires_at", nowIso);

  const activeMissions = active ?? [];

  if (!force && activeMissions.length > 0) {
    return;
  }

  if (force && activeMissions.length > 0) {
    await supabase
      .from("missions")
      .update({ expires_at: nowIso })
      .eq("user_id", user.id)
      .eq("status", "active")
      .gt("expires_at", nowIso);
  }

  const { data: recent } = await supabase
    .from("missions")
    .select("title")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const generated = await generateMissionBatch({
    personaKey: persona.persona_key,
    ecoActionScore: persona.eco_action_score,
    footprintScore: persona.footprint_score,
    occupation: persona.occupation,
    hasCar: persona.has_car,
    recentMissionTitles: (recent ?? []).map((m) => m.title),
  });

  const batchId = randomUUID();
  const expiresAt = endOfKstDay(new Date()).toISOString();

  const rows = generated.map((mission) => {
    const { points, co2SavedG } = clampToDifficultyBand(
      mission.difficulty,
      mission.suggestedPoints,
      mission.suggestedCo2SavedG,
    );
    return {
      user_id: user.id,
      batch_id: batchId,
      persona_key: persona.persona_key,
      title: mission.title,
      description: mission.description,
      difficulty: mission.difficulty,
      points,
      co2_saved_g: co2SavedG,
      verification_instructions: mission.verificationInstructions,
      expires_at: expiresAt,
    };
  });

  await supabase.from("missions").insert(rows);

  revalidatePath("/missions");
}

export type ProofActionState = {
  error: string | null;
  verdict: VerificationVerdict | null;
};

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

export async function submitMissionProof(
  missionId: string,
  _prevState: ProofActionState,
  formData: FormData,
): Promise<ProofActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: mission } = await supabase
    .from("missions")
    .select("*")
    .eq("id", missionId)
    .eq("user_id", user.id)
    .maybeSingle<MissionRow>();

  if (!mission) return { error: "미션을 찾을 수 없어요.", verdict: null };
  if (mission.status === "completed") {
    return { error: "이미 완료한 미션이에요.", verdict: null };
  }
  if (new Date(mission.expires_at) < new Date()) {
    return { error: "만료된 미션이에요.", verdict: null };
  }

  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "사진을 선택해주세요.", verdict: null };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "이미지 파일만 업로드할 수 있어요.", verdict: null };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { error: "파일 크기는 8MB 이하여야 해요.", verdict: null };
  }

  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  const photoPath = `${user.id}/${missionId}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("mission-proofs")
    .upload(photoPath, file, { contentType: file.type });
  if (uploadError) return { error: uploadError.message, verdict: null };

  const { data: proof, error: proofInsertError } = await supabase
    .from("mission_proofs")
    .insert({ mission_id: missionId, user_id: user.id, photo_path: photoPath })
    .select()
    .single();
  if (proofInsertError || !proof) {
    return {
      error: proofInsertError?.message ?? "인증 기록 생성에 실패했어요.",
      verdict: null,
    };
  }

  const { data: signed, error: signedError } = await supabase.storage
    .from("mission-proofs")
    .createSignedUrl(photoPath, 60);
  if (signedError || !signed) {
    return { error: "사진 URL 생성에 실패했어요.", verdict: null };
  }

  let verdict: VerificationVerdict;
  try {
    verdict = await verifyMissionProof({
      verificationInstructions: mission.verification_instructions,
      photoUrl: signed.signedUrl,
    });
  } catch {
    return {
      error: "AI 검증 중 오류가 발생했어요. 다시 시도해주세요.",
      verdict: null,
    };
  }

  const status = resolveVerdictStatus(verdict.passed, verdict.confidence);

  // Privileged writes from here on: a user's own session must never be able to write
  // verdict/growth data directly (see migration comments), so we switch to the
  // service-role client for exactly these two steps.
  const admin = createAdminClient();

  const { error: verdictUpdateError } = await admin
    .from("mission_proofs")
    .update({
      verdict: status,
      confidence: verdict.confidence,
      reasoning: verdict.reasoning,
      detected_elements: verdict.detectedElements,
      model_id: VISION_MODEL,
      verified_at: new Date().toISOString(),
    })
    .eq("id", proof.id);
  if (verdictUpdateError) {
    return { error: verdictUpdateError.message, verdict: null };
  }

  if (status === "passed") {
    const { error: creditError } = await admin.rpc("credit_mission_growth", {
      p_mission_proof_id: proof.id,
    });
    if (creditError) return { error: creditError.message, verdict: null };
  }

  revalidatePath("/missions");
  revalidatePath("/character");
  revalidatePath(`/missions/${missionId}`);

  return { error: null, verdict };
}
