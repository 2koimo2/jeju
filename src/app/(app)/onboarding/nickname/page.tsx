import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { NicknameForm } from "./nickname-form";

export default async function NicknameOnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, gender, sea_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile || !profile.full_name || !profile.gender) {
    redirect("/onboarding/profile");
  }

  return <NicknameForm defaultSeaName={profile.sea_name ?? ""} />;
}
