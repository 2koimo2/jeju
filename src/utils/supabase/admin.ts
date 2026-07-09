import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client that bypasses RLS. Use ONLY for the two privileged writes that
 * must not be reachable via a user's own session: recording an AI verification verdict
 * on mission_proofs, and crediting growth_ledger/seaweed_characters. Never import this
 * from a Client Component or expose the key to the browser.
 */
export function createAdminClient() {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY) env var",
    );
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { persistSession: false },
  });
}
