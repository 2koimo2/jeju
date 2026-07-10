"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type GenderActionState = { error: string | null };

export async function submitGender(
  _prevState: GenderActionState,
  gender: "male" | "female",
): Promise<GenderActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({ gender, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  redirect("/onboarding/nickname");
}
