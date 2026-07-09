"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type GenderActionState = { error: string | null };

const GENDERS = ["male", "female", "unspecified"] as const;

export async function submitGender(
  _prevState: GenderActionState,
  formData: FormData,
): Promise<GenderActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const gender = String(formData.get("gender") ?? "");
  if (!GENDERS.includes(gender as (typeof GENDERS)[number])) {
    return { error: "성별을 선택해주세요." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ gender, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  redirect("/onboarding/nickname");
}
