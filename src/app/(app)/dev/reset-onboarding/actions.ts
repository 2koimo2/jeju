"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type ResetOnboardingState = { error: string | null };

export async function resetOnboarding(
  _prevState: ResetOnboardingState,
  _formData: FormData,
): Promise<ResetOnboardingState> {
  if (process.env.NODE_ENV === "production") {
    return { error: "프로덕션 환경에서는 사용할 수 없습니다." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: "",
      gender: null,
      sea_name: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  redirect("/onboarding/profile");
}
