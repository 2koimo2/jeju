import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requirePersona } from "@/lib/onboarding";
import { MissionList } from "./mission-list";
import {
  GenerateMissionsTrigger,
  RefreshMissionsButton,
} from "./mission-controls";
import type { MissionRow } from "./types";

export default async function MissionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requirePersona(supabase, user.id);

  const { data } = await supabase
    .from("missions")
    .select("*")
    .eq("user_id", user.id)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: true });

  const activeMissions = (data ?? []) as MissionRow[];

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          오늘의 미션
        </h1>
        {activeMissions.length > 0 && <RefreshMissionsButton />}
      </div>

      {activeMissions.length === 0 ? (
        <GenerateMissionsTrigger />
      ) : (
        <MissionList missions={activeMissions} />
      )}
    </div>
  );
}
