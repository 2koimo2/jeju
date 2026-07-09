import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { GenderForm } from "./gender-form";

export default async function GenderOnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, gender")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.full_name) redirect("/onboarding/profile");

  return <GenderForm defaultGender={profile.gender ?? null} />;
}
