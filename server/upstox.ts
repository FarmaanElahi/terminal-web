"use server";

import { createClient } from "@/utils/supabase/server";
import { decrypt } from "@/utils/encryption";
import { UpstoxClient } from "@/utils/upstox/client";

export async function getUpstoxMarketFeedUrl(): Promise<string> {
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
  let token: string;
  try {
    token = decrypt(integration?.data.access_token);
  } catch (e) {
    console.error("Failed to decreypt token", e);
    throw new Error("Unable to decrypt token");
  }

  const websocketUrl = await new UpstoxClient(token)
    .marketDataWebsocketUrl()
    .catch((reason) => {
      console.error("Failed to get feed url", reason, token);
      throw new Error("Failed to get feed url");
    });

  return websocketUrl.data.authorizedRedirectUri;
}
