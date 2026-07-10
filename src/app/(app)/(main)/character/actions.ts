"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { MIN_TEMP_C } from "@/lib/seaweed-growth";

/**
 * Hackathon demo cheat: triple-clicking the temperature badge instantly cools
 * the character to its lowest (happiest) temperature, so a live demo doesn't
 * have to wait out the natural 1°C/hour rise or complete real missions to
 * show the coolest state. Privileged write via the admin client — same
 * reasoning as credit_mission_growth: a user's own session must never write
 * growth data directly.
 */
export async function resetTemperatureDemo() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { error } = await admin
    .from("seaweed_characters")
    .update({
      temperature_c: MIN_TEMP_C,
      temp_updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/character");
}
