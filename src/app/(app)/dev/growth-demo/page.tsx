import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requireProfile, requirePersona } from "@/lib/onboarding";
import { GrowthDemoPlayer } from "./growth-demo-player";

export default async function GrowthDemoPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await requireProfile(supabase, user.id);
  await requirePersona(supabase, user.id);

  return <GrowthDemoPlayer seaName={profile.sea_name} />;
}
