import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ProfileForm } from "./profile-form";

export default async function ProfileOnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("profiles")
    .select("full_name, gender")
    .eq("user_id", user.id)
    .maybeSingle();

  const metadataName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    "";

  return (
    <ProfileForm
      defaultFullName={existing?.full_name ?? metadataName}
      defaultGender={existing?.gender ?? null}
    />
  );
}
