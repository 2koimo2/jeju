import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ResetForm } from "./reset-form";

export default async function ResetOnboardingPage() {
  if (process.env.NODE_ENV === "production") notFound();

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

  return <ResetForm profile={profile ?? null} />;
}
