"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type ProfileActionState = { error: string | null };

export async function submitFullName(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fullName = String(formData.get("fullName") ?? "").trim();
  if (fullName.length < 1 || fullName.length > 30) {
    return { error: "이름을 입력해주세요." };
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) return { error: error.message };

  redirect("/onboarding/profile/gender");
}
