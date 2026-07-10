"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type NicknameActionState = { error: string | null };

export async function submitNickname(
  _prevState: NicknameActionState,
  formData: FormData,
): Promise<NicknameActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const seaName = String(formData.get("seaName") ?? "").trim();
  if (seaName.length < 2 || seaName.length > 4) {
    return { error: "2~4글자만 사용할 수 있수다." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ sea_name: seaName, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  redirect("/onboarding/survey-intro");
}
