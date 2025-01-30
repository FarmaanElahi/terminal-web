"use server";

import { createClient } from "@/utils/supabase/server";
import { decrypt } from "@/utils/encryption";

export async function getUpstoxToken() {
  const client = await createClient();
  const integration = await client
    .from("user_integrations")
    .select("access_token")
    .eq("type", "upstox")
    .maybeSingle();

  if (!integration?.data?.access_token) {
    throw new Error("No upstox found token");
  }
  // Decrypt the token
  return decrypt(integration?.data.access_token);
}
