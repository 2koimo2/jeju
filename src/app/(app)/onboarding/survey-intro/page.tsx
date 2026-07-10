import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requireProfile } from "@/lib/onboarding";
import { SurveyIntroContent } from "./survey-intro-content";

export default async function SurveyIntroPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requireProfile(supabase, user.id);

  return <SurveyIntroContent />;
}
