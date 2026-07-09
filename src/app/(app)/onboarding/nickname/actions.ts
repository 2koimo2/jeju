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
  if (seaName.length < 1 || seaName.length > 20) {
    return { error: "1자 이상 20자 이하로 입력해주세요." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ sea_name: seaName, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  redirect("/survey");
}
